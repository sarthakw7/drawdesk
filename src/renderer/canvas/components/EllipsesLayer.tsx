import { Ellipse } from 'react-konva'
import type { EllipseShape } from '../../../domain/shapes'
import type { EllipseGeometry } from '../geometry/ellipses'

type EllipsesLayerProps = {
  ellipses: EllipseShape[]
  previewEllipse: EllipseGeometry | null
}

const getEllipseProps = (ellipse: EllipseGeometry) => ({
  x: ellipse.x + ellipse.width / 2,
  y: ellipse.y + ellipse.height / 2,
  radiusX: ellipse.width / 2,
  radiusY: ellipse.height / 2,
})

export function EllipsesLayer({ ellipses, previewEllipse }: EllipsesLayerProps) {
  return (
    <>
      {ellipses.map((ellipse) => (
        <Ellipse
          key={ellipse.id}
          {...getEllipseProps(ellipse)}
          stroke="#1f2937"
          strokeWidth={2}
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
