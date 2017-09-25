import {
  createStore as _createStore,
  applyMiddleware,
  combineReducers,
  compose
} from 'redux'
import createMiddleware from './middleware'
import { AppNavigator } from './render'

export let store

export function createStore (models, initialState, middlewares = []) {

  const middleware = applyMiddleware(
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

export function replaceReducer (store, models) {
  const reducer = createReducer(models)
  store.replaceReducer(reducer)
}

function createReducer (models) {

  const reducers = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})

  // ------------

  const initialState = AppNavigator.router.getStateForAction({})

  // ReactNavigation Reducer
  const navReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state)
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state
  }
  // --------------

  return combineReducers({
    ...reducers,
    nav: navReducer
  })

}



