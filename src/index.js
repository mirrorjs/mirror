import {Route, Redirect, Switch, Prompt, withRouter} from 'react-router'
import {Link, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import model from './model'
import {actions} from './actions'
import render from './render'
import hook from './hook'
import Router from './router'
import {getStore} from './store'
import defaults from './defaults'

module.exports = {
  model,
  actions,
  hook,
  defaults,
  connect,
  getStore,
  render,

  Router,
  Route,
  Link,
  NavLink,
  Switch,
  Redirect,
  Prompt,
  withRouter
}
