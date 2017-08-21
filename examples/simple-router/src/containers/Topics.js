import React from 'react'
import mirror, { connect, render } from 'mirrorx'

import Topics from '../components/Topics'

mirror.model({
  name: 'topics',
  initialState: [
    'foo'
  ],
  reducers: {
    add(state, topic) {
      return [...state, topic]
    }
  }
})
render()

export default connect(({topics}) => ({topics}))(Topics)
