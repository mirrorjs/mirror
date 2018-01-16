import { options } from './defaults'
import { models } from './model'
import { store, createStore, replaceReducer } from './store'

let started = false
let Root

export default function init() {

  const { initialState, middlewares, reducers } = options

  if (started) {

    // If app has rendered, do `store.replaceReducer` to update store.
    replaceReducer(store, models, reducers)


  } else {
    createStore(models, reducers, initialState, middlewares)
  }

  return store
}
