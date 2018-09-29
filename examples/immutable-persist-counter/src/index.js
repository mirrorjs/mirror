import React from 'react'

import mirror, { render, Router, Route } from 'mirrorx'
import App from './App'
import { persist } from './persist'

const callback = (createStore, reducer, initialState, enhancer) => (
  persist(createStore, reducer, initialState, enhancer))

render(<App/>, document.getElementById('root'), null, callback)
