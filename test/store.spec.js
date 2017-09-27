// Test for global exported store object
import { store as _store, createStore } from 'store'

beforeEach(() => {
  jest.resetModules()
})

describe('create store', () => {

  it('should create a redux store', () => {
    const mirror = require('index')

    const model = mirror.model({
      name: 'app',
      initialState: {
        count: 0
      },
      reducers: {
        add(state, data) {
          return { ...state, count: state.count + data }
        }
      }
    })

    const store = createStore([model])

    expect(store).toBeDefined()
    expect(store.getState).toBeInstanceOf(Function)
    expect(store.getState().app).toEqual({ count: 0 })
  })

  it('exported store should be the created store', () => {
    const mirror = require('index')

    const model = mirror.model({
      name: 'app',
      reducers: {
        id(state) {
          return state
        }
      }
    })

    const store = createStore([model])

    expect(_store).toBe(store)
  })

  it('initialState should be null if not specified', () => {
    const mirror = require('index')

    const model = mirror.model({
      name: 'app',
      reducers: {
        id(state) {
          return state
        }
      }
    })

    const store = createStore([model])

    expect(store.getState()).toEqual({ app: null })
  })

  it('should update redux store by raw dispatch', () => {
    const mirror = require('index')

    const model = mirror.model({
      name: 'app',
      initialState: {
        count: 0
      },
      reducers: {
        add(state, data) {
          return { ...state, count: state.count + data }
        }
      }
    })

    const store = createStore([model])

    store.dispatch({
      type: 'app/add',
      data: 1
    })

    expect(store.getState().app).toEqual({ count: 1 })
  })

})
