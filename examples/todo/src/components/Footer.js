import React from 'react'
import Link from '../containers/Link'

const Footer = () => (
  <div>
    <Link filter="all">All</Link>
    {' '}
    <Link filter="active">Active</Link>
    {' '}
    <Link filter="completed">Completed</Link>
  </div>
)

export default Footer
