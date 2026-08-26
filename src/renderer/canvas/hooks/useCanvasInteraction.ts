import { useCallback, useEffect, useRef } from 'react'
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
  documentReplacementKey: number,
) => {
  const activeGestureTool = useRef<ToolId | null>(null)
  const activePointerId = useRef<number | null>(null)
  const capturedElement = useRef<HTMLElement | null>(null)
  const removePanFallbackListeners = useRef<(() => void) | null>(null)
  const interactionsRef = useRef(interactions)

  useEffect(() => {
    interactionsRef.current = interactions
  }, [interactions])

  const getInteraction = useCallback((tool: ToolId): ToolInteraction | null => {
    const currentInteractions = interactionsRef.current

    switch (tool) {
      case 'select':
        return currentInteractions.select
      case 'pan':
        return currentInteractions.pan
      case 'rectangle':
        return currentInteractions.rectangle
      case 'ellipse':
        return currentInteractions.ellipse
      case 'line':
        return currentInteractions.line
      case 'text':
        return currentInteractions.text
      default:
        return null
    }
  }, [])

  const releasePointerCapture = useCallback(() => {
    const pointerId = activePointerId.current
    const element = capturedElement.current

    try {
      if (pointerId !== null && element?.hasPointerCapture(pointerId)) {
        element.releasePointerCapture(pointerId)
      }
    } catch {
      // Pointer capture may already be gone after browser-level cancellation.
    }

    capturedElement.current = null
  }, [])

  const removeFallbackListeners = useCallback(() => {
    removePanFallbackListeners.current?.()
    removePanFallbackListeners.current = null
  }, [])

  const clearActiveGesture = useCallback(() => {
    releasePointerCapture()
    removeFallbackListeners()
    activeGestureTool.current = null
    activePointerId.current = null
  }, [releasePointerCapture, removeFallbackListeners])

  const completeActiveGesture = useCallback(() => {
    if (activeGestureTool.current) {
      getInteraction(activeGestureTool.current)?.onPointerUp?.()
    }

    clearActiveGesture()
  }, [clearActiveGesture, getInteraction])

  const cancelActiveGesture = useCallback(() => {
    if (activeGestureTool.current === 'pan') {
      getInteraction('pan')?.onPointerUp?.()
    }

    clearActiveGesture()
  }, [clearActiveGesture, getInteraction])

  useEffect(() => {
    if (activeTool !== 'pan' && activeGestureTool.current === 'pan') {
      cancelActiveGesture()
    }
  }, [activeTool, cancelActiveGesture])

  useEffect(() => {
    cancelActiveGesture()
  }, [documentReplacementKey, cancelActiveGesture])

  useEffect(() => (
    () => {
      cancelActiveGesture()
    }
  ), [cancelActiveGesture])

  const getInteractionPoint = (tool: ToolId, point: Point) => (
    tool === 'pan' ? point : screenToWorld(point, viewport)
  )

  const capturePanPointer = (event: KonvaEventObject<PointerEvent>) => {
    const stage = event.target.getStage()
    const content = stage?.getContent()
    const pointerId = event.evt.pointerId

    activePointerId.current = pointerId

    if (content && pointerId !== undefined) {
      try {
        content.setPointerCapture(pointerId)
        capturedElement.current = content
      } catch {
        capturedElement.current = null
      }
    }
  }

  const addPanFallbackListeners = () => {
    removeFallbackListeners()

    const handlePointerEnd = (event: PointerEvent) => {
      if (activePointerId.current === null || event.pointerId === activePointerId.current) {
        completeActiveGesture()
      }
    }
    const handleCancel = () => {
      cancelActiveGesture()
    }

    window.addEventListener('pointerup', handlePointerEnd, true)
    window.addEventListener('pointercancel', handlePointerEnd, true)
    window.addEventListener('blur', handleCancel)

    removePanFallbackListeners.current = () => {
      window.removeEventListener('pointerup', handlePointerEnd, true)
      window.removeEventListener('pointercancel', handlePointerEnd, true)
      window.removeEventListener('blur', handleCancel)
    }
  }

  const handlePointerDown = (event: KonvaEventObject<PointerEvent>) => {
    const point = getPointerPosition(event)

    if (!point) {
      return
    }

    activeGestureTool.current = activeTool
    if (activeTool === 'text') {
      event.evt.preventDefault()
    }

    if (activeTool === 'pan') {
      capturePanPointer(event)
      addPanFallbackListeners()
    }
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
    completeActiveGesture()
  }

  const handlePointerCancel = () => {
    if (activeGestureTool.current === 'pan') {
      cancelActiveGesture()
      return
    }

    clearActiveGesture()
  }

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  }
}
