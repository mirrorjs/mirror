import React from 'react'

import mirror, { render } from 'mirrorx'
import { Router } from 'mirrorx/router'
import App from './App'

mirror.defaults({
  historyMode: 'hash'
})

render(
  <Router basename="/test" hashType="hashbang">
    <App/>
  </Router>
, document.getElementById('root'))
