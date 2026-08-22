import { useState } from 'react'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { DraftRectangle } from '../geometry/rectangles'
import { normalizeRectangle } from '../geometry/rectangles'

type DispatchDrawingAction = (action: DrawingAction) => void

const createShapeId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `shape-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const useRectangleDrawing = (dispatch: DispatchDrawingAction) => {
  const [draftRectangle, setDraftRectangle] = useState<DraftRectangle | null>(null)

  const handlePointerDown = (event: KonvaEventObject<PointerEvent>) => {
    const point = event.target.getStage()?.getPointerPosition()

    if (!point) {
      return
    }

    setDraftRectangle({
      start: point,
      end: point,
    })
  }

  const handlePointerMove = (event: KonvaEventObject<PointerEvent>) => {
    const point = event.target.getStage()?.getPointerPosition()

    if (!point || !draftRectangle) {
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
    stageHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
