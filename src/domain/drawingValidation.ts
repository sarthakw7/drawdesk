import { CURRENT_SCHEMA_VERSION, type DrawingDocument } from './drawing'
import type { Shape } from './shapes'

const isObject = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
)

const isNumber = (value: unknown): value is number => (
  typeof value === 'number' && Number.isFinite(value)
)

const hasBaseShape = (value: Record<string, unknown>) => (
  typeof value.id === 'string' && typeof value.type === 'string'
)

const isShape = (value: unknown): value is Shape => {
  if (!isObject(value) || !hasBaseShape(value)) {
    return false
  }

  switch (value.type) {
    case 'rectangle':
    case 'ellipse':
      return (
        isNumber(value.x)
        && isNumber(value.y)
        && isNumber(value.width)
        && isNumber(value.height)
      )
    case 'line':
      return (
        isNumber(value.startX)
        && isNumber(value.startY)
        && isNumber(value.endX)
        && isNumber(value.endY)
      )
    case 'text':
      return (
        isNumber(value.x)
        && isNumber(value.y)
        && typeof value.text === 'string'
      )
    default:
      return false
  }
}

export const isDrawingDocument = (value: unknown): value is DrawingDocument => (
  isObject(value)
  && value.schemaVersion === CURRENT_SCHEMA_VERSION
  && Array.isArray(value.shapes)
  && value.shapes.every(isShape)
)
