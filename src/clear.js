import { actions } from 'actions'

export let mirrorStoreState

export function copyStore(store) {
  mirrorStoreState = store.getState()
}

export function clear(modelName) {
  actions[modelName]['$$mirror$$clear']()
}
