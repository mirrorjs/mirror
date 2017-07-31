import React from 'react'
import {actions} from 'mirrorx'

const AddTodo = () => {

  let input

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (input.value.trim()) {
            actions.todos.add(input.value)
            input.value = ''
          }
        }}
      >
        <input ref={el => input = el}/>
        {' '}
        <button type="submit">Add Todo</button>
      </form>
    </div>
  )
}

export default AddTodo
