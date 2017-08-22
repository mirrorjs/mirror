export const options = {
  // global initial state
  // initialState: undefined,

  // Should be one of ['browser', 'hash', 'memory']
  // Learn more: https://github.com/ReactTraining/history/blob/master/README.md
  historyMode: 'browser',

  // A list of the standard Redux middleware
  middlewares: [],

  immutable: false
}

const historyModes = ['browser', 'hash', 'memory']

export default function defaults(opts = {}) {

  const {
    historyMode,
    middlewares,
    immutable
  } = opts

  if (historyMode && !~historyModes.indexOf(historyMode)) {
    throw new Error(`historyMode "${historyMode}" is invalid, must be one of ${historyModes.join(', ')}!`)
  }

  if (middlewares && !Array.isArray(middlewares)) {
    throw new Error(`middlewares "${middlewares}" is invalid, must be an Array!`)
  }

  if (immutable && typeof immutable != 'boolean') {
    throw new Error(`immutable "${immutable}" is invalid, must be an boolean!`)
  }

  Object.keys(opts).forEach(key => options[key] = opts[key])

}
