import {
  createStore as _createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux'
import {routerMiddleware, routerReducer} from 'react-router-redux'

import createMiddleware from './middleware'
import {getHistory} from './router'
import {options} from './defaults'

export let store

export function getStore() {
  const { models } = require('model')
  const {initialState, middlewares} = options
  return createStore(models, initialState, middlewares)
}

export function createStore(models, initialState, middlewares = []) {

  const middleware = applyMiddleware(
    routerMiddleware(getHistory()),
    ...middlewares,
    createMiddleware()
  )

  const enhancers = [middleware]

  let composeEnhancers = compose

  // Following line to exclude from coverage report:
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== 'production') {
    // Redux devtools extension support.
    if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
      composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    }
  }

  const reducer = createReducer(models)
  const enhancer = composeEnhancers(...enhancers)

  store = _createStore(reducer, initialState, enhancer)

  return store
}

export function replaceReducer(store, models) {
  const reducer = createReducer(models)
  store.replaceReducer(reducer)
}

function createReducer(models) {

  const reducers = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})

  return combineReducers({
    ...reducers,
    routing: routerReducer
  })

}
