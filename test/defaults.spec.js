import defaults, {options} from 'defaults'

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
        middlewares: () => {
        }
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        middlewares: []
      })
    }).not.toThrow()
  })

  it('throws if immutable is not boolean', () => {
    expect(() => {
      defaults({
        immutable: '12ewqq'
      })
    }).toThrow(/invalid/)

    expect(() => {
      defaults({
        immutable: true
      })
    }).not.toThrow()
  })

})
