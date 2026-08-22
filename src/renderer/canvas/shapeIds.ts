export const createShapeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `shape-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
