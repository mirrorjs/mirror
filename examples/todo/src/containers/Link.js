import React from 'react'
import {connect} from 'mirrorx'
import Link from '../components/Link'

export default connect((state, props) => {
  return {
    active: state.todos.visibility === props.filter
  }
})(Link)
