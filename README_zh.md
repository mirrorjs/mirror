# Mirror

[![npm version](https://img.shields.io/npm/v/mirrorx.svg?style=flat-square)](https://www.npmjs.com/package/mirrorx) [![build status](https://img.shields.io/travis/mirrorjs/mirror.svg?style=flat-square)](https://travis-ci.org/mirrorjs/mirror) [![coverage status](https://img.shields.io/coveralls/mirrorjs/mirror.svg?style=flat-square)](https://coveralls.io/github/mirrorjs/mirror?branch=master)

一款简洁、高效、易上手的 React 框架。（Inspired by [dva](https://github.com/dvajs/dva) and [jumpsate](https://github.com/jumpsuit/jumpstate)）

> Painless React and Redux.

## 为什么？

我们热爱 React 和 Redux。但是，Redux 中有太多的[样板文件](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md)，需要很多的重复劳动，这一点令人沮丧；更别提在实际的 React 应用中，还要集成 `react-router` 的路由功能了。

一个典型的 React & Redux 应用看起来像下面这样：

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

// 在某个事件处理函数中
dispatch(addTodo('a new todo'))

// 在另一个事件处理函数中
dispatch(completeTodo(42))

// ...
```

看起来是不是有点繁冗？这还是没考虑 [`异步 action`](http://redux.js.org/docs/advanced/AsyncActions.html) 的情况呢！如果要处理`异步 action`，还需要引入 middleware（比如 `redux-thunk` 或者 `redux-saga`），那么代码就更繁琐了。


### 用 Mirror 重写

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

// 在某个事件处理函数中
actions.todos.add('a new todo')

// 在另一个事件处理函数中
actions.todos.complete(42)

// ...
```

是不是就简单很多了？只需一个方法，即可定义所有的 `action` 和 `reducer`（以及 `异步 action`）！

而且，这行代码：

```js
actions.todos.add('a new todo')
```

完全等同于这行代码：

```js
dispatch({
  type: 'todos/add',
  text: 'a new todo'
})
```

简洁又高效。

## 特性

* 极简 API（只有 4 个新 API）
* 易于上手
* Redux action 从未如此简单
* 支持动态创建 model
* 强大的 hook 机制

## 快速开始

### 初始化项目

使用 [create-react-app](https://github.com/facebookincubator/create-react-app) 创建一个新的 app：

```sh
$ npm i -g create-react-app
$ create-react-app my-app
```

创建之后，从 npm 安装 Mirror：

```sh
$ cd my-app
$ npm i --save mirrorx
$ npm start
```

### `index.js`

```js
import React from 'react'
import mirror, {actions, connect, render} from 'mirrorx'

// 声明 Redux state, reducer 和 action，
// 所有的 action 都会以相同名称赋值到全局的 actions 对象上
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

// 使用 react-redux 的 connect 方法，连接 state 和组件
const App = connect(state => {
  return {count: state.app}
})(props => (
    <div>
      <h1>{props.count}</h1>
      {/* 调用 actions 上的方法来 dispatch action */}
      <button onClick={() => actions.app.decrement()}>-</button>
      <button onClick={() => actions.app.increment()}>+</button>
      {/* dispatch async action */}
      <button onClick={() => actions.app.incrementAsync()}>+ Async</button>
    </div>
  )
)

// 启动 app，render 方法是加强版的 ReactDOM.render
render(<App/>, document.getElementById('root'))
```

### [Demo](https://www.webpackbin.com/bins/-Kmdm2zpS4JBvzbKBbIc)

## 指南

查看 [指南](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guide.md)。

## API

查看 [API 文档](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md)。

## 示例项目

* [Counter](https://github.com/mirrorjs/mirror/blob/master/examples/counter)
* [Simple-Router](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router)
* [Todo](https://github.com/mirrorjs/mirror/blob/master/examples/todo)

## FAQ

#### 是否支持 [Redux DevTools 扩展](https://github.com/zalmoxisus/redux-devtools-extension)？

支持。

#### 是否可以使用额外的 Redux middleware？

可以，在 `mirror.defaults` 接口中指定即可，具体可查看文档。

#### Mirror 用的是什么版本的 react-router？

react-router 4.x。

