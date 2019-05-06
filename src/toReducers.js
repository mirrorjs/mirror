import { models } from './model'

export default function toReducers() {
  return models.reduce((acc, cur) => {
    acc[cur.name] = cur.reducer
    return acc
  }, {})
}
