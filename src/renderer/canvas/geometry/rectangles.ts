import type { RectangleShape } from '../../../domain/shapes'

export type Point = {
  x: number
  y: number
}

export type DraftRectangle = {
  start: Point
  end: Point
}

export type RectangleGeometry = Omit<RectangleShape, 'id' | 'type'>

export const normalizeRectangle = (draft: DraftRectangle): RectangleGeometry => {
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
