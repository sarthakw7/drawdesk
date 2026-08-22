import { Rect } from 'react-konva'
import type { RectangleShape } from '../../../domain/shapes'
import type { ToolId } from '../../tools/drawingTools'
import type { RectangleGeometry } from '../geometry/rectangles'
import type { ShapeSelection } from '../selection'

type RectanglesLayerProps = {
  rectangles: RectangleShape[]
  previewRectangle: RectangleGeometry | null
  activeTool: ToolId
  selection: ShapeSelection
}

export function RectanglesLayer({
  rectangles,
  previewRectangle,
  activeTool,
  selection,
}: RectanglesLayerProps) {
  return (
    <>
      {rectangles.map((rectangle) => (
        <Rect
          key={rectangle.id}
          x={rectangle.x}
          y={rectangle.y}
          width={rectangle.width}
          height={rectangle.height}
          stroke={selection.selectedShapeId === rectangle.id ? '#f59e0b' : '#1f2937'}
          strokeWidth={selection.selectedShapeId === rectangle.id ? 3 : 2}
          draggable={selection.canInteractWithShape(rectangle.id)}
          onPointerDown={(event) => {
            if (activeTool !== 'select') {
              return
            }

            event.cancelBubble = true
            selection.selectShape(rectangle.id)
          }}
          onDragEnd={(event) => {
            selection.moveRectangle(rectangle.id, event.target.x(), event.target.y())
          }}
        />
      ))}
      {previewRectangle ? (
        <Rect
          x={previewRectangle.x}
          y={previewRectangle.y}
          width={previewRectangle.width}
          height={previewRectangle.height}
          stroke="#2563eb"
          strokeWidth={2}
          dash={[6, 4]}
        />
      ) : null}
    </>
  )
}
