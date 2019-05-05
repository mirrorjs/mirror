import { Route, Redirect, Switch, Prompt, withRouter } from 'react-router'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import model from './model'
import { actions } from './actions'
import render from './render'
import hook from './hook'
import Router from './router'
import defaults from './defaults'
import createMiddleware from './middleware'
import toReducer from './toReducer'

const middleware = createMiddleware()

export {
  model,
  actions,
  hook,
  defaults,
  connect,
  render,
  middleware,
  toReducer,

  Router,
  Route,
  Link,
  NavLink,
  Switch,
  Redirect,
  Prompt,
  withRouter
}
