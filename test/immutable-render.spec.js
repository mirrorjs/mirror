/**
 * Created by yuany on 2017/8/22.
 */

import React from 'react'
import mirror, {actions, connect, render} from 'index'
import {fromJS} from 'immutable'

describe('the immutable render function', function () {

  it('should connect and immutable render', function () {
    const container = document.createElement('div')

    mirror.defaults({
      immutable: true
    })

    mirror.model({
      name: 'app',
      initialState: fromJS({
        count: 1
      }),
      reducers: {
        increment(state) {
          return state.merge({count: state.get('count') + 1})
        }
      }
    })

    /* eslint react/prop-types: 0 */
    const Comp = props => <div id="app" onClick={actions.app.increment}>{props.count}</div>

    const App = connect((store) => {
      return store.get('app').toJS()
    })(Comp)

    render(<App/>, container)

    const app = container.querySelector('#app')

    expect(app.textContent).toEqual('1')

    // call the action
    actions.app.increment()

    expect(app.textContent).toEqual('2')
  })

})
