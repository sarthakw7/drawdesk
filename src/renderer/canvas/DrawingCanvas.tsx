import { useEffect, useState } from 'react'
import type { KonvaEventObject } from 'konva/lib/Node'
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
import { ZoomControls } from './components/ZoomControls'
import { getCanvasCursor } from './cursor'
import { useCanvasInteraction } from './hooks/useCanvasInteraction'
import { useEllipseDrawing } from './hooks/useEllipseDrawing'
import { useElementSize } from './hooks/useElementSize'
import { useLineDrawing } from './hooks/useLineDrawing'
import { useRectangleDrawing } from './hooks/useRectangleDrawing'
import { useTextDrawing } from './hooks/useTextDrawing'
import { useViewport } from './viewport/useViewport'

type DrawingCanvasProps = {
  document: DrawingDocument
  dispatch: (action: DrawingAction) => void
  activeTool: ToolId
}

const zoomButtonDelta = 200

export function DrawingCanvas({
  document,
  dispatch,
  activeTool,
}: DrawingCanvasProps) {
  const { elementRef, size } = useElementSize()
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const rectangleDrawing = useRectangleDrawing(dispatch)
  const ellipseDrawing = useEllipseDrawing(dispatch)
  const lineDrawing = useLineDrawing(dispatch)
  const textDrawing = useTextDrawing(dispatch)
  const { viewport, isPanning, zoomAtPoint, panInteraction } = useViewport()

  useEffect(() => {
    if (selectedShapeId && !document.shapes.some((shape) => shape.id === selectedShapeId)) {
      setSelectedShapeId(null)
    }
  }, [document.shapes, selectedShapeId])

  const stageHandlers = useCanvasInteraction(activeTool, viewport, {
    select: {
      onPointerDown: () => setSelectedShapeId(null),
    },
    pan: panInteraction,
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
  const cursor = getCanvasCursor(activeTool, isPanning)
  const stageCenter = {
    x: size.width / 2,
    y: size.height / 2,
  }
  const handleWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault()

    const point = event.target.getStage()?.getPointerPosition()

    if (!point) {
      return
    }

    zoomAtPoint(point, event.evt.deltaY)
  }

  return (
    <div
      ref={elementRef}
      style={{
        position: 'relative',
        flex: '1 1 0',
        minHeight: 0,
        width: '100%',
        cursor,
      }}
    >
      {size.width > 0 && size.height > 0 ? (
        <Stage
          width={size.width}
          height={size.height}
          onWheel={handleWheel}
          {...stageHandlers}
        >
          <Layer
            x={viewport.x}
            y={viewport.y}
            scaleX={viewport.zoom}
            scaleY={viewport.zoom}
          >
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
      ) : null}
      <TextInputOverlay
        draftText={textDrawing.draftText}
        viewport={viewport}
        onChange={textDrawing.updateDraftText}
        onCommit={textDrawing.commitDraftText}
        onCancel={textDrawing.cancelDraftText}
      />
      <ZoomControls
        zoom={viewport.zoom}
        onZoomIn={() => zoomAtPoint(stageCenter, -zoomButtonDelta)}
        onZoomOut={() => zoomAtPoint(stageCenter, zoomButtonDelta)}
      />
    </div>
  )
}
