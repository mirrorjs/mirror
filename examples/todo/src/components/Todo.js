import React from 'react'

const Todo = ({text, completed, ...rest}) => (
  <li style={{textDecoration: completed ? 'line-through' : 'none'}} {...rest}>
    {text}
  </li>
)

export default Todo
