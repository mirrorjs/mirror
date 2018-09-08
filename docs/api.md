# API

* [mirror.model](#mirrormodelname-initialstate-reducers-effects)
  * [`name`](#-name)
  * [`initialState`](#-initialState)
  * [`reducers`](#-reducers)
  * [`effects`](#-effects)
* [actions](#actions)
* [mirror.hook](#mirrorhookaction-getstate--)
* [mirror.defaults](#mirrordefaultsoptions)
  * [`initialState`](#-optionsinitialstate)
  * [`historyMode`](#-optionshistorymode)
  * [`middlewares`](#-optionsmiddlewares)
  * [`reducers`](#-optionsreducers)
  * [`addEffect`](#-optionsaddeffect)
* [connect](#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
* [render](#rendercomponent-container-callback)
* [Router](#router)

### mirror.model({name, initialState, reducers, effects})

This method is used to create and inject a model. A "model" is a combination of Redux's `state`, `action` and `reducer`. Calling `mirror.model` will automatically create actions and reducers, which will be used to create `Redux` store.

Basically, **it's a simple and powerful way to organize you `Redux` stuff**.

#### * `name`

To create a model, **`name` must be provided and be a valid string**. It is the name of the model, which means it will be used as the namespace of the future-to-create `Redux` store.

Suppose you create a model like this:

```js
import mirror from 'mirrorx'

mirror.model({
  name: 'app',
})
```

Then you will get a `Redux` store like this:

```js
// ...

store.getState()
// {app: null}
```

The model `name` is where your `Redux` state goes in you root store(of course, it's important to `actions` too, we'll cover that later).

Also note that the value of the created store's `app` state is `null`, if you want a different, more meaningful value, then you need to pass an `initialState`.

> Note: Mirror uses [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux), so you **can not** use `routing` as model name.

#### * `initialState`

As its name indicated, `initialState` is the initial state of a model, nothing special. It is used as the `initialState` of a standard `Redux` reducer.

**It is not required, and could be anything**. If `initialState` is not specified, then it will be `null`, as demonstrated above.

Create model:

```js
import mirror from 'mirrorx'

mirror.model({
  name: 'app',
+ initialState: 0,
})
```

After store is created:

```js
store.getState()
// {app: 0}
```

#### * `reducers`

`reducers` is where you put your `Redux` reducers. The principle here is **one reducer, one action**, so you don't need to care about the action type you are dealing with.

```js
-import mirror from 'mirrorx'
+import mirror, {actions} from 'mirrorx'

mirror.model({
  name: 'app',
  initialState: 0,
+ reducers: {
+   add(state, data) {
+     return state + data
+   },
+ },
})
```

Execute the code above, Mirror will do 3 things behind the scenes:

1. Create a [reducer](http://redux.js.org/docs/basics/Reducers.html);
2. Create a [action type](http://redux.js.org/docs/basics/Actions.html) (`app/add` in this case), which will be captured by the created reducer;
3. Add a function whose name is the reducer's name under `actions.<modelName>` object. This function, when called, will `dispatch` the very action created above.

Here, we can see that model's `name` has another usage:

```js
// ...
typeof actions.app
// 'object'

typeof actions.app.add
// 'function'

actions.app.add(1)
// Same as:
//
// dispatch({
//   type: 'app/add',
//   data: 1
// })

// ...
store.getState()
// {app: 1}
```

Yes, model `name` will be an attribute of the `actions` object, who it self is an object too. And **all functions you defined in `reducers` will be added as methods to that object under the same name.**

Functions defined in `reducers` are most of the part a `Redux` reducer(**so it must be a [pure function](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md#oh-to-be-pure-again) too**), except one tiny difference:

```js
// Redux standard reducer
function reduxReducer(state, {type, data}) {
  // do something, return some other state
}

// reducer defined in `reducers`
function reducerInReducers(state, data) {
  // do something, return some other state
}
```

For the standard `Redux` reducer, you pass an action object as the second parameter; while for the "reducer" defined in model's reducers, **you pass the action data as the second parameter**, because you don't have to care about the action type -- Mirror does that for you.

What parameter should you pass when calling methods added in `actions.<modelName>`? **Just the action data**.

```js
// ...

// You don't need to pass a `state` when dispath actions, right?
actions.app.add(100)
```

Every reducer of every model you created will be combined together(using Redux's [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html)), and then used to create your `Redux` store.

> Note: non-function entries in `reducers` is pointless, and will be ignored(same as `effects`):
>
> ```js
> import mirror, {actions} from 'mirrorx'
>
> mirror.model({
>   name: 'app',
>   reducers: {
>     a: 1
>   },
> })
>
> actions.app // undefined
> ```


#### * `effects`

**`effects` are [async actions of Redux](http://redux.js.org/docs/advanced/AsyncActions.html)**. In functional programming, [`effect`](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md#side-effects-may-include) is the interaction with the world outside of a function. Since async actions do interact with the outside world, so they surely are effects.

An `effect` does not directly update your `Redux` state, but invokes other "sync actions" to update the state, usually after some asynchronous operations(like HTTP requests).

Like `reducers`, **every function you defined in `effects` will be added to `actions.<modelName>` as a method with the same name**, and calling this method will call the original function.

```js
import mirror, {actions} from 'mirrorx'

mirror.model({
  name: 'app',
  initialState: 0,
  reducers: {
    add(state, data) {
      return state + data
    },
  },
+ effects: {
+   async myEffect(data, getState) {
+     const res = await Promise.resolve(data)
+     actions.app.add(res)
+   }
+ },
})
```

Now, `actions.app` will have 2 methods:

* `actions.app.add`
* `actions.app.myEffect`

There is no magic here, calling `actions.app.myEffect` will dispatch an action and run the exact code in `effects.myEffect`:

```js
// ...

// First, dispatch the action:
// dispatch({
//   type: 'app/myEffect',
//   data: 10
// })
//
// Second, invoke the method:
// effects.myEffect(10)
actions.app.myEffect(10)

// ...
store.getState()
// {app: 10}
```

That's it, all you have to do is call the methods Mirror automatically added to `actions.<modelName>`, and your async actions is dispatched! Maybe you have used some great middlewares to handle async actions, such as [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-saga](https://redux-saga.js.org). But none of them is as simple as Mirror is.

Functions you defined in `effects` will get 2 arguments:

* `data` - The data you pass when calling methods in `actions.<modelName>`.
* `getState` - It's actually `store.getState`, will return the root state of your store when called.

But, when calling the corresponding methods Mirror added to `actions.<modelName>` , you only need to pass the above `data` parameter to it -- if you want to.

**`async/await` is the recommended way to define effects, but is not the only way.**

You can go `Promise`:

```js
// ...

effects: {
  promisedEffect(data, getState) {
    return Promise.resolve(data).then(result => {
      // call your sync actions
    })
  }
}
```

Or, you can even go the old school `callback`(**discouraged**):

```js
// ...

effects: {
  callbackEffect(data, getState) {
    setTimeout(() => {
      // call your sync actions
    }, 1000)
  }
}
```

**The point is, you can handle your async operations in whatever way you want, Mirror provides a consistent API to manage them.**

> Note: action name in `effects` should not be duplicated with those in `reducers`:
>
> ```js
> import mirror, {actions} from 'mirrorx'
>
> // Will throw an error
> mirror.model({
>   name: 'app',
>   reducers: {
>     add(state, data) {
>     }
>   },
>   effects: {
>     add(data, getState) {
>     }
>   }
> })
> ```



### actions

The `actions` object contains both your Redux `action`s and `reducer`s. Calling methods in it will `dispatch` some secret action, which will be captured by functions you defined in `reducers` and `effects` object.

In Mirror, all actions and effects are generated automatically and "namespaced”, meaning, you can't manually create an `action`, and more importantly, **you don't have to**.

You don't have to explicitly create and dispatch any action at all. If you want to create an `action` and a `reducer` to handle it, don't bother to add an `action type constant`(or an `action creator`), and then add a `reducer`, just throw a reducer in `reducers`, that's all.

Thus, you don't have to jump through files or directories to determine which action type should be handled by which reducer.

For example, run:

```js
actions.app.add(1)
```

Is exactly the same as the following code:

```js
dispatch({
  type: 'app/add',
  data: 1
})
```

Plus, using this global `actions` to handle `Redux` actions, you can easily tell the "dependencies" between different modules:

In a.js:

```js
// a.js
import mirror, {actions} from 'mirrorx'

mirror.model({
  name: 'a',
  initialState: 0,
  reducers: {
    add(state, data) {
      return state + data
    },
  },
})
```

In b.js:

```js
// b.js
import mirror, {actions} from 'mirrorx'

mirror.model({
  name: 'b',
  effects: {
    async foo(state, data) {
      const res = await Promise.resolve(data)
      // update state of model `a`
      actions.a.add(data)
    },
  },
})
```

#### * `actions.routing`

If the enhanced [`Router`](#router) component provided by Mirror is used in your app, then you'll get `actions.routing` for free.

There are 5 methods in `actions.routing`:

* `push(location)` - Pushes a new location to history, becoming the current location.
* `replace(location)` - Replaces the current location in history.
* `go` - Moves backwards or forwards a relative number of locations in history.
* `goForward` - Moves forward one location. Equivalent to go(1).
* `goBack` - Moves backwards one location. Equivalent to go(-1).

The usage of these methods are **exactly the same** with [history API](https://github.com/ReactTraining/history/blob/v3/docs/GettingStarted.md#navigation). And thanks to [react-router-redux](https://github.com/reactjs/react-router-redux), an action will be dispatched when called, so your history will be synced with your store.

```js
import mirror, {actions} from 'mirrorx'

// ...

actions.routing.push('/foo/bar')
// => http://example.com/foo/bar

actions.routing.push({
  pathname: '/foo/bar',
  search: '?search=123'
})
// => http://example.com/foo/bar?search=123
```

You can [learn more from here](https://github.com/ReactTraining/history/blob/v3/docs/Location.md#location).

> Note: if your app does not use [`Router`](#router), `actions.routing` would be `undefined`.

### mirror.hook((action, getState) => {})

Add a hook to monitor actions that have been dispatched.

```js
import mirror, {actions} from 'mirrorx'

// ...

const locationChangeHook = mirror.hook((action, getState) => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    console.log('Location has just changed')
  }
})

const countHook = mirror.hook((action, getState) => {
  if (getState().app.count === 10) {
    console.log('You have just reached 10!')
  }
})

// Remove hooks
locationChangeHook()
countHook()
```

### mirror.defaults(options)

`mirror.defaults` is a pretty intuitive API, you use it to configure your Mirror app.

`mirror.defaults` can be called multiple times.

#### * `options.initialState`

* Default: `undefined`

The [`preloadedState`](http://redux.js.org/docs/api/createStore.html) for your Mirror app's store.

```js
mirror.defaults({
  initialState: {app: 1}
})

mirror.model({
  name: 'app',
  // ...
})

// ...

store.getState()
// {app: 1}
```

#### * `options.historyMode`

* Default: `browser`

The [history type](https://github.com/ReactTraining/history#usage) for your router, there are 3 optional values:

* `browser` - A DOM-specific implementation, useful in web browsers that support the HTML5 history API.
* `hash` - A DOM-specific implementation for legacy web browsers.
* `memory` - An in-memory history implementation, useful in testing and non-DOM environments like React Native.

For more information, check out the [history](https://github.com/ReactTraining/history) package.

#### * `options.middlewares`

* Default: `[]`

Specifies a list of [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html).

This option is useful if you want to use some third party middlewares. In this case, you have to [`connect`](#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) without `mapDispatchToProps` specified to get `props.dispatch` method, so you can dispatch actions manually.

#### * `options.reducers`

* Default: `{}`

Specifies some custom reducers. Reducers defined here must be standard Redux reducers, and this will be directly handled by [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html).

For example, to use [redux-form](https://redux-form.com/), you can add redux-form's reducer as the following:

```js
import mirror from 'mirrorx'
import { reducer as formReducer } from 'redux-form'

mirror.defaults({
  reducers: {
    form: formReducer
  }
})
```

##### Update, not replace

There's something special about `options.reducers`, that is its `key-value`s will be **merged** into the previous ones instead of replacing them, since you can call `mirror.defaults` multiple times. That's the case when you call it after your app has been [started](#rendercomponent-container-callback), for example:

```js
// after this call, your store will hava a standard reducer with namespace
// of `a`
mirror.defaults({
  reducers: {
    // standard Redux reducer
    a: (state, data) => {}
  }
})

// ...

// then somewhere in your app, you can add other standard Redux reducers
mirror.defaults({
  reducers: {
    // standard Redux reducer
    b: (state, data) => {}
  }
})
```

After the second call, your store will have 2 reducers: `a` and `b`. 

#### * `options.addEffect`

* Default: `(effects) => (name, handler) => { effects[name] = handler }`

Presents an option to configure how effects are created. Checkout [mirror-saga](https://github.com/ShMcK/mirror-saga) for more information.

### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

`connect` connects your `React` component to your `Redux` store. This is exactly the same [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) method from [react-redux](https://github.com/reactjs/react-redux).

You must `connect` your component if it needs the data from your store; but it's not necessary to `connect` if your component only wants to dispatch `Redux` actions, because the `actions` object is accessible everywhere in your app, even your [presentational components](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components).

> Note: if you `connect` your component without `mapDispatchToProps` specified, then you'll get `props.dispatch`, which gives you the power to use some third party middlewares. This is the only case you should manually call `dispatch` in you component, in other cases, always use methods in `actions` to dispatch actions.

### render([component], [container], [callback])

`render` is an enhanced [`ReactDOM.render`](https://facebook.github.io/react/docs/react-dom.html#render), it starts your Mirror app.

It first creates your `Redux` store, then renders your component to DOM using `ReactDOM.render`。**`render` takes exactly the same parameters as `ReactDOM.render` does.**

You can call `render` multiple times in your app. The first time being called, `render` will create a `Redux` store using all the `reducers` and `effects` you defined through `mirror.model` method. After that, all later calls will [replace your store's reducer](http://redux.js.org/docs/api/Store.html#replaceReducer) and re-render your app.

What's the point of that? It allows you to inject models dynamically, it's very convenient for code-splitting.

#### Update models on the fly

For example, suppose you have an `app.js`:

```js
// app.js

import React from 'react'
import mirror, {actions, connect, render} from 'mirrorx'

mirror.model({
  name: 'foo',
  initialState: 0
})

const App = connect(({foo, bar}) => {
  return {foo, bar}
})(props => {
  return (
    <div>
      <div>{props.foo}</div>
      <div>{props.bar}</div>
    </div>
  )
})

render(<App/>, document.getElementById('root'))
```

After `render`, your app will be rendered as:

```html
<div>
  <div>0</div>
  <div></div>
</div>
```

Then, suppose you have an async component/model which can be loaded by tools like [react-loadable](https://github.com/jamiebuilds/react-loadable):

```js
// asyncComponent.js

// inside this async component, you define an "async model"
mirror.model({
  name: 'bar',
  initialState: 'state of bar'
})
```


```js
// app.js

// ...

// some where in your app, after loading above component and model,
// call `render()` will "register" the async model and re-render your app.
//
// NOTE: the `load` function is NOT a real implementation, it's just psuedo code.
load('ayncComponent.js').then(() => {
  mirror.render()
})
```

**Calling `render` without arguments will re-render your app**. So above code will generate the following `html`:

```html
<div>
  <div>0</div>
- <div></div>
+ <div>state of bar</div>
</div>
```

#### Update standard reducers on the fly

Plus, after the "async component/model" has been loaded, it's possible to call `mirorr.defaults` to add some standard Redux reducers on the fly:


```js
// app.js

// NOTE: the `load` function is NOT a real implementation, it's just psuedo code.
load('ayncComponent.js').then(() => {

  // `MyAsyncReducer` will be **merged** into the existed ones, not replace them
  mirror.defaults({
    reducers: {
      MyAsyncReducer: (state, data) => {},
      // ...
    }
  })
  
  // do the re-render
  mirror.render()
})
``` 

This is very useful for large apps.

> Note: it's not recommended to pass `component` and `container` to re-render your app, because React may unmount/mount your app. If you just want to re-render, call `render` without any arguments.

### Router

> Mirror uses [react-router@4.x](https://github.com/ReactTraining/react-router), so if you're from react-router 2.x/3.x, you should checkout the [Migrating from v2/v3 to v4 Guide](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md).

This is an enhanced `Router` component from [react-router](https://github.com/ReactTraining/react-router/tree/master/packages/react-router). The `history` and `store` is automatically passed to `Router`, all you have to do is declare your routes. But if you like, you can also create your own `history` object and pass it as a prop to `Router` component.

What about props like [`basename`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md#basename-string) or [`getUserConfirmation`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md#getuserconfirmation-func)? Well, Mirror's `Router` handles them all! For a complete list of props `Router` takes, check out [`BrowserRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md), [`HashRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/HashRouter.md) and [`MemoryRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/MemoryRouter.md).

The following components from `react-router` are also exported by Mirror:

* [`Route`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md)
* [`Switch`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Switch.md)
* [`Redirect`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md)
* [`Link`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md)
* [`NavLink`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md)
* [`Prompt`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Prompt.md)
* [`withRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md)

A simple example:

```js
import {render, Router, Route, Link} from 'mirrorx'

// ...

const App = () => (
  <div>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>
    </nav>

    <div>
      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </div>
)


render(
  <Router>
    <App/>
  </Router>
, document.getElementById('root'))
```

For more details, checkout the [simple-router example](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router), and [react-router Docs](https://github.com/ReactTraining/react-router/tree/master/packages/react-router).

