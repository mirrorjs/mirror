import {createStore, applyMiddleware} from 'redux'
import createMiddleware, {dispatch} from 'middleware'
import {addEffect} from 'effects'

describe('the middleware', () => {

  it('should export dispatch and call effect function when dispatch effect', () => {

    const fn = jest.fn()

    const reducer = (state = 0, action) => {
      switch(action.type) {
        case 'add':
          return state + action.data
        default:
          return state
      }
    }

    // register an effect
    addEffect('myEffect', fn)

    const store = createStore(reducer, applyMiddleware(createMiddleware()))

    expect(dispatch).toBeDefined()

    dispatch({type: 'add', data: 1})

    expect(store.getState()).toEqual(1)

    expect(fn).not.toBeCalled()

    dispatch({type: 'myEffect'})

    expect(fn).toBeCalled()
  })
})
