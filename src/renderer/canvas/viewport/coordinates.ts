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

export const screenToWorld = (point: Point, viewport: Viewport): Point => ({
  x: (point.x - viewport.x) / viewport.zoom,
  y: (point.y - viewport.y) / viewport.zoom,
})

export const worldToScreen = (point: Point, viewport: Viewport): Point => ({
  x: point.x * viewport.zoom + viewport.x,
  y: point.y * viewport.zoom + viewport.y,
})
