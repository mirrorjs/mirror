import React from 'react'

import mirror, {render, Router} from 'mirrorx'
import App from './App'

mirror.defaults({
  historyMode: 'hash'
})

render(
  <Router basename="/test" hashType="hashbang">
    <App/>
  </Router>
, document.getElementById('root'))
