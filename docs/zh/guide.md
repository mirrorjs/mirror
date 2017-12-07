# 指南

#### 状态管理

在 Mirror 中，app 的 Redux store 是由 [`mirror.model`](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#mirrormodelname-initialstate-reducers-effects) 接口定义的，而且 store 将会在[启动 app](#启动和渲染) 的时候自动创建。`mirror.model` 所做的事情就是创建 `state`、`reducer` 和 `action`，所以你不需要手动创建它们。

* **如何 dispatch action**

dispatch action 异常简单，你完全不需要到处手动调用 Redux 的 `dispatch` 方法，只需要调用一个 [`actions`](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#actions) 全局对象上的方法就能 dispatch 一个 action 了。

* **异步 action 的处理**

不管是同步 action，还是[异步 action](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#-effects)，对开发者来说，这两者的处理方式是一样的，都是通过调用 `actions` 对象上的方法来 dispatch。


#### 路由

Mirror 完全按照 [react-router 4.x](https://github.com/ReactTraining/react-router) 的接口和方式定义路由，因此没有任何新的学习成本。更方便的是，Mirror 的 `Router` 组件，其 [history](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Router.md#history-object) 对象以及跟 `Redux store` 的联结是自动处理过的，所以你完全不用关心它们，只需关心你自己的各个路由即可。

* **手动更新 location**

在全局的 `actions` 上，Mirror 为你提供了一个 [`actions.routing`](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#-actionsrouting) 对象，调用这个对象上的方法，即可手动更新 location，并且与 `store` 同步。location 更新后，一个 type 为 `@@router/LOCATION_CHANGE` 的 action 会被 dispatch。

> 如果 **route** 组件是 与 **router** 存在嵌套关系，但你的 **route 层的组件** 又 **connect** 了 **store** 订阅了某些 **state**。当你去触发路由跳转的时候，你会发现并没有触发路由的**render**。原因是：一旦子路由被嵌套了，子路由无法获取 router 的 context 上的 props 了。解决方法如下：
>
> ```
>  import React, { Component } from 'react'
>  import { withRouter, connect, render } from 'mirrorx'
> 
> 
>  render(<Router basename="/" hashType="hashbang">
>         <Root/>
>       </Router>,document.getElementById('root'))
> 
>  // ...
>  class App extends Component {
>   render () {
>     return (
>       ...<div>
>           <Switch>
>             <Route path='/' exact component={Home}/>
>             <Route path='/sites' component={Sites}/>
>             <Route path='/setting' component={Setting}/>
>           </Switch>
>         </div>
>       ...
>     )
>   }
> }
> 
> const Root = withRouter(connect(state => { return {somestate: state.somestate}; })(App))
> ```
>
> 对应的 issue 可以在参看这里：[React Router 4 (beta 8) won't render components if using redux connect #4671](https://github.com/ReactTraining/react-router/issues/4671)。

#### 启动和渲染

启动一个 Mirror app 的方式也非常简单，调用 [`render`](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md##rendercomponent-container) 接口即可。`render` 接口本质上是一个加强版的 `ReactDOM.render`，在渲染组件之前，`render` 会首先创建 Redux store。`render` 可以被多次调用，当 app 启动以后，再次调用 `render` 将会重新渲染你的 app。

#### Hook

可以将 [hook](https://github.com/mirrorjs/mirror/blob/master/docs/zh/api.md#mirrorhookaction-getstate--) 理解为监听每一个被 dispatch 的 action 的 listener，并且这个 listener 是可以随时取消的。假设你希望监控每一次 location 的变化，那么你可以通过 `mirror.hook` 接口去检测 type 为 `@@router/LOCATION_CHANGE` 的 action。

