import React from 'react'
import mirror, { actions, render, connect } from 'index'
import { clear } from 'clear'

describe('the clear function', () => {


  it('should clear', () => {

    const container = document.createElement('div')

    mirror.model({
      name: 'app',
      initialState: {
        count: 0
      },
      reducers: {
        increment(state) {
          return { ...state, count: state.count + 1 }
        }
      }
    })

    /* eslint react/prop-types: 0 */
    const Comp = props => <div id="app" onClick={actions.app.increment}>{props.count}</div>

    const App = connect(({ app }) => app)(Comp)

    render(<App/>, container)

    const app = container.querySelector('#app')

    expect(app.textContent).toEqual('0')

    // call the action
    actions.app.increment()

    expect(app.textContent).toEqual('1')

    actions.app.increment()

    expect(app.textContent).toEqual('2')

    clear('app')

    expect(app.textContent).toEqual('0')

  })


})
