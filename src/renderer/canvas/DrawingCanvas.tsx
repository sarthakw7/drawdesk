import { useState } from 'react'
import { Layer, Stage } from 'react-konva'
import type { DrawingDocument } from '../../domain/drawing'
import type { EllipseShape, LineShape, RectangleShape, TextShape } from '../../domain/shapes'
import type { DrawingAction } from '../../state/drawingReducer'
import type { ToolId } from '../tools/drawingTools'
import type { ShapeSelection } from './selection'
import { EllipsesLayer } from './components/EllipsesLayer'
import { LinesLayer } from './components/LinesLayer'
import { RectanglesLayer } from './components/RectanglesLayer'
import { TextInputOverlay } from './components/TextInputOverlay'
import { TextsLayer } from './components/TextsLayer'
import { useCanvasInteraction } from './hooks/useCanvasInteraction'
import { useEllipseDrawing } from './hooks/useEllipseDrawing'
import { useLineDrawing } from './hooks/useLineDrawing'
import { useRectangleDrawing } from './hooks/useRectangleDrawing'
import { useTextDrawing } from './hooks/useTextDrawing'

type DrawingCanvasProps = {
  document: DrawingDocument
  dispatch: (action: DrawingAction) => void
  activeTool: ToolId
}

const stageSize = {
  width: 800,
  height: 600,
}

export function DrawingCanvas({ document, dispatch, activeTool }: DrawingCanvasProps) {
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const rectangleDrawing = useRectangleDrawing(dispatch)
  const ellipseDrawing = useEllipseDrawing(dispatch)
  const lineDrawing = useLineDrawing(dispatch)
  const textDrawing = useTextDrawing(dispatch)
  const stageHandlers = useCanvasInteraction(activeTool, {
    select: {
      onPointerDown: () => setSelectedShapeId(null),
    },
    rectangle: rectangleDrawing.interaction,
    ellipse: ellipseDrawing.interaction,
    line: lineDrawing.interaction,
    text: textDrawing.interaction,
  })

  const rectangles = document.shapes.filter((shape): shape is RectangleShape => (
    shape.type === 'rectangle'
  ))
  const ellipses = document.shapes.filter((shape): shape is EllipseShape => (
    shape.type === 'ellipse'
  ))
  const lines = document.shapes.filter((shape): shape is LineShape => (
    shape.type === 'line'
  ))
  const texts = document.shapes.filter((shape): shape is TextShape => (
    shape.type === 'text'
  ))
  const selection: ShapeSelection = {
    selectedShapeId,
    selectShape: setSelectedShapeId,
    clearSelection: () => setSelectedShapeId(null),
    canInteractWithShape: (shapeId) => activeTool === 'select' && selectedShapeId === shapeId,
    moveRectangle: (shapeId, x, y) => {
      dispatch({
        type: 'update-shape',
        id: shapeId,
        shapeType: 'rectangle',
        updates: {
          x,
          y,
        },
      })
    },
    moveEllipse: (shapeId, x, y) => {
      dispatch({
        type: 'update-shape',
        id: shapeId,
        shapeType: 'ellipse',
        updates: {
          x,
          y,
        },
      })
    },
    moveText: (shapeId, x, y) => {
      dispatch({
        type: 'update-shape',
        id: shapeId,
        shapeType: 'text',
        updates: {
          x,
          y,
        },
      })
    },
  }

  return (
    <div
      style={{
        position: 'relative',
        width: stageSize.width,
        height: stageSize.height,
      }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        {...stageHandlers}
      >
        <Layer>
          <RectanglesLayer
            rectangles={rectangles}
            previewRectangle={rectangleDrawing.previewRectangle}
            activeTool={activeTool}
            selection={selection}
          />
          <EllipsesLayer
            ellipses={ellipses}
            previewEllipse={ellipseDrawing.previewEllipse}
            activeTool={activeTool}
            selection={selection}
          />
          <LinesLayer
            lines={lines}
            previewLine={lineDrawing.previewLine}
            activeTool={activeTool}
            selection={selection}
            dispatch={dispatch}
          />
          <TextsLayer texts={texts} activeTool={activeTool} selection={selection} />
        </Layer>
      </Stage>
      <TextInputOverlay
        draftText={textDrawing.draftText}
        onChange={textDrawing.updateDraftText}
        onCommit={textDrawing.commitDraftText}
        onCancel={textDrawing.cancelDraftText}
      />
    </div>
  )
}
