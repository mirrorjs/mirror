import { persistStore, persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import storage from 'redux-persist/lib/storage'

const config = {
  key: 'root',
  storage,
  transforms: [immutableTransform()],
}

export let store, persistor

export function persist(createStore, rootReducer, initializeState, enhancer) {
  let reducer = persistReducer(config, rootReducer)
  store = createStore(reducer, initializeState, enhancer)
  persistor = persistStore(store)
  return store
}

export default {
  persistor,
  store,
}
