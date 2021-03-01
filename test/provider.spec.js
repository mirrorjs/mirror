import React from 'react'
import ReactDOM from 'react-dom'
import mirror, { actions, Provider, connect } from 'index'


describe('the Provider Component Wrapper', () => {


  it('should connect and render', () => {

    const container = document.createElement('div')

    mirror.model({
      name: 'app',
      initialState: {
        count: 1
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

    ReactDOM.render(<Provider><App/></Provider>, container)

    const app = container.querySelector('#app')

    expect(app.textContent).toEqual('1')

    // call the action
    actions.app.increment()

    expect(app.textContent).toEqual('2')
  })
})
