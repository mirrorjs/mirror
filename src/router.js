import React from 'react'
import PropTypes from 'prop-types'
import createBrowserHistory from 'history/createBrowserHistory'
import createHashHistory from 'history/createHashHistory'
import createMemoryHistory from 'history/createMemoryHistory'
import {ConnectedRouter, routerActions} from 'react-router-redux'

import {options} from './defaults'
import {dispatch} from './middleware'
import {actions} from './actions'

let history

export default function Router({history = getHistory(), children}) {

  // Add `push`, `replace`, `go`, `goForward` and `goBack` methods to actions.routing,
  // when called, will dispatch the crresponding action provided by react-router-redux.
  actions.routing = Object.keys(routerActions).reduce((memo, action) => {
    memo[action] = (...args) => {
      dispatch(routerActions[action](...args))
    }
    return memo
  }, {})

  // ConnectedRouter will use the store from Provider automatically
  return (
    <ConnectedRouter history={history}>
      {children}
    </ConnectedRouter>
  )
}

Router.propTypes = {
  children: PropTypes.element.isRequired,
  history: PropTypes.object
}

export function getHistory() {

  if (history) {
    return history
  }

  const {historyMode} = options

  const historyModes = {
    browser: createBrowserHistory,
    hash: createHashHistory,
    memory: createMemoryHistory,
  }

  history = historyModes[historyMode]()

  return history
}
