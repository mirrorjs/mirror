import React from 'react'
import {actions} from 'mirrorx'

const Link = ({active, children, filter}) => {

  if (active) {
    return <span>{children}</span>
  }

  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault()
        actions.todos.setVisibility(filter)
      }}
    >
      {children}
    </a>
  )
}

export default Link
