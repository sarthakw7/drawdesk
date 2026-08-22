import type { Shape } from './shapes'

export const CURRENT_SCHEMA_VERSION = 1

export interface DrawingDocument {
  schemaVersion: number
  shapes: Shape[]
}

export const createEmptyDrawing = (): DrawingDocument => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  shapes: [],
})