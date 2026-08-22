import { useState } from 'react'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { Point } from '../geometry/rectangles'
import type { DraftEllipse } from '../geometry/ellipses'
import { normalizeEllipse } from '../geometry/ellipses'
import { createShapeId } from '../shapeIds'

type DispatchDrawingAction = (action: DrawingAction) => void

export const useEllipseDrawing = (dispatch: DispatchDrawingAction) => {
  const [draftEllipse, setDraftEllipse] = useState<DraftEllipse | null>(null)

  const handlePointerDown = (point: Point) => {
    setDraftEllipse({
      start: point,
      end: point,
    })
  }

  const handlePointerMove = (point: Point) => {
    if (!draftEllipse) {
      return
    }

    setDraftEllipse({
      ...draftEllipse,
      end: point,
    })
  }

  const handlePointerUp = () => {
    if (!draftEllipse) {
      return
    }

    const ellipse = normalizeEllipse(draftEllipse)

    setDraftEllipse(null)

    if (ellipse.width === 0 || ellipse.height === 0) {
      return
    }

    dispatch({
      type: 'add-shape',
      shape: {
        id: createShapeId(),
        type: 'ellipse',
        ...ellipse,
      },
    })
  }

  return {
    previewEllipse: draftEllipse ? normalizeEllipse(draftEllipse) : null,
    interaction: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
