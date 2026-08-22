import { Layer, Stage } from 'react-konva'
import type { DrawingDocument } from '../../domain/drawing'
import type { RectangleShape } from '../../domain/shapes'
import type { DrawingAction } from '../../state/drawingReducer'
import type { ToolId } from '../tools/drawingTools'
import { RectanglesLayer } from './components/RectanglesLayer'
import { useCanvasInteraction } from './hooks/useCanvasInteraction'
import { useRectangleDrawing } from './hooks/useRectangleDrawing'

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
  const rectangleDrawing = useRectangleDrawing(dispatch)
  const stageHandlers = useCanvasInteraction(activeTool, {
    rectangle: rectangleDrawing.interaction,
  })

  const rectangles = document.shapes.filter((shape): shape is RectangleShape => (
    shape.type === 'rectangle'
  ))

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      {...stageHandlers}
    >
      <Layer>
        <RectanglesLayer
          rectangles={rectangles}
          previewRectangle={rectangleDrawing.previewRectangle}
        />
      </Layer>
    </Stage>
  )
}
