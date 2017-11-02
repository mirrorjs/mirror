## Simple Router

### Get started

```js
npm i
npm start
```

#### Tips

If the routes are nested in the router , and you want to ** connect ** the component of the routes to listen some change in ths ** store ** . You may find that the routes render could not be triggered. The reason is that the nested routes can`t find the router context from the parent component. so the solution is below:
```
 import React, { Component } from 'react';
 import { withRouter,connect,render } from 'mirror';


 render(<Router basename="/" hashType="hashbang">
        <Root/>
      </Router>,document.getElementById('root'));


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
    );
  }
}

const Root = withRouter(connect(state => { return {somestate: state.somestate}; })(App));

```

The same issue which you can also check in [react-router](React Router 4 (beta 8) won't render components if using redux connect).