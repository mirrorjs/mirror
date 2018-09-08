import React from 'react'
import defaults, { options } from 'defaults'
import { render } from 'index'
import { store } from 'store'

beforeEach(() => {
  jest.resetModules()
})

describe('mirror.defaults', () => {

  it('options should be exported', () => {
    expect(options).toBeDefined()
  })

  it('should not throw without argument', () => {
    expect(() => {
      defaults()
    }).not.toThrow()
  })

  it('throws if historyMode is invalid', () => {
    expect(() => {
      defaults({
        historyMode: 'unknown'
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        historyMode: 'hash'
      })
    }).not.toThrow()
  })

  it('throws if middlewares is not array', () => {
    expect(() => {
      defaults({
        middlewares: () => {}
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        middlewares: []
      })
    }).not.toThrow()
  })

  it('throws if an addEffect is not a function that returns a function', () => {
    expect(() => {
      defaults({
        addEffect: () => true
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        addEffect: () => () => true
      })
    }).not.toThrow()
  })

  it('should update `options.reducers` if call defaults multiple times', () => {
    defaults({
      reducers: {
        a: () => 'a'
      }
    })
    expect(Object.keys(options.reducers)).toEqual(['a'])

    const container = document.createElement('div')
    render(<div/>, container)
    expect(store.getState().a).toBe('a')

    defaults({
      reducers: {
        b: () => 'b'
      }
    })
    expect(Object.keys(options.reducers)).toEqual(['a', 'b'])

    render()
    expect(store.getState().b).toBe('b')

  })

  it('should ignore un-provided values for second and after calls', () => {
    defaults({
      reducers: {},
      historyMode: 'hash'
    })
    expect(options.historyMode).toBe('hash')

    defaults({})
    expect(options.historyMode).toBe('hash')
  })

})
