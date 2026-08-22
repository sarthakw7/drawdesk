import { useRef, useState } from 'react'
import type { Point } from '../geometry/rectangles'
import { initialViewport, type Viewport, zoomViewportAtPoint } from './coordinates'

type PanGesture = {
  startPoint: Point
  startViewport: Viewport
}

export const useViewport = () => {
  const [viewport, setViewport] = useState<Viewport>(initialViewport)
  const [isPanning, setIsPanning] = useState(false)
  const panGestureRef = useRef<PanGesture | null>(null)

  const startPan = (point: Point) => {
    setIsPanning(true)
    panGestureRef.current = {
      startPoint: point,
      startViewport: viewport,
    }
  }

  const updatePan = (point: Point) => {
    const panGesture = panGestureRef.current

    if (!panGesture) {
      return
    }

    setViewport({
      ...panGesture.startViewport,
      x: panGesture.startViewport.x + point.x - panGesture.startPoint.x,
      y: panGesture.startViewport.y + point.y - panGesture.startPoint.y,
    })
  }

  const endPan = () => {
    panGestureRef.current = null
    setIsPanning(false)
  }

  const zoomAtPoint = (point: Point, wheelDeltaY: number) => {
    setViewport((currentViewport) => zoomViewportAtPoint(currentViewport, point, wheelDeltaY))
  }

  return {
    viewport,
    isPanning,
    zoomAtPoint,
    panInteraction: {
      onPointerDown: startPan,
      onPointerMove: updatePan,
      onPointerUp: endPan,
    },
  }
}
