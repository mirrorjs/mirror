import { dispatch } from './middleware'
import { options } from './defaults'

const SEP = '/'

export const actions = {}

export function addActions(modelName, reducers = {}, effects = {}) {

  if (Object.keys(effects).length || Object.keys(reducers).length) {
    actions[modelName] = actions[modelName] || {}
  }

  each(reducers, actionName => {
    // A single-argument function, whose argument is the payload data of a normal redux action,
    // and also the `data` param of corresponding method defined in model.reducers.
    actions[modelName][actionName] = actionCreator(modelName, actionName)
  })

  each(effects, effectName => {
    if (actions[modelName][effectName]) {
      throw new Error(`Action name "${effectName}" has been used! Please select another name as effect name!`)
    }

    options.addEffect(`${modelName}${SEP}${effectName}`, effects[effectName])

    // Effect is like normal action, except it is handled by mirror middleware
    actions[modelName][effectName] = actionCreator(modelName, effectName)
    // Allow packages to differentiate effects from actions
    actions[modelName][effectName].isEffect = true
  })
}

export function resolveReducers(modelName, reducers = {}) {
  return Object.keys(reducers).reduce((acc, cur) => {
    acc[`${modelName}${SEP}${cur}`] = reducers[cur]
    return acc
  }, {})
}

function each(obj, callback) {
  Object.keys(obj).forEach(callback)
}

function actionCreator(modelName, actionName) {
  return data => (
    dispatch({
      type: `${modelName}${SEP}${actionName}`,
      data
    })
  )
}
