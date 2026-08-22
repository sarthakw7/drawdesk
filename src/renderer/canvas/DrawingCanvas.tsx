import { Layer, Stage } from 'react-konva'
import type { DrawingDocument } from '../../domain/drawing'
import type { RectangleShape } from '../../domain/shapes'
import type { DrawingAction } from '../../state/drawingReducer'
import { RectanglesLayer } from './components/RectanglesLayer'
import { useRectangleDrawing } from './hooks/useRectangleDrawing'

type DrawingCanvasProps = {
  document: DrawingDocument
  dispatch: (action: DrawingAction) => void
}

const stageSize = {
  width: 800,
  height: 600,
}

export function DrawingCanvas({ document, dispatch }: DrawingCanvasProps) {
  const { previewRectangle, stageHandlers } = useRectangleDrawing(dispatch)

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
        <RectanglesLayer rectangles={rectangles} previewRectangle={previewRectangle} />
      </Layer>
    </Stage>
  )
}
