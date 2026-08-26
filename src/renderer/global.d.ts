export {}

import type { DrawingDocument } from '../domain/drawing'

type SaveDrawingResult =
  | {
      status: 'saved'
      fileName: string
    }
  | {
      status: 'cancelled'
    }

type OpenDrawingResult =
  | {
      status: 'opened'
      pendingOpenId: string
      fileName: string
      document: unknown
    }
  | {
      status: 'cancelled'
    }
  | {
      status: 'error'
      message: string
    }

type ClearCurrentDrawingResult = {
  status: 'cleared'
  fileName: string
}

type ConfirmOpenDrawingResult =
  | {
      status: 'confirmed'
      fileName: string
    }
  | {
      status: 'ignored'
    }

declare global {
  interface Window {
    versions: {
      node: () => string
      chrome: () => string
      electron: () => string
    }
    drawingFiles: {
      save: (document: DrawingDocument) => Promise<SaveDrawingResult>
      open: () => Promise<OpenDrawingResult>
      confirmOpen: (pendingOpenId: string) => Promise<ConfirmOpenDrawingResult>
      clearCurrent: () => Promise<ClearCurrentDrawingResult>
    }
  }
}
