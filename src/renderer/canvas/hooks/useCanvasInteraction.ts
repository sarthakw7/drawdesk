import type { KonvaEventObject } from 'konva/lib/Node'
import type { ToolId } from '../../tools/drawingTools'
import type { Point } from '../geometry/rectangles'

type ToolInteraction = {
  onPointerDown?: (point: Point) => void
  onPointerMove?: (point: Point) => void
  onPointerUp?: () => void
}

type CanvasInteractions = {
  rectangle: ToolInteraction
}

const getPointerPosition = (event: KonvaEventObject<PointerEvent>) => (
  event.target.getStage()?.getPointerPosition() ?? null
)

export const useCanvasInteraction = (
  activeTool: ToolId,
  interactions: CanvasInteractions,
) => {
  const getActiveInteraction = (): ToolInteraction | null => {
    switch (activeTool) {
      case 'rectangle':
        return interactions.rectangle
      default:
        return null
    }
  }

  const handlePointerDown = (event: KonvaEventObject<PointerEvent>) => {
    const point = getPointerPosition(event)

    if (!point) {
      return
    }

    getActiveInteraction()?.onPointerDown?.(point)
  }

  const handlePointerMove = (event: KonvaEventObject<PointerEvent>) => {
    const point = getPointerPosition(event)

    if (!point) {
      return
    }

    getActiveInteraction()?.onPointerMove?.(point)
  }

  const handlePointerUp = () => {
    getActiveInteraction()?.onPointerUp?.()
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  }
}
