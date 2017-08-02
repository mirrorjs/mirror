# Mirror

[![npm version](https://img.shields.io/npm/v/mirrorx.svg?style=flat-square)](https://www.npmjs.com/package/mirrorx) [![build status](https://img.shields.io/travis/mirrorjs/mirror.svg?style=flat-square)](https://travis-ci.org/mirrorjs/mirror) [![coverage status](https://img.shields.io/coveralls/mirrorjs/mirror.svg?style=flat-square)](https://coveralls.io/github/mirrorjs/mirror?branch=master)

一款简洁、高效、易上手的 React 框架。（Inspired by [dva](https://github.com/dvajs/dva) and [jumpsate](https://github.com/jumpsuit/jumpstate)）

> Painless React and Redux.

* [简介](#简介)
* [指南](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guides.md)
  * [状态管理](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guides.md#状态管理)
  * [路由](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guides.md#路由)
  * [启动和渲染](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guides.md#启动和渲染)
  * [Hook](https://github.com/mirrorjs/mirror/blob/master/docs/zh/guides.md#hook)
* [快速开始](#快速开始)
* [示例项目](#示例项目)
* [API](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md)
* [FAQ](#faq)

## 简介

Mirror 是一款基于 [React](https://facebook.github.io/react)，[Redux](http://redux.js.org/docs/introduction/) 和 [react-router](https://github.com/ReactTraining/react-router) 的前端框架。作为一个框架，Mirror 提供了构建 React 应用所需的一切，包括状态管理、路由等。更重要的是，Mirror 概念简单，易于使用：

* **极简 API**

在 Mirror 中，只有 [4 个新 API](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md)，其他仅有的几个 API 都来自 `React`、`Redux` 以及 `react-router`，比如 `render` 和 `connect`（当然，经过封装和强化）。

* **易于上手**

你不必学习一些炫酷的新概念就能使用 Mirror，只需要对 `React`、`Redux` 以及 `react-router` 有一个基本的了解即可（可以查看 [Redux Docs](http://redux.js.org/docs/introduction/) 和 [react-router Docs](https://github.com/ReactTraining/react-router) 了解更多）。不仅如此，Mirror 对这些已有概念的处理更为简单，让你用起来更加得心应手。你甚至可以从[第一行代码](#快速开始)开始写你的业务逻辑。

* **Redux action 从未如此简单**

无需手动创建 `action type` 或者 `action creator`，无需明确调用 `dispatch` 方法，无需使用 `redux-thunk` 或者 `redux-saga` 或者 `mobx` 来处理异步 action——只需[调用一个函数即可 `dispatch` 你的 `action`](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#actions)，无论是同步还是异步的 action。

* **支持动态创建 model**

在大型应用中，Redux state 很有可能不是同时创建的，也就是说你很可能需要动态地引入一些 reducer 和 state（对应 Mirror 中的 `model`），那么 Mirror 天然地支持这种动态引入，而且[非常简单](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#rendercomponent-container-callback)。

* **强大的 hook 机制**

如果你想监测每一个被 dispatch 的 action，没问题！Mirror 提供了这种 [hook 的能力](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#mirrorhookaction-getstate-)，让你随时监控每一个 action，做任何你想做的事情。


## 快速开始

### 初始化项目

使用 [create-react-app](https://github.com/facebookincubator/create-react-app) 创建一个新的 app：

```sh
$ npm i -g create-react-app
$ create-react-app my-app
$ cd my-app
```

创建之后，从 npm 安装 Mirror：

```
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

## 示例项目

* [Counter](https://github.com/mirrorjs/mirror/blob/master/examples/counter)
* [Simple-Router](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router)
* [Todo](https://github.com/mirrorjs/mirror/blob/master/examples/todo)

## FAQ

##### 是否支持 [Redux DevTools 扩展](https://github.com/zalmoxisus/redux-devtools-extension)？

支持。

##### 是否可以使用额外的 Redux middleware？

可以，在 `mirror.defaults` 接口中指定即可，具体可查看文档。

##### Mirror 用的是什么版本的 react-router？

react-router 4.x。

