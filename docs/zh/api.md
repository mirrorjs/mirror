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

`mirror.model` 的作用是创建并注入一个 model，所谓的 model，就是 Redux 的 `state`、`action` 和 `reducer` 的组合。`mirror.model` 会自动创建 `reducer` 和 `action`，然后被用于创建 Redux store。

简而言之，`mirror.model` 就是一种组织、管理 Redux 的方式，简单而且强大。

#### * `name`

要创建 model，必须要指定 `name`，且为一个合法字符串。`name` 很好理解，就是 model 的名称，这个名称会用于后面创建的 Redux store 里的命名空间。

假设定义了一个这样的 model：

```js
import mirror from 'mirrorx'

mirror.model({
  name: 'app',
})
```

那么最后创建的 Redux store 会是这样的结构：

```js
// ...

store.getState()
// {app: null}
```

可以看到，model 的 `name` 就是其 state 在根 store 下的命名空间（当然，`name` 对全局 `actions` 也非常重要，见下文）。

另外，需要注意的是，上面创建的 store，其 `app` 这个 state 的值是 `null`，假如你想要一个不同的、更有意义的值，那么你就需要指定一个 `initialState`。

> 注意：Mirror 使用了 [react-router-redux](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux)，因此你**不可以**使用 `routing` 作为 model 的 name。

#### * `initialState`

`initialState` 也很容易理解，表示 model 的初始 state。在创建标准的 `Redux reducer` 时，它就表示这个 reducer 的 `initialState`。

这个值不是必需的，而且可以为任意值。如果没有指定 `initialState`，那么它的值就是 `null`。

创建 model：

```js
import mirror from 'mirrorx'

mirror.model({
  name: 'app',
+ initialState: 0,
})
```

得到的 store：

```js
store.getState()
// {app: 0}
```

#### * `reducers`


Mirror app 所有的 `Redux reducer` 都是在 `reducers` 中定义的，`reducers` 对象中的方法本身会用于创建 `reducer`，方法的名字会用于创建 `action type`。Mirror 的原则是，**一个 reducer 只负责一个 action**，所以你不需要关心你要处理的 action 具体的 type 是什么。

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

执行上述代码，Mirror 实际上做了以下 3 件事情：

