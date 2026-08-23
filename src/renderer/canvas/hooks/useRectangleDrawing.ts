import { useState } from 'react'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { DraftRectangle, Point } from '../geometry/rectangles'
import { normalizeRectangle } from '../geometry/rectangles'
import { createShapeId } from '../shapeIds'

type DispatchDrawingAction = (action: DrawingAction) => void

export const useRectangleDrawing = (dispatch: DispatchDrawingAction) => {
  const [draftRectangle, setDraftRectangle] = useState<DraftRectangle | null>(null)

  const handlePointerDown = (point: Point) => {
    setDraftRectangle({
      start: point,
      end: point,
    })
  }

  const handlePointerMove = (point: Point) => {
    if (!draftRectangle) {
      return
    }

    setDraftRectangle({
      ...draftRectangle,
      end: point,
    })
  }

  const handlePointerUp = () => {
    if (!draftRectangle) {
      return
    }

    const rectangle = normalizeRectangle(draftRectangle)

    setDraftRectangle(null)

    if (rectangle.width === 0 || rectangle.height === 0) {
      return
    }

    dispatch({
      type: 'add-shape',
      shape: {
        id: createShapeId(),
        type: 'rectangle',
        ...rectangle,
      },
    })
  }

  return {
    previewRectangle: draftRectangle ? normalizeRectangle(draftRectangle) : null,
    cancelDraft: () => setDraftRectangle(null),
    interaction: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
