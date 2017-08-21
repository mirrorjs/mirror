# Mirror

[![npm version](https://img.shields.io/npm/v/mirrorx.svg?colorB=007ec6&style=flat-square)](https://www.npmjs.com/package/mirrorx) [![build status](https://img.shields.io/travis/mirrorjs/mirror.svg?style=flat-square)](https://travis-ci.org/mirrorjs/mirror) [![coverage status](https://img.shields.io/coveralls/mirrorjs/mirror.svg?style=flat-square)](https://coveralls.io/github/mirrorjs/mirror?branch=master)

一款简洁、高效、易上手的 React 框架。（Inspired by [dva](https://github.com/dvajs/dva) and [jumpstate](https://github.com/jumpsuit/jumpstate)）

> Painless React and Redux.

## 为什么？

我们热爱 React 和 Redux。

一个典型的 React/Redux 应用看起来像下面这样：

* 一个 `actions/` 目录用来手动创建所有的 `action type`（或者 `action creator`）；
* 一个 `reducers/` 目录以及无数的 `switch` 来捕获所有的 `action type`；
* 必须要依赖 middleware 才能处理 `异步 action`；
* 明确调用 `dispatch` 方法来 dispatch 所有的 action；
* 手动创建 `history` 对象关联路由组件，可能还需要与 store 同步；
* 调用 `history` 上的方法或者 dispatch action 来手动更新路由；

存在的问题？太多的 [样板文件](https://github.com/reactjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md) 以及繁琐甚至重复的劳动。

实际上，上述大部分操作都是可以简化的。比如，在单个 API 中创建所有的 `action` 和 `reducer`；比如，简单地调用一个函数来 dispatch 所有的同步和异步 action，且不需要额外引入 middleware；再比如，使用路由的时候只需要关心定义具体的路由，不用去关心 `history` 对象，等等。

这正是 Mirror 的使命，用极少数的 API 封装所有繁琐甚至重复的工作，提供一种简洁高效的更高级抽象，同时保持原有的开发模式。

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
  initialState: {
    count: 0
  },
  reducers: {
    increment(state) { return {...state, count: state.count + 1}; },
    decrement(state) { return {...state, count: state.count - 1}; }
  },
  effects: {
    incrementAsync() {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      }).then(() => actions.app.increment())     
    }
  }
})

// 使用 react-redux 的 connect 方法，连接 state 和组件
const App = connect(state => {
  return {count: state.app.count};
})(props => {
  return (
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

