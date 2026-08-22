import type { LineShape } from '../../../domain/shapes'
import type { Point } from './rectangles'

export type DraftLine = {
  start: Point
  end: Point
}

export type LineGeometry = Omit<LineShape, 'id' | 'type'>

export const createLineGeometry = (draft: DraftLine): LineGeometry => ({
  startX: draft.start.x,
  startY: draft.start.y,
  endX: draft.end.x,
  endY: draft.end.y,
})
