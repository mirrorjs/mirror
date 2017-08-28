// Registry of namespaced effects
export const effects = {}

export const addEffect = effects => (name, handler) => {
  effects[name] = handler
}
