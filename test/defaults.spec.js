import defaults, { options } from 'defaults'

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

  it('throws if reducers is not object', () => {
    expect(() => {
      defaults({
        reducers: () => []
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        reducers: {}
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

})
