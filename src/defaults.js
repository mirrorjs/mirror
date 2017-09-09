import { effects, addEffect } from './effects'

export const options = {
  // global initial state
  // initialState: undefined,

  // Should be one of ['browser', 'hash', 'memory']
  // Learn more: https://github.com/ReactTraining/history/blob/master/README.md
  historyMode: 'browser',

  // A list of the standard Redux middleware
  middlewares: [],

  // A list of additional reducers
  reducers: {},

  // An overwrite of the existing effect handler
  addEffect: addEffect(effects),

}

const historyModes = ['browser', 'hash', 'memory']
const isObject = target => Object.prototype.toString.call(target) === '[object Object]'

export default function defaults(opts = {}) {

  const {
    historyMode,
    middlewares,
    reducers,
    addEffect,
  } = opts

  if (historyMode && !~historyModes.indexOf(historyMode)) {
    throw new Error(`historyMode "${historyMode}" is invalid, must be one of ${historyModes.join(', ')}!`)
  }

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`)
  }

  if (reducers && !isObject(reducers)) {
    throw new Error(`middlewares "${reducers}" is invalid, must be an Array!`)
  }

  if (addEffect) {
    if (typeof addEffect !== 'function' || typeof addEffect({}) !== 'function') {
      throw new Error(`addEffect "${addEffect}" is invalid, must be a function that returns a function`)
    } else {
      // create effects handler with initial effects object
      opts.addEffect = opts.addEffect(effects)
    }
  }

  Object.keys(opts).forEach(key => {
    options[key] = opts[key]
  })
}
