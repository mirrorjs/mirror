// Registry of namsspaced effects
export const effects = {}

export function addEffect(name, handler) {
  effects[name] = handler
}
