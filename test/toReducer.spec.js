import { createStore, applyMiddleware } from 'redux'

beforeEach(() => {
  jest.resetModules()
})

// use jest fake timers
jest.useFakeTimers()

describe('mirror.toReducer', () => {

  it('should return void reducer when no model reducers', () => {
    const mirror = require('index')

    expect(mirror.toReducer()).toBeInstanceOf(Function)
    expect(mirror.toReducer()(0)).toBe(0)

    mirror.model({
      name: 'app'
    })

    expect(mirror.toReducer()).toBeInstanceOf(Function)
  })

  it('should return a standard reducer', () => {
    const mirror = require('index')

    mirror.model({
      initialState: 0,
      name: 'count',
      reducers: {
        increment(state) {
          return state + 1
        },
        decrement(state) {
          return state - 1
        },
        add(state, data) {
          return state + data
        }
      }
    })

    const reducer = mirror.toReducer()

    const store = createStore(reducer)

    expect(store).toBeInstanceOf(Object)
    expect(store.getState().count).toBe(0)

    store.dispatch({ type: 'count/increment' })
    expect(store.getState().count).toBe(1)

    store.dispatch({ type: 'count/add', data: 10 })
    expect(store.getState().count).toBe(11)
  })

  it('must apply middleware to use actions', () => {
    const mirror = require('index')
    const { actions, middleware } = mirror

    mirror.model({
      initialState: 0,
      name: 'count',
      reducers: {
        add(state, data) {
          return state + data
        }
      },
      effects: {
        addAsync(data, getState) {
          setTimeout(() => {
            actions.count.add(data)
          }, 1000)
        }
      }
    })

    const reducer = mirror.toReducer()

    const store = createStore(reducer, applyMiddleware(middleware))

    expect(store.getState().count).toBe(0)

    actions.count.add(10)
    expect(store.getState().count).toBe(10)

    actions.count.addAsync(20)
    jest.runAllTimers()

    expect(store.getState().count).toBe(30)
  })
})
