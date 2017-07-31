import React from 'react'
import {actions} from 'mirrorx'

const AddTopic = () => {

  let input

  const submit = () => {
    if (input.value.trim()) {
      actions.topics.add(input.value)
      input.value = ''
    }
  }

  return (
    <div>
      <input type="text" ref={el => input = el}/>
      <button onClick={submit}>Add Topic</button>
    </div>
  )
}

export default AddTopic
