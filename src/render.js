import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { options } from './defaults'
import { models } from './model'
import { store, createStore, replaceReducer } from './store'

let started = false
let Root

const defaultCallback =
  (createStore, rootReducer, initialState, enhancer) => createStore(rootReducer, initialState, enhancer)

export default function render(component, container, callback, cb) {

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
    let _callback = (typeof cb === 'undefined') ? defaultCallback : cb
    createStore(_callback, models, reducers, initialState, middlewares)
  }

  // Use named function get a proper displayName
  Root = function Root() {
    return (
      <Provider store={store}>
        {(typeof component) === 'function' ? component() : component}
      </Provider>
    )
  }

  started = true

  global.document && ReactDOM.render(<Root/>, container, callback)

  return Root
}


export function RootProvider(props) {
  const { initialState, middlewares, reducers } = options
  if (started) {
    replaceReducer(store, models, reducers)
    if (arguments.length === 0) {
      return <Root/>
    }
  } else {
    createStore(models, reducers, initialState, middlewares)
  }
  Root = function Root() {
    return (
      <Provider store={store}>
        {props.children}
      </Provider>
    )
  }
  started = true
  return <Root/>
}
