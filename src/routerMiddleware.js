/**
 * @credit react-router-redux
 * @see https://github.com/ReactTraining/react-router/blob/master/packages/react-router-redux/modules/middleware.js
 *
 * This is the routerMiddleware from react-router-redux, but to use
 * the global `history` object instead of the passed one.
 */

import { CALL_HISTORY_METHOD } from 'react-router-redux'
import { history } from './router'

export default function routerMiddleware() {
  return () => next => action => {
    if (action.type !== CALL_HISTORY_METHOD) {
      return next(action)
    }

    const { payload: { method, args } } = action
    history[method](...args)
  }
}
