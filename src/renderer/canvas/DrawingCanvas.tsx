import { Layer, Stage } from 'react-konva'
import type { DrawingDocument } from '../../domain/drawing'
import type { EllipseShape, LineShape, RectangleShape, TextShape } from '../../domain/shapes'
import type { DrawingAction } from '../../state/drawingReducer'
import type { ToolId } from '../tools/drawingTools'
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
  const rectangleDrawing = useRectangleDrawing(dispatch)
  const ellipseDrawing = useEllipseDrawing(dispatch)
  const lineDrawing = useLineDrawing(dispatch)
  const textDrawing = useTextDrawing(dispatch)
  const stageHandlers = useCanvasInteraction(activeTool, {
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
          />
          <EllipsesLayer
            ellipses={ellipses}
            previewEllipse={ellipseDrawing.previewEllipse}
          />
          <LinesLayer
            lines={lines}
            previewLine={lineDrawing.previewLine}
          />
          <TextsLayer texts={texts} />
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
