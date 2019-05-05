import { models } from './model'
import { combineReducers } from 'redux'

const id = any => any

export default function toReducer() {
  const modelReducers = models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})
  return Object.keys(modelReducers).length ? combineReducers(modelReducers) : id
}
