import { effects } from './effects'
import { hooks } from './hook'

function warning () {
  throw new Error(
    'You are calling "dispatch" or "getState" without applying mirrorMiddleware! ' +
    'Please create your store with mirrorMiddleware first!'
  )
}

export let dispatch = warning

export let getState = warning

export default function createMiddleware () {
  return middlewareAPI => {
    dispatch = middlewareAPI.dispatch
    getState = middlewareAPI.getState

    return next => action => {

      const result = next(action)

      let effectResult

      if (typeof effects[action.type] === 'function') {
        effectResult = effects[action.type](action.data, getState)
      }

      hooks.forEach(hook => hook(action, getState))

      return effectResult || result
    }
  }
}
