// polyfill `requestAnimationFrame` for React 16
// @see https://github.com/facebook/jest/issues/4545
/* istanbul ignore next */
global.requestAnimationFrame = callback => {
  setTimeout(callback, 0)
}
