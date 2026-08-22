import { useState } from 'react'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { Point } from '../geometry/rectangles'
import type { DraftLine } from '../geometry/lines'
import { createLineGeometry } from '../geometry/lines'
import { createShapeId } from '../shapeIds'

type DispatchDrawingAction = (action: DrawingAction) => void

export const useLineDrawing = (dispatch: DispatchDrawingAction) => {
  const [draftLine, setDraftLine] = useState<DraftLine | null>(null)

  const handlePointerDown = (point: Point) => {
    setDraftLine({
      start: point,
      end: point,
    })
  }

  const handlePointerMove = (point: Point) => {
    if (!draftLine) {
      return
    }

    setDraftLine({
      ...draftLine,
      end: point,
    })
  }

  const handlePointerUp = () => {
    if (!draftLine) {
      return
    }

    const line = createLineGeometry(draftLine)

    setDraftLine(null)

    if (line.startX === line.endX && line.startY === line.endY) {
      return
    }

    dispatch({
      type: 'add-shape',
      shape: {
        id: createShapeId(),
        type: 'line',
        ...line,
      },
    })
  }

  return {
    previewLine: draftLine ? createLineGeometry(draftLine) : null,
    interaction: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
