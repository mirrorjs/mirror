import React from 'react'
import PropTypes from 'prop-types'
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history'
import { ConnectedRouter, routerActions } from 'react-router-redux'

import { options } from './defaults'
import { dispatch } from './middleware'
import { actions } from './actions'

export let history = null

export default function Router({ history: _history, children, ...others }) {

  // Add `push`, `replace`, `go`, `goForward` and `goBack` methods to actions.routing,
  // when called, will dispatch the crresponding action provided by react-router-redux.
  actions.routing = Object.keys(routerActions).reduce((memo, action) => {
    memo[action] = (...args) => {
      dispatch(routerActions[action](...args))
    }
    return memo
  }, {})

  // Support for `basename` etc props for Router,
  // see https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md
  if (!_history) {
    _history = createHistory(others)
  }

  history = _history

  // ConnectedRouter will use the store from Provider automatically
  return (
    <ConnectedRouter history={_history}>
      {children}
    </ConnectedRouter>
  )
}

Router.propTypes = {
  children: PropTypes.element.isRequired,
  history: PropTypes.object
}

function createHistory(props) {

  const { historyMode } = options

  const historyModes = {
    browser: createBrowserHistory,
    hash: createHashHistory,
    memory: createMemoryHistory,
  }

  history = historyModes[historyMode](props)

  return history
}
