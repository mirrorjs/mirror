beforeEach(() => {
  jest.resetModules()
})

describe('the hook method', () => {

  it('hooks should be an array', () => {
    const { hooks } = require('hook')

    expect(hooks).toEqual([])
  })

  it('throws if hook is not function', () => {
    const mirror = require('index')

    expect(() => {
      mirror.hook(1)
    }).toThrow(/must be a function/)

    expect(() => {
      mirror.hook(noop => noop)
    }).not.toThrow()
  })

  it('mirror.hook should add hook', () => {
    const mirror = require('index')
    const { hooks } = require('hook')

    const fn = jest.fn()

    mirror.hook(fn)

    expect(hooks).toEqual([fn])
  })

  it('dispatch action should call hook', () => {
    const mirror = require('index')
    const { createStore } = require('store')
    const { actions } = mirror

    const fn = jest.fn()

    const model = mirror.model({
      name: 'app',
      initialState: 0,
      reducers: {
        add(state, data) {
          return state + data
        }
      },
      effects: {
        async myEffect() {}
      }
    })

    createStore([model])

    mirror.hook(fn)

    expect(fn).not.toBeCalled()

    actions.app.add(1)

    expect(fn).toBeCalled()
  })

  it('call function returned by hook should remove hook', () => {
    const mirror = require('index')
    const { createStore } = require('store')
    const { actions } = mirror

    let log = []
    let state

    const model = mirror.model({
      name: 'app',
      initialState: 0,
      reducers: {
        add(state, data) {
          return state + data
        }
      },
      effects: {
        async myEffect() {}
      }
    })

    createStore([model])

    const unhook = mirror.hook((action, getState) => {
      if (action.type === 'app/add') {
        log.push('add')
      }
      if (action.type === 'app/myEffect') {
        log.push('myEffect')
      }
      state = getState().app
    })

    actions.app.add(2)
    actions.app.myEffect()

    expect(log).toEqual(['add', 'myEffect'])
    expect(state).toEqual(2)

    // remove hook
    unhook()

    actions.app.add(10)
    actions.app.myEffect()

    expect(log).toEqual(['add', 'myEffect'])
    expect(state).toEqual(2)
  })
})
