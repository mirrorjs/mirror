import React from 'react'
import {actions} from 'mirrorx'

const Topic = ({topic}) => (
  <div>
    <h3>{topic ? topic : 'Topic not found'}</h3>
    <button onClick={() => actions.routing.push('/topics')}>Back</button>
  </div>
)

export default Topic
