import { Ellipse } from 'react-konva'
import type { EllipseShape } from '../../../domain/shapes'
import type { ToolId } from '../../tools/drawingTools'
import type { EllipseGeometry } from '../geometry/ellipses'
import type { ShapeSelection } from '../selection'

type EllipsesLayerProps = {
  ellipses: EllipseShape[]
  previewEllipse: EllipseGeometry | null
  activeTool: ToolId
  selection: ShapeSelection
}

const getEllipseProps = (ellipse: EllipseGeometry) => ({
  x: ellipse.x + ellipse.width / 2,
  y: ellipse.y + ellipse.height / 2,
  radiusX: ellipse.width / 2,
  radiusY: ellipse.height / 2,
})

export function EllipsesLayer({
  ellipses,
  previewEllipse,
  activeTool,
  selection,
}: EllipsesLayerProps) {
  return (
    <>
      {ellipses.map((ellipse) => (
        <Ellipse
          key={ellipse.id}
          {...getEllipseProps(ellipse)}
          stroke={selection.selectedShapeId === ellipse.id ? '#f59e0b' : '#1f2937'}
          strokeWidth={selection.selectedShapeId === ellipse.id ? 3 : 2}
          draggable={selection.canInteractWithShape(ellipse.id)}
          onPointerDown={(event) => {
            if (activeTool !== 'select') {
              return
            }

            event.cancelBubble = true
            selection.selectShape(ellipse.id)
          }}
          onDragEnd={(event) => {
            selection.moveEllipse(
              ellipse.id,
              event.target.x() - ellipse.width / 2,
              event.target.y() - ellipse.height / 2,
            )
          }}
        />
      ))}
      {previewEllipse ? (
        <Ellipse
          {...getEllipseProps(previewEllipse)}
          stroke="#2563eb"
          strokeWidth={2}
          dash={[6, 4]}
        />
      ) : null}
    </>
  )
}
