import { effects, addEffect } from './effects'

export const options = {
  // global initial state
  // initialState: undefined,

  // A list of the standard Redux middleware
  middlewares: [],

  // `options.reducers` will be directly handled by `combineReducers`,
  // so reducers defined here must be standard Redux reducer:
  //
  // reducers: {
  //   add: (state, action) => {}
  // }
  //
  reducers: {},

  // An overwrite of the existing effect handler
  addEffect: addEffect(effects),

}

export default function defaults(opts = {}) {

  const {
    middlewares,
    addEffect
  } = opts

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`)
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
