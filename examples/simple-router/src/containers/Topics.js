import React from 'react'
import mirror, {connect} from 'mirrorx'

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

export default connect(({topics}) => ({topics}))(Topics)
