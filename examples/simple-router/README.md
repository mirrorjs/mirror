## Simple Router

### Get started

```js
npm i
npm start
```

### Tips

If the routes are nested in the router , and you want to **connect** the component of the routes to listen some change in **store**. You may find that the routes render could not be triggered. The reason is that the nested routes can't find the router context from the parent component. The solution is:

```
 import React, { Component } from 'react'
 import { withRouter, connect, render } from 'mirrorx'


 render(<Router basename="/" hashType="hashbang">
        <Root/>
      </Router>,document.getElementById('root'))

 // ...
 class App extends Component {
  render () {
    return (
      ...<div>
          <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/sites' component={Sites}/>
            <Route path='/setting' component={Setting}/>
          </Switch>
        </div>
      ...
    )
  }
}

const Root = withRouter(connect(state => { return {somestate: state.somestate}; })(App))
```

The same issue which you can also check in [React Router 4 (beta 8) won't render components if using redux connect #4671](https://github.com/ReactTraining/react-router/issues/4671).


