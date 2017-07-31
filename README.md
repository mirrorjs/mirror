# Mirror

#### [以中文查看](https://github.com/mirrorjs/mirror/blob/master/README_zh.md)

A simple and powerful React framework with minimal API and zero boilerplate. (Inspired by [dva](https://github.com/dvajs/dva) and [jumpsuit](https://github.com/jumpsuit/jumpsuit))

> Painless React and Redux.

* [Introduction](#introduction)
* [Guides](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md)
  * [State management](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md#state-management)
  * [Routing](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md#routing)
  * [Rendering](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md#rendering)
  * [Hooks](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md#hooks)
* [Get Started](#get-started)
* [Examples](#examples)
* [API](https://github.com/mirrorjs/mirror/blob/master/docs/api.md)
* [FAQ](#faq)

## Introduction

Mirror is a front-end framework based on [React](https://facebook.github.io/react), [Redux](http://redux.js.org/docs/introduction/) and [react-router](https://github.com/ReactTraining/react-router). It encapsulates *state management*, *routing* and other essential things to build web apps together in very few methods, and makes it much easier to use:

* **Minimal API**

Mirror has very minimal APIs, only [4 of them are newly introduced](https://github.com/mirrorjs/mirror/blob/master/docs/api.md), the rest are all of existed ones from `React` or `Redux`, or `react-router`, like `render` and `connect`(although most of them are enhanced).

* **Easy to start**

You don't have to learn some new things to get started with Mirror, the only requirement is a basic understanding of `React`, `Redux` and `react-router`, you can learn more from the [Redux Docs](http://redux.js.org/docs/introduction/) and [react-router Docs](https://github.com/ReactTraining/react-router). In fact, You can start writing your app from [the first line of your code](#get-started).

* **Simple actions, sync or async**

No manually created action types or action creators, no explicitly `dispatch`s, no thunk or saga stuff -- just [call a function to dispatch your actions](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#actions).

* **Support loading models dynamically**

In large apps, it's very likely that not all `reducer`s and `state`s(`model`s) are defined the same time. In this case you may need to dynamically inject a model into your app's store. Mirror provides a [very simple way](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#rendercomponent-container-callback) to do that.

* **Full-featured hook mechanism**

[Hooks](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#mirrorhookaction-getstate-) give you the power to monitor every `Redux` action you dispatched, and do whatever you want.


## Get Started

### Creating an App

Use [create-react-app](https://github.com/facebookincubator/create-react-app) to create an app:

```sh
$ npm i -g create-react-app
$ create-react-app my-app
$ cd my-app
```

After creating, install Mirror from npm:

```
$ npm i --save mirrorx
$ npm start
```

### `index.js`

```js
import React from 'react'
import mirror, {actions, connect, render} from 'mirrorx'

// declare Redux state, reducers and actions,
// all actions will be added to `actions` object from mirror
mirror.model({
  name: 'app',
  initialState: 0,
  reducers: {
    increment(state) {
      return state + 1
    },
    decrement(state) {
      return state - 1
    }
  }
})

// connect state with component
const App = connect(state => {
  return {count: state.app}
})(props => (
    <div>
      <h1>{props.count}</h1>
      {/* dispatch the action */}
      <button onClick={() => actions.app.decrement()}>-</button>
      <button onClick={() => actions.app.increment()}>+</button>
    </div>
  )
)

// start the app
render(<App/>, document.getElementById('root'))
```

### [Demo](https://www.webpackbin.com/bins/-Kmdm2zpS4JBvzbKBbIc)

## Examples

* [Counter](https://github.com/mirrorjs/mirror/blob/master/examples/counter)
* [Simple-Router](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router)
* [Todo](https://github.com/mirrorjs/mirror/blob/master/examples/todo)


## FAQ

##### Does Mirror support [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)?

Yes.

##### Can I use extra Redux middlewares?

Yes, speicify them in `mirror.defaults`, learn more from the Docs.

##### Which version of react-router does Mirror use?

react-router v4.

