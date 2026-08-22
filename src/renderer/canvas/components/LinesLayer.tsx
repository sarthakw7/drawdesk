import { Line } from 'react-konva'
import type { LineShape } from '../../../domain/shapes'
import type { DrawingAction } from '../../../state/drawingReducer'
import type { ToolId } from '../../tools/drawingTools'
import type { LineGeometry } from '../geometry/lines'
import type { ShapeSelection } from '../selection'

type LinesLayerProps = {
  lines: LineShape[]
  previewLine: LineGeometry | null
  activeTool: ToolId
  selection: ShapeSelection
  dispatch: (action: DrawingAction) => void
}

const getLinePoints = (line: LineGeometry) => [
  line.startX,
  line.startY,
  line.endX,
  line.endY,
]

export function LinesLayer({
  lines,
  previewLine,
  activeTool,
  selection,
  dispatch,
}: LinesLayerProps) {
  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={getLinePoints(line)}
          stroke={selection.selectedShapeId === line.id ? '#f59e0b' : '#1f2937'}
          strokeWidth={selection.selectedShapeId === line.id ? 3 : 2}
          hitStrokeWidth={10}
          draggable={selection.canInteractWithShape(line.id)}
          onPointerDown={(event) => {
            if (activeTool !== 'select') {
              return
            }

            event.cancelBubble = true
            selection.selectShape(line.id)
          }}
          onDragEnd={(event) => {
            const deltaX = event.target.x()
            const deltaY = event.target.y()

            event.target.position({ x: 0, y: 0 })
            dispatch({
              type: 'update-shape',
              id: line.id,
              shapeType: 'line',
              updates: {
                startX: line.startX + deltaX,
                startY: line.startY + deltaY,
                endX: line.endX + deltaX,
                endY: line.endY + deltaY,
              },
            })
          }}
        />
      ))}
      {previewLine ? (
        <Line
          points={getLinePoints(previewLine)}
          stroke="#2563eb"
          strokeWidth={2}
          dash={[6, 4]}
        />
      ) : null}
    </>
  )
}
