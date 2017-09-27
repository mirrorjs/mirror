import React from 'react'
import PropTypes from 'prop-types'
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import { routerReducer, ConnectedRouter } from 'react-router-redux'

import { options } from '../defaults'
import { actions } from '../actions'
import { models } from '../model'
import { replaceReducer } from '../store'

const historyMethods = ['push', 'replace', 'go', 'goForward', 'goBack']

export default function Router({ history, children, ...others }, context) {

  // Support for `basename` etc props for Router,
  // see https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md
  if (!history) {
    history = createHistory(others)
  }

  // Add routerReducer to have a `routing` state in store, and allow user to listen to
  // route changes by `mirror.hook`.
  const { store } = context
  replaceReducer(store, models, {
    ...options.reducers,
    routing: routerReducer
  })

  // Add `push`, `replace`, `go`, `goForward` and `goBack` methods to actions.routing,
  // when called, will change routes and dispatch the crresponding action provided by react-router-redux.
  actions.routing = historyMethods.reduce((memo, method) => {
    memo[method] = (...args) => history[method](...args)
    return memo
  }, {})

  // Ignore props.store
  return (
    <ConnectedRouter store={store} history={history}>
      {children}
    </ConnectedRouter>
  )
}

Router.propTypes = {
  children: PropTypes.element.isRequired,
  history: PropTypes.object
}

Router.contextTypes = {
  store: PropTypes.object.isRequired
}

function createHistory(props) {

  const { historyMode } = options

  const historyModes = {
    browser: createBrowserHistory,
    hash: createHashHistory,
    memory: createMemoryHistory
  }

  return historyModes[historyMode](props)
}
