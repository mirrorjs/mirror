import React from 'react'
import mirror, {actions, connect} from 'mirrorx'

import './App.css'

mirror.model({
  name: 'app',
  initialState: 0,
  reducers: {
    increment(state) {
      return state + 1
    },
    decrement(state) {
      return state - 1
    }
  },
  effects: {
    async incrementAsync() {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      actions.app.increment()
    }
  }
})

const App = props => {
  return (
    <div id="counter-app">
      <h1>{props.count}</h1>
      <div className="btn-wrap">
        <button onClick={() => actions.app.decrement()}>-</button>
        <button onClick={() => actions.app.increment()}>+</button>
        <button style={{width: 100}} onClick={() => actions.app.incrementAsync()}>+ Async</button>
      </div>
    </div>
  )
}

export default connect(state => {
  return {count: state.app}
})(App)
