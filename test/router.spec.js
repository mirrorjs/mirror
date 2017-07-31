import React from 'react'
import PropTypes from 'prop-types'

beforeEach(() => {
  jest.resetModules()
})

describe('the enhanced Router', () => {

  let rootContext

  const ContextChecker = (props, context) => {
    rootContext = context
    return null
  }

  ContextChecker.contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object,
      route: PropTypes.object
    })
  }

  afterEach(() => {
    rootContext = undefined
  })


  it('should pass history to Router', () => {
    const mirror = require('index')
    const {render, Router} = mirror
    const {getHistory} = require('router')

    const history = getHistory()
    const container = document.createElement('div')

    render(
      <Router>
        <ContextChecker/>
      </Router>,
      container
    )

    expect(rootContext.router.history).toBe(history)
  })

  it('should add navigation methods of history object to actions.routing', () => {
    const mirror = require('index')
    const {actions, render, Router} = mirror

    const container = document.createElement('div')

    mirror.defaults({
      historyMode: 'hash'
    })

    render(
      <Router>
        <ContextChecker/>
      </Router>,
      container
    )

    expect(actions.routing).toBeDefined()
    expect(actions.routing.push).toBeInstanceOf(Function)
    expect(actions.routing.replace).toBeInstanceOf(Function)
    expect(actions.routing.go).toBeInstanceOf(Function)
    expect(actions.routing.goForward).toBeInstanceOf(Function)
    expect(actions.routing.goBack).toBeInstanceOf(Function)
  })

  it('should change history when call methods in actions.routing', () => {
    const mirror = require('index')
    const {actions, render, Router} = mirror

    const container = document.createElement('div')

    mirror.defaults({
      historyMode: 'memory'
    })

    render(
      <Router>
        <ContextChecker/>
      </Router>,
      container
    )

    expect(rootContext.router.route.match.isExact).toBe(true)

    actions.routing.push('/new')

    expect(rootContext.router.route.match.isExact).toBe(false)
  })
})
