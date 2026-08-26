import { useRef, useState } from 'react'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { Point } from '../geometry/rectangles'
import { createShapeId } from '../shapeIds'

type DispatchDrawingAction = (action: DrawingAction) => void

export type DraftText = {
  x: number
  y: number
  text: string
}

export const useTextDrawing = (dispatch: DispatchDrawingAction) => {
  const [draftText, setDraftText] = useState<DraftText | null>(null)
  const draftTextRef = useRef<DraftText | null>(null)

  const startDraftText = (point: Point, text = '') => {
    const nextDraft = {
      x: point.x,
      y: point.y,
      text,
    }

    draftTextRef.current = nextDraft
    setDraftText(nextDraft)
  }

  const handlePointerDown = (point: Point) => {
    startDraftText(point)
  }

  const updateDraftText = (text: string) => {
    setDraftText((currentDraft) => {
      const nextDraft = currentDraft
        ? {
            ...currentDraft,
            text,
          }
        : null

      draftTextRef.current = nextDraft
      return nextDraft
    })
  }

  const takeDraftTextAction = (): DrawingAction | null => {
    const draft = draftTextRef.current

    if (!draft) {
      return null
    }

    if (draft.text.trim() === '') {
      cancelDraftText()
      return null
    }

    const action: DrawingAction = {
      type: 'add-shape',
      shape: {
        id: createShapeId(),
        type: 'text',
        x: draft.x,
        y: draft.y,
        text: draft.text,
      },
    }

    draftTextRef.current = null
    setDraftText(null)

    return action
  }

  const commitDraftText = () => {
    const action = takeDraftTextAction()

    if (!action) {
      return
    }

    dispatch(action)
  }

  const cancelDraftText = () => {
    draftTextRef.current = null
    setDraftText(null)
  }

  return {
    draftText,
    startDraftText,
    updateDraftText,
    commitDraftText,
    takeDraftTextAction,
    cancelDraftText,
    interaction: {
      onPointerDown: handlePointerDown,
    },
  }
}
