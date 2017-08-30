import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { options } from './defaults'
import { models } from './model'
import { store, createStore, replaceReducer } from './store'

let started = false
let Root

export default function render(component, container, callback) {

  const { initialState, middlewares, reducers } = options

  if (started) {

    // If app has rendered, do `store.replaceReducer` to update store.
    replaceReducer(store, models, reducers)

    // Call `render` without arguments means *re-render*. Since store has updated,
    // `component` will automatically be updated, so no need to `ReactDOM.render` again.
    if (arguments.length === 0) {
      return Root
    }

  } else {
    createStore(models, reducers, initialState, middlewares)
  }

  // Use named function get a proper displayName
  Root = function Root() {
    return (
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  started = true

  global.document && ReactDOM.render(<Root/>, container, callback)

  return Root
}
