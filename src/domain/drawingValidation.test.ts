import { describe, expect, it } from 'vitest'
import { CURRENT_SCHEMA_VERSION, type DrawingDocument } from './drawing'
import { isDrawingDocument } from './drawingValidation'

const validDocument: DrawingDocument = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  shapes: [
    {
      id: 'rectangle-1',
      type: 'rectangle',
      x: 10,
      y: 20,
      width: 100,
      height: 80,
    },
    {
      id: 'ellipse-1',
      type: 'ellipse',
      x: 40,
      y: 50,
      width: 120,
      height: 90,
    },
    {
      id: 'line-1',
      type: 'line',
      startX: 0,
      startY: 10,
      endX: 120,
      endY: 140,
    },
    {
      id: 'text-1',
      type: 'text',
      x: 15,
      y: 25,
      text: 'Hello',
    },
  ],
}

describe('isDrawingDocument', () => {
  it('accepts a valid document', () => {
    expect(isDrawingDocument(validDocument)).toBe(true)
  })

  it('rejects invalid or missing schema versions', () => {
    expect(isDrawingDocument({ ...validDocument, schemaVersion: 999 })).toBe(false)
    expect(isDrawingDocument({ shapes: [] })).toBe(false)
  })

  it('rejects invalid shapes containers', () => {
    expect(isDrawingDocument({ schemaVersion: CURRENT_SCHEMA_VERSION })).toBe(false)
    expect(isDrawingDocument({ schemaVersion: CURRENT_SCHEMA_VERSION, shapes: null })).toBe(false)
    expect(isDrawingDocument({ schemaVersion: CURRENT_SCHEMA_VERSION, shapes: {} })).toBe(false)
  })

  it('rejects wrong shape types and base field types', () => {
    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 'shape-1', type: 'triangle', x: 0, y: 0 }],
    })).toBe(false)

    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 123, type: 'rectangle', x: 0, y: 0, width: 10, height: 10 }],
    })).toBe(false)
  })

  it('rejects malformed rectangle data', () => {
    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 'rectangle-1', type: 'rectangle', x: 0, y: 0, width: '10', height: 10 }],
    })).toBe(false)
  })

  it('rejects malformed ellipse data', () => {
    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 'ellipse-1', type: 'ellipse', x: 0, y: Number.NaN, width: 10, height: 10 }],
    })).toBe(false)
  })

  it('rejects malformed line data', () => {
    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 'line-1', type: 'line', startX: 0, startY: 0, endX: Infinity, endY: 10 }],
    })).toBe(false)
  })

  it('rejects malformed text data', () => {
    expect(isDrawingDocument({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [{ id: 'text-1', type: 'text', x: 0, y: 0, text: 123 }],
    })).toBe(false)
  })
})
