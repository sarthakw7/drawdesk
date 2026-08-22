import { describe, expect, it } from 'vitest'
import { normalizeEllipse } from './ellipses'
import { createLineGeometry } from './lines'
import { normalizeRectangle } from './rectangles'

describe('rectangle geometry', () => {
  it('normalizes rectangles dragged down and right', () => {
    expect(normalizeRectangle({
      start: { x: 10, y: 20 },
      end: { x: 60, y: 80 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes rectangles dragged down and left', () => {
    expect(normalizeRectangle({
      start: { x: 60, y: 20 },
      end: { x: 10, y: 80 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes rectangles dragged up and right', () => {
    expect(normalizeRectangle({
      start: { x: 10, y: 80 },
      end: { x: 60, y: 20 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes rectangles dragged up and left', () => {
    expect(normalizeRectangle({
      start: { x: 60, y: 80 },
      end: { x: 10, y: 20 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('supports zero-width and zero-height rectangles', () => {
    expect(normalizeRectangle({
      start: { x: 20, y: 20 },
      end: { x: 20, y: 80 },
    })).toEqual({
      x: 20,
      y: 20,
      width: 0,
      height: 60,
    })

    expect(normalizeRectangle({
      start: { x: 20, y: 20 },
      end: { x: 80, y: 20 },
    })).toEqual({
      x: 20,
      y: 20,
      width: 60,
      height: 0,
    })
  })
})

describe('ellipse geometry', () => {
  it('normalizes ellipses dragged down and right', () => {
    expect(normalizeEllipse({
      start: { x: 10, y: 20 },
      end: { x: 60, y: 80 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes ellipses dragged down and left', () => {
    expect(normalizeEllipse({
      start: { x: 60, y: 20 },
      end: { x: 10, y: 80 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes ellipses dragged up and right', () => {
    expect(normalizeEllipse({
      start: { x: 10, y: 80 },
      end: { x: 60, y: 20 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('normalizes ellipses dragged up and left', () => {
    expect(normalizeEllipse({
      start: { x: 60, y: 80 },
      end: { x: 10, y: 20 },
    })).toEqual({
      x: 10,
      y: 20,
      width: 50,
      height: 60,
    })
  })

  it('supports zero-width and zero-height ellipses', () => {
    expect(normalizeEllipse({
      start: { x: 20, y: 20 },
      end: { x: 20, y: 80 },
    })).toEqual({
      x: 20,
      y: 20,
      width: 0,
      height: 60,
    })

    expect(normalizeEllipse({
      start: { x: 20, y: 20 },
      end: { x: 80, y: 20 },
    })).toEqual({
      x: 20,
      y: 20,
      width: 60,
      height: 0,
    })
  })
})

describe('line geometry', () => {
  it('preserves start and end points directly', () => {
    expect(createLineGeometry({
      start: { x: -10, y: 20 },
      end: { x: 70, y: -40 },
    })).toEqual({
      startX: -10,
      startY: 20,
      endX: 70,
      endY: -40,
    })
  })

  it('supports zero-length lines', () => {
    expect(createLineGeometry({
      start: { x: 12, y: 34 },
      end: { x: 12, y: 34 },
    })).toEqual({
      startX: 12,
      startY: 34,
      endX: 12,
      endY: 34,
    })
  })
})
