import React from 'react'
import mirror, {actions, connect, render} from 'index'
import {store} from 'store'


describe('the render function', () => {

  it('should create the store', () => {

    const container = document.createElement('div')

    mirror.model({
      name: 'foo',
      initialState: {
        count: 0
      }
    })

    render(<div/>, container)

    expect(store).toBeDefined()
    expect(store.getState).toBeInstanceOf(Function)
    expect(store.getState().foo).toEqual({count: 0})
  })

  it('should connect and render', () => {

    const container = document.createElement('div')

    mirror.model({
      name: 'app',
      initialState: {
        count: 1
      },
      reducers: {
        increment(state) {
          return {...state, count: state.count + 1}
        }
      }
    })

    /* eslint react/prop-types: 0 */
    const Comp = props => <div id="app" onClick={actions.app.increment}>{props.count}</div>

    const App = connect(({app}) => app)(Comp)

    render(<App/>, container)

    const app = container.querySelector('#app')

    expect(app.textContent).toEqual('1')

    // call the action
    actions.app.increment()

    expect(app.textContent).toEqual('2')
  })

  it('should inject models dynamically', () => {

    const container = document.createElement('div')

    mirror.model({
      name: 'model1',
      initialState: {
        count: 0
      }
    })

    render(<div/>, container)

    expect(store.getState().model1).toEqual({count: 0})

    // create another model
    mirror.model({
      name: 'model2',
      initialState: {
        foo: 'foo'
      }
    })

    // re-render
    render()

    expect(store.getState().model1).toEqual({count: 0})
    expect(store.getState().model2).toEqual({foo: 'foo'})
  })


})
