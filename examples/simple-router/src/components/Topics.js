import React from 'react'
import {Route, Link} from 'mirrorx'

import Topic from '../components/Topic'
import AddTopic from '../components/AddTopic'

const Topics = ({topics}) => (
  <div>
    <h2>Topics</h2>
    <ul>
      {
        topics.map((topic, idx) => (
          <li key={idx}>
            <Link to={`/topics/${idx}`}>{topic}</Link>
          </li>
        ))
      }
    </ul>
    <Route path={`/topics/:topicId`} render={({match}) => (
      <Topic topic={topics.find((item, idx) => idx == match.params.topicId)}/>
    )}/>
    <Route exact path="/topics" component={AddTopic}/>
  </div>
)

export default Topics
