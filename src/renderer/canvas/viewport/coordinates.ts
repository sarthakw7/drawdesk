import type { Point } from '../geometry/rectangles'

export type Viewport = {
  x: number
  y: number
  zoom: number
}

export const initialViewport: Viewport = {
  x: 0,
  y: 0,
  zoom: 1,
}

const minZoom = 0.2
const maxZoom = 5
const wheelZoomSensitivity = 0.001

export const clampZoom = (zoom: number) => (
  Math.min(maxZoom, Math.max(minZoom, zoom))
)

export const screenToWorld = (point: Point, viewport: Viewport): Point => ({
  x: (point.x - viewport.x) / viewport.zoom,
  y: (point.y - viewport.y) / viewport.zoom,
})

export const worldToScreen = (point: Point, viewport: Viewport): Point => ({
  x: point.x * viewport.zoom + viewport.x,
  y: point.y * viewport.zoom + viewport.y,
})

export const zoomViewportAtPoint = (
  viewport: Viewport,
  point: Point,
  wheelDeltaY: number,
): Viewport => {
  const nextZoom = clampZoom(viewport.zoom * Math.exp(-wheelDeltaY * wheelZoomSensitivity))
  const worldPoint = screenToWorld(point, viewport)

  return {
    x: point.x - worldPoint.x * nextZoom,
    y: point.y - worldPoint.y * nextZoom,
    zoom: nextZoom,
  }
}
