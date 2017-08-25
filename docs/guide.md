# Guide

#### State management

The `Redux` store of your app is defined by [`mirror.model`](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#mirrormodelname-initialstate-reducers-effects) API, and will be automatically created when the app is [started](#rendering). What `mirror.model` does is create the `state`, `reducers` and `actions`, so you don't have to create them by hand.

* **Action dispatching**

Dispatching `Redux` actions is very simple in Mirror, just call a function in the [`actions`](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#actions) global object, and your action is dispatched.

* **Async actions**

There is no difference between sync actions and [async actions](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#-effects) in the way how they are dispatched, a function call is all you need to do.

#### Routing

Mirror follows the exact way how [react-router 4.x](https://github.com/ReactTraining/react-router) does routing, so no new learning cost. The [history](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Router.md#history-object) is automatically handled, so you can focus on routing itself.

* **Programmatically change location**

Calling methods in [`actions.routing`](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#-actionsrouting) object will change the location. After changing, a `@@router/LOCATION_CHANGE` action will be dispatched.

#### Rendering

The [`render`](https://github.com/mirrorjs/mirror/blob/master/docs/api.md##rendercomponent-container) API will start your app: create the `Redux` store and render your component to the DOM. Calling `render` after app is started will replace reducer of your store and re-render your component.

#### Hooks

A [hook](https://github.com/mirrorjs/mirror/blob/master/docs/api.md#mirrorhookaction-getstate--) is a listener subscribes to every `action` you dispatched. For example, if you want to monitor location changes, you can hook the actions whose type is `@@router/LOCATION_CHANGE` by `mirror.hook`.


