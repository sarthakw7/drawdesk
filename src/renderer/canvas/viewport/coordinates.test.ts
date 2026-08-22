import { describe, expect, it } from 'vitest'
import type { Point } from '../geometry/rectangles'
import {
  clampZoom,
  screenToWorld,
  type Viewport,
  worldToScreen,
  zoomViewportAtPoint,
} from './coordinates'

const expectPointCloseTo = (actual: Point, expected: Point) => {
  expect(actual.x).toBeCloseTo(expected.x)
  expect(actual.y).toBeCloseTo(expected.y)
}

describe('viewport coordinate utilities', () => {
  it('converts screen coordinates to world coordinates', () => {
    const viewport: Viewport = {
      x: 100,
      y: -50,
      zoom: 2,
    }

    expect(screenToWorld({ x: 140, y: 10 }, viewport)).toEqual({
      x: 20,
      y: 30,
    })
  })

  it('converts world coordinates to screen coordinates', () => {
    const viewport: Viewport = {
      x: -25,
      y: 75,
      zoom: 0.5,
    }

    expect(worldToScreen({ x: 50, y: -30 }, viewport)).toEqual({
      x: 0,
      y: 60,
    })
  })

  it('round-trips between world and screen coordinates', () => {
    const viewport: Viewport = {
      x: -312.5,
      y: 88.25,
      zoom: 1.75,
    }
    const worldPoint = {
      x: 123.4,
      y: -56.7,
    }

    expectPointCloseTo(
      screenToWorld(worldToScreen(worldPoint, viewport), viewport),
      worldPoint,
    )
  })

  it('clamps zoom to the supported range', () => {
    expect(clampZoom(0.01)).toBe(0.2)
    expect(clampZoom(1.5)).toBe(1.5)
    expect(clampZoom(10)).toBe(5)
  })

  it('keeps the same world point under the pointer when zooming', () => {
    const viewport: Viewport = {
      x: -200,
      y: 120,
      zoom: 1.5,
    }
    const pointer = {
      x: 320,
      y: 240,
    }
    const worldBefore = screenToWorld(pointer, viewport)

    const nextViewport = zoomViewportAtPoint(viewport, pointer, -250)

    expectPointCloseTo(screenToWorld(pointer, nextViewport), worldBefore)
  })

  it('anchors pointer-centered zoom when clamped at the minimum zoom', () => {
    const viewport: Viewport = {
      x: 450,
      y: -300,
      zoom: 0.25,
    }
    const pointer = {
      x: 25,
      y: 575,
    }
    const worldBefore = screenToWorld(pointer, viewport)

    const nextViewport = zoomViewportAtPoint(viewport, pointer, 10_000)

    expect(nextViewport.zoom).toBe(0.2)
    expectPointCloseTo(screenToWorld(pointer, nextViewport), worldBefore)
  })

  it('anchors pointer-centered zoom when clamped at the maximum zoom', () => {
    const viewport: Viewport = {
      x: -800,
      y: -600,
      zoom: 4.8,
    }
    const pointer = {
      x: 799,
      y: 1,
    }
    const worldBefore = screenToWorld(pointer, viewport)

    const nextViewport = zoomViewportAtPoint(viewport, pointer, -10_000)

    expect(nextViewport.zoom).toBe(5)
    expectPointCloseTo(screenToWorld(pointer, nextViewport), worldBefore)
  })
})
