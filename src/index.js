import {
  createNavigationContainer,
  StateUtils,
  addNavigationHelpers,
  NavigationActions,
  createNavigator,
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  StackRouter,
  TabRouter,
  Transitioner,
  CardStack,
  Card,
  Header,
  HeaderTitle,
  HeaderBackButton,
  DrawerView,
  DrawerItems,
  TabView,
  TabBarTop,
  TabBarBottom,
  withNavigation,
} from 'react-navigation'
import { connect } from 'react-redux'
import model from './model'
import { actions } from './actions'
import render from './render'
import hook from './hook'
import defaults from './defaults'

module.exports = {
  model,
  actions,
  hook,
  defaults,
  connect,
  render,

  createNavigationContainer,
  StateUtils,
  addNavigationHelpers,
  NavigationActions,
  createNavigator,
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
  StackRouter,
  TabRouter,
  Transitioner,
  CardStack,
  Card,
  Header,
  HeaderTitle,
  HeaderBackButton,
  DrawerView,
  DrawerItems,
  TabView,
  TabBarTop,
  TabBarBottom,
  withNavigation,
}
