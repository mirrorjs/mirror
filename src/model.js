import { resolveReducers, addActions } from './actions'

const isObject = target => Object.prototype.toString.call(target) === '[object Object]'

export const models = []

export default function model(m) {
  const { name, reducers, initialState, effects } = validateModel(m)

  const reducer = getReducer(resolveReducers(name, reducers), initialState)

  const toAdd = { name, reducer }

  models.push(toAdd)

  addActions(name, reducers, effects)

  return toAdd
}

function validateModel(m = {}) {
  const { name, reducers, effects } = m

  if (!name || typeof name !== 'string') {
    throw new Error(`Model name must be a valid string!`)
  }

  if (name === 'routing') {
    throw new Error(`Model name can not be "routing", it is used by react-router-redux!`)
  }

  if (models.find(item => item.name === name)) {
    throw new Error(`Model "${name}" has been created, please select another name!`)
  }

  if (reducers !== undefined && !isObject(reducers)) {
    throw new Error(`Model reducers must be a valid object!`)
  }

  if (effects !== undefined && !isObject(effects)) {
    throw new Error(`Model effects must be a valid object!`)
  }

  m.reducers = filterReducers(reducers)
  m.effects = filterReducers(effects)

  return m
}


// If initialState is not specified, then set it to null
function getReducer(reducers, initialState = null) {

  return (state = initialState, action) => {
    if (typeof reducers[action.type] === 'function') {
      return reducers[action.type](state, action.data)
    }
    return state
  }
}

function filterReducers(reducers) {
  if (!reducers) {
    return reducers
  }

  return Object.keys(reducers)
    .reduce((acc, action) => {
      // Filter out non-function entries
      if (typeof reducers[action] === 'function') {
        acc[action] = reducers[action]
      }
      return acc
    }, {})
}
