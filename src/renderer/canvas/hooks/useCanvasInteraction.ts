import { useRef } from 'react'
import type { KonvaEventObject } from 'konva/lib/Node'
import type { ToolId } from '../../tools/drawingTools'
import type { Point } from '../geometry/rectangles'
import { screenToWorld, type Viewport } from '../viewport/coordinates'

type ToolInteraction = {
  onPointerDown?: (point: Point) => void
  onPointerMove?: (point: Point) => void
  onPointerUp?: () => void
}

type CanvasInteractions = {
  select: ToolInteraction
  pan: ToolInteraction
  rectangle: ToolInteraction
  ellipse: ToolInteraction
  line: ToolInteraction
  text: ToolInteraction
}

const getPointerPosition = (event: KonvaEventObject<PointerEvent>) => (
  event.target.getStage()?.getPointerPosition() ?? null
)

export const useCanvasInteraction = (
  activeTool: ToolId,
  viewport: Viewport,
  interactions: CanvasInteractions,
) => {
  const activeGestureTool = useRef<ToolId | null>(null)

  const getInteraction = (tool: ToolId): ToolInteraction | null => {
    switch (tool) {
      case 'select':
        return interactions.select
      case 'pan':
        return interactions.pan
      case 'rectangle':
        return interactions.rectangle
      case 'ellipse':
        return interactions.ellipse
      case 'line':
        return interactions.line
      case 'text':
        return interactions.text
      default:
        return null
    }
  }

  const getInteractionPoint = (tool: ToolId, point: Point) => (
    tool === 'pan' ? point : screenToWorld(point, viewport)
  )

  const handlePointerDown = (event: KonvaEventObject<PointerEvent>) => {
    const point = getPointerPosition(event)

    if (!point) {
      return
    }

    activeGestureTool.current = activeTool
    getInteraction(activeTool)?.onPointerDown?.(getInteractionPoint(activeTool, point))
  }

  const handlePointerMove = (event: KonvaEventObject<PointerEvent>) => {
    const point = getPointerPosition(event)

    if (!point) {
      return
    }

    if (!activeGestureTool.current) {
      return
    }

    getInteraction(activeGestureTool.current)?.onPointerMove?.(
      getInteractionPoint(activeGestureTool.current, point),
    )
  }

  const handlePointerUp = () => {
    if (activeGestureTool.current) {
      getInteraction(activeGestureTool.current)?.onPointerUp?.()
    }

    activeGestureTool.current = null
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  }
}
