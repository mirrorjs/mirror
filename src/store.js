import {applyMiddleware, combineReducers, compose, createStore as _createStore} from 'redux'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import {combineReducers as immutableCombineReducers} from 'redux-immutable'

import createMiddleware from './middleware'
import {getHistory} from './router'
import {options} from './defaults'

export let store

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

  if (options.immutable) {
    return immutableCombineReducers({
      ...reducers, routing: routerReducer
    })
  }else{
    return combineReducers({
      ...reducers,
      routing: routerReducer
    })
  }

}
