# Mirror

[![npm version](https://img.shields.io/npm/v/mirrorx.svg?style=flat-square)](https://www.npmjs.com/package/mirrorx) [![build status](https://img.shields.io/travis/mirrorjs/mirror.svg?style=flat-square)](https://travis-ci.org/mirrorjs/mirror) [![coverage status](https://img.shields.io/coveralls/mirrorjs/mirror.svg?style=flat-square)](https://coveralls.io/github/mirrorjs/mirror?branch=master)

[查看中文](https://github.com/mirrorjs/mirror/blob/master/README_zh.md)

A simple and powerful React framework with minimal API and zero boilerplate. (Inspired by [dva](https://github.com/dvajs/dva) and [jumpsate](https://github.com/jumpsuit/jumpstate))

> Painless React and Redux.

## Why?

We love React and Redux. But it's frustrating that there are [too much boilerplates](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md) in Redux, not to mention integrating `react-router` in real-world React apps. 

Typically, a React & Redux app would look like the following:

#### `actions.js`

```js
export const ADD_TODO = 'todos/add'
export const COMPLETE_TODO = 'todos/complete'

export function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

export function completeTodo(id) {
  return {
    type: COMPLETE_TODO,
    id
  }
}
```

#### `reducers.js`

```js
import { ADD_TODO, COMPLETE_TODO } from './actions'

let nextId = 0

export default function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [...state, {text: action.text, id: nextId++}]
    case COMPLETE_TODO:
      return state.map(todo => {
        if (todo.id === action.id) todo.completed = true
        return todo
      })
    default:
      return state
  }
}
```

#### `Todos.js`

```js
import { addTodo, completeTodo } from './actions'

// ...

// somewhere in an event handler
dispatch(addTodo('a new todo'))

// in another event handler
dispatch(completeTodo(42))

// ...
```

Note that [`async actions`](http://redux.js.org/docs/advanced/AsyncActions.html) are not covered here, otherwise the code will looks more tedious, 'cause you have to import middlewares like `redux-thunk` or `redux-saga` to handle them.

### Rewrite with Mirror

#### `Todos.js`

```js
import mirror, { actions } from 'mirrorx'

let nextId = 0

mirror.model({
  name: 'todos',
  initialState: [],
  reducers: {
    add(state, text) {
      return [...state, {text, id: nextId++}]
    },
    complete(state, id) {
      return state.map(todo => {
        if (todo.id === id) todo.completed = true
        return todo
      })
    }
  }
})

// ...

// somewhere in an event handler
actions.todos.add('a new todo')

// in another event handler
actions.todos.complete(42)

// ...
```

Look, only one method to handle `actions` and `reducers`(and `async actions`)!

And, the following code:

```js
actions.todos.add('a new todo')
```

Is exactly the same as: 

```js
dispatch({
  type: 'todos/add',
  text: 'a new todo'
})
```

Efficient and simple.

## Features

* Minimal API(only 4 newly introduced)
* Easy to start
* Actions done easy, sync or async
* Support loading models dynamically
* Full-featured hook mechanism

## Getting Started

### Creating an App

Use [create-react-app](https://github.com/facebookincubator/create-react-app) to create an app:

```sh
$ npm i -g create-react-app
$ create-react-app my-app
```

After creating, install Mirror from npm:

```sh
$ cd my-app
$ npm i --save mirrorx
$ npm start
```

### `index.js`

```js
import React from 'react'
import mirror, {actions, connect, render} from 'mirrorx'

// declare Redux state, reducers and actions,
// all actions will be added to `actions`.
mirror.model({
  name: 'app',
  initialState: 0,
  reducers: {
    increment(state) { return state + 1 },
    decrement(state) { return state - 1 }
  },
  effects: {
    async incrementAsync() {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
      actions.app.increment()
    }
  }
})

// connect state with component
const App = connect(state => {
  return {count: state.app}
})(props => (
    <div>
      <h1>{props.count}</h1>
      {/* dispatch the actions */}
      <button onClick={() => actions.app.decrement()}>-</button>
      <button onClick={() => actions.app.increment()}>+</button>
      {/* dispatch the async action */}
      <button onClick={() => actions.app.incrementAsync()}>+ Async</button>
    </div>
  )
)

// start the app，`render` is an enhanced `ReactDOM.render`
render(<App />, document.getElementById('root'))
```

### [Demo](https://www.webpackbin.com/bins/-Kmdm2zpS4JBvzbKBbIc)

## Guide

See [Guide](https://github.com/mirrorjs/mirror/blob/master/docs/guides.md).

## API

See [API Reference](https://github.com/mirrorjs/mirror/blob/master/docs/api.md).

## Examples

* [Counter](https://github.com/mirrorjs/mirror/blob/master/examples/counter)
* [Simple-Router](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router)
* [Todo](https://github.com/mirrorjs/mirror/blob/master/examples/todo)


## FAQ

#### Does Mirror support [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)?

Yes.

#### Can I use extra Redux middlewares?

Yes, speicify them in `mirror.defaults`, learn more from the Docs.

#### Which version of react-router does Mirror use?

react-router v4.

