import { createEmptyDrawing, type DrawingDocument } from '../domain/drawing'
import type { Shape } from '../domain/shapes'

type ShapePatch<TShape extends Shape> = Partial<Omit<TShape, 'id' | 'type'>>

type UpdateShapeAction = {
  [TShape in Shape as TShape['type']]: {
    type: 'update-shape'
    id: string
    shapeType: TShape['type']
    updates: ShapePatch<TShape>
  }
}[Shape['type']]

export type DrawingAction =
  | {
      type: 'add-shape'
      shape: Shape
    }
  | UpdateShapeAction
  | {
      type: 'clear-drawing'
    }
  | {
      type: 'replace-document'
      document: DrawingDocument
    }

export const drawingReducer = (
  document: DrawingDocument,
  action: DrawingAction,
): DrawingDocument => {
  switch (action.type) {
    case 'add-shape':
      return {
        ...document,
        shapes: [...document.shapes, action.shape],
      }

    case 'update-shape':
      return {
        ...document,
        shapes: document.shapes.map((shape) => {
          if (shape.id !== action.id || shape.type !== action.shapeType) {
            return shape
          }

          return {
            ...shape,
            ...action.updates,
          } as Shape
        }),
      }

    case 'clear-drawing':
      return createEmptyDrawing()

    case 'replace-document':
      return action.document
  }
}
