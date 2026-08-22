import { useReducer, useState } from 'react'
import { createEmptyDrawing } from '../domain/drawing'
import { drawingReducer } from '../state/drawingReducer'
import { DrawingCanvas } from './canvas/DrawingCanvas'
import { Toolbar } from './components/Toolbar'
import { defaultTool, type ToolId } from './tools/drawingTools'

export function App() {
  const [document, dispatch] = useReducer(drawingReducer, undefined, createEmptyDrawing)
  const [activeTool, setActiveTool] = useState<ToolId>(defaultTool)

  console.log('document shapes:', document.shapes)

  return (
    <>
      <Toolbar activeTool={activeTool} onSelectTool={setActiveTool} />
      <DrawingCanvas document={document} dispatch={dispatch} activeTool={activeTool} />
    </>
  )
}
