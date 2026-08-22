import { useReducer } from 'react'
import { createEmptyDrawing } from '../domain/drawing'
import { drawingReducer } from '../state/drawingReducer'
import { DrawingCanvas } from './canvas/DrawingCanvas'

export function App() {
  const [document, dispatch] = useReducer(drawingReducer, undefined, createEmptyDrawing)

  return <DrawingCanvas document={document} dispatch={dispatch} />
}
