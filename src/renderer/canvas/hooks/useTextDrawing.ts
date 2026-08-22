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

  const handlePointerDown = (point: Point) => {
    const nextDraft = {
      x: point.x,
      y: point.y,
      text: '',
    }

    draftTextRef.current = nextDraft
    setDraftText(nextDraft)
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

  const commitDraftText = () => {
    const draft = draftTextRef.current

    if (!draft) {
      return
    }

    

    dispatch({
      type: 'add-shape',
      shape: {
        id: createShapeId(),
        type: 'text',
        x: draft.x,
        y: draft.y,
        text: draft.text,
      },
    })
    draftTextRef.current = null
    setDraftText(null)
  }

  const cancelDraftText = () => {
    draftTextRef.current = null
    setDraftText(null)
  }

  return {
    draftText,
    updateDraftText,
    commitDraftText,
    cancelDraftText,
    interaction: {
      onPointerDown: handlePointerDown,
    },
  }
}
