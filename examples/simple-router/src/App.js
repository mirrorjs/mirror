import React from 'react'
import {Route} from 'mirrorx'

import Header from './components/Header'
import Home from './components/Home'
import About from './components/About'
import asyncComponent from './asyncComponent'

const Topics = asyncComponent(() => import('./containers/Topics'))

const App = () => {
  return (
    <div>
      <Header/>
      <hr/>
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/topics" component={Topics}/>
      </div>
    </div>
  )
}

export default App
