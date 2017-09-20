import React from 'react'
import PropTypes from 'prop-types'
import { AppRegistry } from 'react-native'
import { connect, Provider } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { options } from './defaults'
import { models } from './model'
import { store, createStore, replaceReducer } from './store'

let started = false
let Root
export let AppNavigator

export default function render (name, component) {

  const { initialState, middlewares } = options
  let ConnectAppNavigator

  if (started) {

    // If app has rendered, do `store.replaceReducer` to update store.
    replaceReducer(store, models)

    // Call `render` without arguments means *re-render*. Since store has updated,
    // `component` will automatically be updated, so no need to `ReactDOM.render` again.
    if (arguments.length === 0) {
      return Root
    }

  } else {
    AppNavigator = component

    const AppWithNavigationState = ({ dispatch, nav }) => (
      <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })}/>
    )

    AppWithNavigationState.propTypes = {
      dispatch: PropTypes.func.isRequired,
      nav: PropTypes.object.isRequired,
    }

    ConnectAppNavigator = connect(state => ({
      nav: state.nav,
    }))(AppWithNavigationState)

    createStore(models, initialState, middlewares)
  }

  // Use named function get a proper displayName
  Root = function Root () {
    return (
      <Provider store={store}>
        <ConnectAppNavigator/>
      </Provider>
    )
  }

  started = true

  AppRegistry.registerComponent(name, () => Root)

  return Root
}
