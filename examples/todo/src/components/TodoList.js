import React from 'react'
import {actions} from 'mirrorx'

import Todo from './Todo'

const TodoList = ({todos}) => (
  <ul>
    {
      todos.map(todo => (
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => actions.todos.toggle(todo.id)}
        />
      ))
    }
  </ul>
)

export default TodoList
