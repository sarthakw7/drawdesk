import { useReducer, useState } from 'react'
import { createEmptyDrawing } from '../domain/drawing'
import { drawingReducer } from '../state/drawingReducer'
import { DrawingCanvas } from './canvas/DrawingCanvas'
import { Toolbar } from './components/Toolbar'
import { defaultTool, type ToolId } from './tools/drawingTools'

export function App() {
  const [document, dispatch] = useReducer(drawingReducer, undefined, createEmptyDrawing)
  const [activeTool, setActiveTool] = useState<ToolId>(defaultTool)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Toolbar activeTool={activeTool} onSelectTool={setActiveTool} />
      <DrawingCanvas document={document} dispatch={dispatch} activeTool={activeTool} />
    </div>
  )
}
