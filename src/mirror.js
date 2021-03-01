import { Route, Redirect, Switch, Prompt, withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import model from './model'
import { actions } from './actions'
import render,{ RootProvider as Provider } from './render'
import hook from './hook'
import Router from './router'
import defaults from './defaults'
import createMiddleware from './middleware'
import toReducers from './toReducers'

const middleware = createMiddleware()

export {
  model,
  actions,
  hook,
  defaults,
  connect,
  render,
  middleware,
  toReducers,

  Provider,
  Router,
  Route,
  Link,
  NavLink,
  Switch,
  Redirect,
  Prompt,
  withRouter
}