1. 创建一个 [reducer](http://redux.js.org/docs/basics/Reducers.html)；
2. 创建一个 [action type](http://redux.js.org/docs/basics/Actions.html)（本例中是 `app/add`），这个 action 会被上面的 reducer 处理；
3. 在 `actions.<modelName>` 上添加一个方法，该方法的名称与 `reducers` 中的方法名完全一致，当调用 `actions.<modelName>` 中的这个方法时，上面创建的 `action` 会被 dispatch。

同时我们也可以看到 model 的 `name` 的另一个用处：

```js
// ...
typeof actions.app
// 'object'

typeof actions.app.add
// 'function'

actions.app.add(1)
// 等同于：
// dispatch({
//   type: 'app/add',
//   data: 1
// })


// ...
store.getState()
// {app: 1}
```

是的，`name` 的值会成为全局 `actions` 上的一个属性，该属性是一个对象，而且该对象会被添加与 `reducers` 中所有方法名相同的方法。调用这些方法会 dispatch 对应的 action。

`reducers` 中定义的方法，基本上等同于一个 `Redux reducer`（所以也必须为[纯函数](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md#oh-to-be-pure-again)），唯一的区别是参数不同：

```js
// Redux reducer
function reduxReducer(state, {type, data}) {
  // 返回一个新的 state
}

// `reducers` 中定义的 reducer
function reducerInReducers(state, data) {
  // 返回一个新的 state
}
```


对于标准的 `Redux reducer`，函数的第二个参数是 `action` 对象；而 `reducers` 中定义的 reducer，函数的第二个参数是 action data。因为你根本不需要关心 action type。

那么调用 `actions.<modelName>` 上的方法时，应该传什么参数呢？也是 action data。

```js
// ...

// 与手动调用 dispatch 一样，在调用 actions.<modelName> 上的方法时，不需要传递 state 参数
actions.app.add(100)
```

所有 model 中的所有 reducer 最后都会合并起来形成一个 `Redux reducer`（使用 Redux 的[`combineReducers`](http://redux.js.org/docs/api/combineReducers.html)），然后用于创建 Redux store。

> 注意：`reducers` 中的非函数属性会被忽略（`effects` 也一样）：
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

所谓的 `effects` 就是 [Redux 的异步 action（async actions）](http://redux.js.org/docs/advanced/AsyncActions.html)。在函数式编程中，[`effect`](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch3.md#side-effects-may-include) 表示所有会与函数外部发生交互的操作。在 Redux 的世界里，异步 action 显然是 `effect`。

`effect` 不会直接更新 Redux state，通常是在完成某些异步操作（比如 AJAX 请求）之后，再调用其他的“同步 action” 来更新 state。

和 `reducers` 对象类似，你在 `effects` 中定义的所有方法都会以相同名称添加到 `actions.<modelName>` 上，调用这些方法便会调用 `effects` 你定义的那些方法。

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

执行上述代码，`actions.app` 就会拥有两个方法：`actions.app.add` 和 `actions.app.myEffect`。

调用 `actions.app.myEffect`，就会调用 `effects.myEffect`，简单得不能再简单。

```js
// ...

// 首先，dispatch action：
// dispatch({
//   type: 'app/myEffect',
//   data: 10
// })
//
// 然后，调用函数：
// effects.myEffect(10)
actions.app.myEffect(10)

// ...
store.getState()
// {app: 10}
```

就是这样，你只需要调用 Mirror 添加到 `actions.<modelName>` 上的方法，然后你的异步 action 就被 dispatch 了！如果你具有一定的 Redux 经验，那么你一定使用过 [redux-thunk](https://github.com/gaearon/redux-thunk) 或者 [redux-saga](https://redux-saga.js.org) 之类的 middleware 来处理异步 action，当然，它们很优秀——但它们都没有 Mirror 简单！

在 `effects` 中定义的方法接收两个形参：

* `data` - 调用 `actions.<modelName>` 上的方法时所传递的 data，可选。
* `getState` - 实际上就是 `store.getState`，返回当前 action 被 dispatch 前的 store 的数据，同样是可选的。

不过，当在调用 `actions.<modelName>` 上的方法时，你只需要传递上面的 `data` 作为实参即可（如果需要的话）。

**Mirror 强烈推荐使用 `async/await` 来定义 effect**。因为 async 函数会自动返回一个 promise。

当然了，你也可以使用直白的 `Promise`：

```js
// ...

effects: {
  promisedEffect(data, getState) {
    return Promise.resolve(data).then(result => {
      // 调用同步 action
    })
  }
}
```

甚至，你还可以使用上古时代的 `callback`（**十分不推荐**）：

```js
// ...

effects: {
  callbackEffect(data, getState) {
    setTimeout(() => {
      // 调用同步 action
    }, 1000)
  }
}
```

具体使用什么方式定义 effect 不是重点，重点是，你可以以任何你喜欢的方式来处理你的异步操作，而 Mirror 为你提供了简单一致的 API。

> 注意： `effects` 中定义的 action 的名称，不可以与 `reducers` 中的重复：
>
> ```js
> import mirror, {actions} from 'mirrorx'
>
> // 会抛错！
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

`actions` 全局对象包含了 Redux 中的 `action` 和 `reducer`。调用 `actions` 上的方法，将会 dispatch 一个 action，这个 action 会被你在 `mirror.model` 接口中的 `reducers` 和 `effects` 上定义的方法捕获、处理。

在 Mirror 中，所有的 action 和 effect 都是自动生成的，而且都有处于特定命名空间下。这就意味着，你无法手动创建 action，更重要的是，**没有必要**。

不但不需要手动创建 action，你也不需要手动 dispatch action。如果你想要一个 action 以及处理这个 action 的 reducer，你完全不需要先定义一个 `action type`（或者`action creator`），再定义一个处理它的 `reducer`。根本不用这么麻烦， 你只管往 `reducers` 对象里扔一个 reducer 就好了，剩下的交给 Mirror 处理。

这样的好处是，你不需要在不同的文件和目录间跳来跳去去决定到底哪个 action 该由哪个 reducer 来处理了。

例如，执行这段代码：

```js
actions.app.add(1)
```

完全等同于这段代码：

```js
dispatch({
  type: 'app/add',
  data: 1
})
```

而且，使用全局的 `actions` 对象来处理 Redux 的 action，不同组件或者模块间的“依赖关系”也非常明显，而且更不易出错：

假设有一个 a.js：

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

还有一个 b.js：

```js
// b.js
import mirror, {actions} from 'mirrorx'

mirror.model({
  name: 'b',
  effects: {
    async foo(state, data) {
      const res = await Promise.resole(data)
      // 更新 `a` model 的 state
      actions.a.add(data)
    },
  },
})
```

可以很清晰地看到，模块 `b` 会更新模块 `a` 中的 state。


#### * `actions.routing`

如果你的 app 使用了 Mirror 提供的 [`Router`](#router) 组件，那么你会自动得到一个 `actions.routing` 对象。

这个对象上有 5 个方法，都是用来更新 location 的：

* `push(location)` - 往 history 中添加一条记录，并跳转到目标 location。
* `replace(location)` - 替换 hisotry 中当前 location。
* `go` - 往前或者往后跳转 history 中的 location。
* `goForward` - 往前跳转一条 location 记录，等价于 `go(1)`。
* `goBack` - 往后跳转一条 location 记录，等价于 `go(-1)`。

事实上，这些方法来自于 [history API](https://github.com/ReactTraining/history/blob/v3/docs/GettingStarted.md#navigation)，所以意义和用法完全一致。不过与原生方法不同的是，调用 `actions.routing` 上的这些方法，在更新 location 的同时，你的 routing 与 Redux store 将会保持同步，同时一个 type 为 `@@router/LOCATION_CHANGE` 的 action 会被 dispatch（感谢 [react-router-redux](https://github.com/reactjs/react-router-redux)）。

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

查看 [Location](https://github.com/ReactTraining/history/blob/v3/docs/Location.md#location) 了解更多。

> 注意：如果你的 app 没有使用 [`Router`](#router)，那么 `actions.routing` 将会是 `undefined`。

### mirror.hook((action, getState) => {})

这是一个非常强大的接口，能够让你监控每一个 dispatch 出去的 action。

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

// 移除 hook
locationChangeHook()
countHook()
```

`mirror.hook` 会返回一个函数，调用该函数将会移除这个 hook。

### mirror.defaults(options)

`mirror.defaults` 是一个相当直观的 API，你可以用它来设置你的 Mirror app 的一些选项。

#### * `options.initialState`

* 默认值：`undefined`

表示 Redux store 的 [`preloadedState`](http://redux.js.org/docs/api/createStore.html)。

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

* 默认值: `browser`

表示 Router 组件所需的 [history 对象的类型](https://github.com/ReactTraining/history#usage)，共有 3 种可选的值：

* `browser` - 标准的 HTML5 hisotry API。
* `hash` - 针对不支持 HTML5 history API 的浏览器。
* `memory` - history API 的内存实现版本，用于非 DOM 环境。

如果想了解更多，请查看 [history](https://github.com/ReactTraining/history)。

#### * `options.middlewares`

* 默认值： `[]`

用来指定一系列标准的 [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html)。

假如你想使用一些第三方的 middleware，那么可以在这个选项中指定。同时，你需要调用 [`connect`](#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 且不传递 `mapDispatchToProps` 来获取 `props.dispatch` 方法，然后手动 dispatch action。

#### * `options.reducers`

* Default: `{}`

指定一些额外的 reducer。注意这里定义的 reducer 必须为标准的 Redux reducer，这些 reducer 会直接被 [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) 处理。

比如，要想在 Mirror app 中使用 [redux-form](https://redux-form.com/)，那么你可以按照以下方式将 redux-form 的 reducer 集成进来：

```js
import mirror from 'mirrorx'
import { reducer as formReducer } from 'redux-form'

mirror.defaults({
  reducers: {
    form: formReducer
  }
})
```

##### 更新，而不是替换

`mirror.defautls` 可以调用多次，那么在后续的调用中，`options.reducers` 对象是被**更新**的，而不是被替换。也就是说，参数 `options.reducers` 中的 `key-value` 会被**合并**到之前的对象上去。例如：

```js
// 首次调用，store 中会有一个标准的 reducer 其命名空间为 `a`
mirror.defaults({
  reducers: {
    // standard Redux reducer
    a: (state, data) => {}
  }
})

// ...

// 然后在 app 的某个地方，你可以动态地增加标准 reducer
mirror.defaults({
  reducers: {
    // standard Redux reducer
    b: (state, data) => {}
  }
})
```

上述第二次的 `mirror.defaults` 调用，将会导致 store 中有 2 个标准 reducer：`a` 和 `b`。


#### * `options.addEffect`

* Default: `(effects) => (name, handler) => { effects[name] = handler }`

自定义指定 `effect` 如何处理，比如要使用 `saga`, 可在这个选项中 `runSaga`。更多信息，可查看 [mirror-saga](https://github.com/ShMcK/mirror-saga) 这个项目。

### connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])

`connect` 接口会将 Redux store 与你的 React 组件绑定起来，这个 `connect` 其实就是 [react-redux](https://github.com/reactjs/react-redux) 的 [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)，所以意义和用法也都完全一致。

和普通的 React app 一样，如果你的组件需要用到 Redux store 的数据，那么你也需要 `connect` 来绑定数据。

和普通 React app 不一样的是，如果你的某个组件仅仅需要 dispatch 一些 action，那么你完全不要 `connect`。因为 `actions` 对象是全局的，你可以在任意一个组件（哪怕是[展示型组件](http://redux.js.org/docs/basics/UsageWithReact.html#presentational-and-container-components)）中引用它，并调用 `actions` 上的方法来 dispatch action。

> 注意：`connect` 过的组件，如果没有指定 `mapDispatchToProps`，那么该组件的 `props` 会有一个 `dispatch` 方法，Mirror 保留了这个逻辑。这样，你就可以通过 [`mirror.defaults`](#mirrordefaultsoptions) 接口指定一些 middleware，然后拿到 dispatch 方法来使用它们。不过，这是唯一你需要手动 dispatch action 的情况，在其他所有情况下，你都应该使用全局 `actions` 上的方法来 dispatch action。

### render([component], [container], [callback])

Mirror 的 `render` 接口就是加强版的 [`ReactDOM.render`](https://facebook.github.io/react/docs/react-dom.html#render)，它会启动并渲染你的 Mirror app。

`render` 首先会创建 Redux store，然后使用 `ReactDOM.render` 将组件渲染到 DOM 上。`render` 方法的参数与 `ReactDOM.render` 完全一致。

你可以在 app 中多次调用 `render`。第一次调用会使用 `mirror.model` 方法中定义的 reducer 和 effect 来创建 store。后续的调用将会 [使用 `replaceReducer` 替换 store 的 reducer](http://redux.js.org/docs/api/Store.html#replaceReducer)，并重新渲染整个 app。

这样处理的意义是什么呢？就是你可以动态载入 model 了，这对 code-splitting 非常有用。

#### 动态加载 model

举例来说，假如你有一个 `app.js`：

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

`render` 之后，你的 app 会被渲染成下面这样：

```html
<div>
  <div>0</div>
  <div></div>
</div>
```

然后，假设你又定义一个异步组件／model，可以通过类似 [react-loadable](https://github.com/jamiebuilds/react-loadable) 这样的库加载进来：

```js
// asyncComponent.js

// 在这个异步组件中，定义一个"异步 model"
mirror.model({
  name: 'bar',
  initialState: 'state of bar'
})
```

```js
// app.js

// ...

// 当加载完这个异步组件之后，调用 `render()` 将会“注册”其对应的异步 model，
// 并重新渲染 app
//
// NOTE: 这里的 `load` 函数为伪代码
load('ayncComponent.js').then(() => {
  mirror.render()
})
```

**不传递参数调用 `render` 将会重新渲染你的 app**。所以上述代码将会生成以下 DOM 结构：

```html
<div>
  <div>0</div>
- <div></div>
+ <div>state of bar</div>
</div>
```

#### 动态加载标准 reducer

另外，当加载完异步组件／model 之后，还可以通过调用 `mirror.defaults` 的方式更新标准的 Redux reducer：

```js
// app.js

// NOTE: 这里的 `load` 函数为伪代码
load('ayncComponent.js').then(() => {

  // `MyAsyncReducer` 会被**合并**到之前指定的 reducer 中，而非替换它们
  mirror.defaults({
    reducers: {
      MyAsyncReducer: (state, data) => {},
      // ...
    }
  })
  
  // 重新渲染
  mirror.render()
})
``` 

这在大型 app 中非常有用。

> 注意：Mirror 不建议传递 `component` 和 `container` 参数来重新渲染你的 app，因为这样做可能会导致 React mount/unmount 你的 app。如果你只希望重新渲染，永远不要传递任何参数给 `render`。

### Router

> Mirror 使用的是 [react-router@4.x](https://github.com/ReactTraining/react-router)，如果你有 react-router 2.x/3.x 的经验，那么你应该仔细阅读一下 react-router 官方的[迁移指南](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/migrating.md)。

Mirror 的 `Router` 组件是加强版的 [react-router](https://github.com/ReactTraining/react-router/tree/master/packages/react-router) 的 `Router`。所加强的地方在于，`Redux store` 和 `history` 都自动处理好了，不需要你去做关联，也不需要你去创建 `history` 对象，你只需要关心自己的业务逻辑，定义路由即可。当然，如果你想自己创建一个 `history` 对象，然后通过 prop 传递给 `Router` 组件，也是没有任何问题的。

那 [`basename`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md#basename-string) 以及 [`getUserConfirmation`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md#getuserconfirmation-func) 等 props 呢？不用担心，Mirror 的 `Router` 全都能处理它们。你可以查看 [`BrowserRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md)、[`HashRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/HashRouter.md) 和 [`MemoryRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/MemoryRouter.md) 的文档获取更多信息。

因为 Mirror 没有将 `Router` 用到的 `history` 暴露出去，如果你需要手动更新 location，那么你可以使用 `actions.routing` 上的方法。

以下这些组件，都来自 `react-router`，Mirror 也都暴露出去了，你可以直接引入：

* [`Route`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md)
* [`Switch`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Switch.md)
* [`Redirect`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Redirect.md)
* [`Link`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/Link.md)
* [`NavLink`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/NavLink.md)
* [`Prompt`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Prompt.md)
* [`withRouter`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md)

一个简单的例子：

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

想了解更多 `Router` 相关的信息，你可以查看 Mirror 提供的 [simple-router 示例项目](https://github.com/mirrorjs/mirror/blob/master/examples/simple-router)，还有 [react-router 官方文档](https://github.com/ReactTraining/react-router/tree/master/packages/react-router)。

