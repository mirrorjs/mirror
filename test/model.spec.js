beforeEach(() => {
  jest.resetModules()
})


describe('mirror.model', () => {

  it('throws if model name is invalid', () => {
    const mirror = require('index')
    const errorReg = /Model name must be a valid string/

    expect(() => {
      mirror.model()
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 1
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'routing'
      })
    }).toThrow(/it is used by react-router-redux/)

    expect(() => {
      mirror.model({
        name: 'app'
      })
    }).not.toThrow()
  })

  it('throws if model name is duplicated', () => {
    const mirror = require('index')

    mirror.model({
      name: 'app'
    })

    expect(() => {
      mirror.model({
        name: 'app'
      })
    }).toThrow(/please select another name/)
  })

  it('models should be an array', () => {
    const mirror = require('index')
    const { models } = require('model')

    expect(models).toBeInstanceOf(Array)

    const model1 = mirror.model({
      name: 'model1'
    })

    expect(models).toEqual([model1])

    const model2 = mirror.model({
      name: 'model2'
    })

    expect(models).toEqual([model1, model2])
  })

  it('throws if reducers is invalid', () => {
    const mirror = require('index')
    const errorReg = /Model reducers must be a valid object/

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: false
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: []
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: () => {
        }
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: {}
      }).not.toThrow()
    })
  })

  it('throws if effects is invalid', () => {
    const mirror = require('index')
    const errorReg = /Model effects must be a valid object/

    expect(() => {
      mirror.model({
        name: 'app',
        effects: false
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        effects: []
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        effects: () => {
        }
      })
    }).toThrow(errorReg)

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: {}
      }).not.toThrow()
    })
  })

  it('throws if effect name is duplicated with action name', () => {
    const mirror = require('index')

    expect(() => {
      mirror.model({
        name: 'app',
        reducers: {
          add(state, data) {
            return state + data
          }
        },
        effects: {
          async add() {
          }
        }
      })
    }).toThrow(/Please select another name as effect name/)
  })

  it('should ignore non-function entries in reducers and effects', () => {
    const mirror = require('index')
    const { actions } = mirror

    const fn = () => {
    }

    mirror.model({
      name: 'model1',
      reducers: {
        a: 1
      }
    })

    expect(actions.model1.a).toEqual(undefined)

    mirror.model({
      name: 'model2',
      effects: {
        b: 'b'
      }
    })

    expect(actions.model2.b).toEqual(undefined)

    mirror.model({
      name: 'model3',
      reducers: {
        a: 1,
        add: fn
      },
      effects: {
        b: 'b',
        plus: fn
      }
    })

    expect(actions.model3).toBeInstanceOf(Object)
    expect(Object.keys(actions.model3)).toEqual(['add', '$$mirror$$clear', 'plus'])
  })
})
