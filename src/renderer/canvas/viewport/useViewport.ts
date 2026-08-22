import { useRef, useState } from 'react'
import type { Point } from '../geometry/rectangles'
import { initialViewport, type Viewport } from './coordinates'

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

  return {
    viewport,
    isPanning,
    panInteraction: {
      onPointerDown: startPan,
      onPointerMove: updatePan,
      onPointerUp: endPan,
    },
  }
}
