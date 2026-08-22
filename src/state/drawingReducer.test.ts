import { describe, expect, it } from 'vitest'
import { CURRENT_SCHEMA_VERSION, createEmptyDrawing, type DrawingDocument } from '../domain/drawing'
import type { EllipseShape, LineShape, RectangleShape, TextShape } from '../domain/shapes'
import { drawingReducer } from './drawingReducer'

const rectangle: RectangleShape = {
  id: 'rectangle-1',
  type: 'rectangle',
  x: 10,
  y: 20,
  width: 100,
  height: 80,
}

const ellipse: EllipseShape = {
  id: 'ellipse-1',
  type: 'ellipse',
  x: 40,
  y: 50,
  width: 120,
  height: 90,
}

const line: LineShape = {
  id: 'line-1',
  type: 'line',
  startX: 0,
  startY: 0,
  endX: 60,
  endY: 70,
}

const text: TextShape = {
  id: 'text-1',
  type: 'text',
  x: 15,
  y: 25,
  text: 'Hello',
}

const createDocument = (): DrawingDocument => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  shapes: [rectangle, ellipse, line, text],
})

describe('drawingReducer', () => {
  it('adds a shape immutably', () => {
    const document = createEmptyDrawing()

    const result = drawingReducer(document, {
      type: 'add-shape',
      shape: rectangle,
    })

    expect(result).toEqual({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [rectangle],
    })
    expect(result).not.toBe(document)
    expect(result.shapes).not.toBe(document.shapes)
    expect(document.shapes).toEqual([])
  })

  it('updates the correct shape by id immutably', () => {
    const document = createDocument()

    const result = drawingReducer(document, {
      type: 'update-shape',
      id: 'rectangle-1',
      shapeType: 'rectangle',
      updates: {
        x: 30,
        width: 140,
      },
    })

    expect(result.shapes[0]).toEqual({
      ...rectangle,
      x: 30,
      width: 140,
    })
    expect(result.shapes[1]).toBe(ellipse)
    expect(result.shapes[2]).toBe(line)
    expect(result.shapes[3]).toBe(text)
    expect(result).not.toBe(document)
    expect(result.shapes).not.toBe(document.shapes)
    expect(result.shapes[0]).not.toBe(rectangle)
    expect(document.shapes[0]).toBe(rectangle)
  })

  it('does not update a shape with the same id but a different shape type', () => {
    const document = createDocument()

    const result = drawingReducer(document, {
      type: 'update-shape',
      id: 'rectangle-1',
      shapeType: 'ellipse',
      updates: {
        x: 30,
      },
    })

    expect(result).toEqual(document)
    expect(result.shapes[0]).toBe(rectangle)
  })

  it('leaves document content unchanged when updating a missing id', () => {
    const document = createDocument()

    const result = drawingReducer(document, {
      type: 'update-shape',
      id: 'missing-shape',
      shapeType: 'line',
      updates: {
        endX: 200,
      },
    })

    expect(result).toEqual(document)
    expect(result).not.toBe(document)
    expect(result.shapes).not.toBe(document.shapes)
    expect(result.shapes[0]).toBe(rectangle)
    expect(result.shapes[1]).toBe(ellipse)
    expect(result.shapes[2]).toBe(line)
    expect(result.shapes[3]).toBe(text)
  })

  it('clears the drawing with a fresh empty document', () => {
    const document = createDocument()

    const result = drawingReducer(document, {
      type: 'clear-drawing',
    })

    expect(result).toEqual({
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [],
    })
    expect(result).not.toBe(document)
    expect(document.shapes).toHaveLength(4)
  })

  it('replaces the document', () => {
    const document = createDocument()
    const replacement: DrawingDocument = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      shapes: [text],
    }

    const result = drawingReducer(document, {
      type: 'replace-document',
      document: replacement,
    })

    expect(result).toBe(replacement)
  })
})
