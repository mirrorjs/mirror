export const hooks = []

export default function hook(subscriber) {

  if (typeof subscriber !== 'function') {
    throw new Error('Invalid hook, must be a function!')
  }

  hooks.push(subscriber)

  return () => {
    hooks.splice(hooks.indexOf(subscriber), 1)
  }
}
