import type { EllipseShape } from '../../../domain/shapes'
import type { Point } from './rectangles'

export type DraftEllipse = {
  start: Point
  end: Point
}

export type EllipseGeometry = Omit<EllipseShape, 'id' | 'type'>

export const normalizeEllipse = (draft: DraftEllipse): EllipseGeometry => {
  const x = Math.min(draft.start.x, draft.end.x)
  const y = Math.min(draft.start.y, draft.end.y)
  const width = Math.abs(draft.end.x - draft.start.x)
  const height = Math.abs(draft.end.y - draft.start.y)

  return {
    x,
    y,
    width,
    height,
  }
}
