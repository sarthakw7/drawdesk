import { Rect } from 'react-konva'
import type { RectangleShape } from '../../../domain/shapes'
import type { RectangleGeometry } from '../geometry/rectangles'

type RectanglesLayerProps = {
  rectangles: RectangleShape[]
  previewRectangle: RectangleGeometry | null
}

export function RectanglesLayer({ rectangles, previewRectangle }: RectanglesLayerProps) {
  return (
    <>
      {rectangles.map((rectangle) => (
        <Rect
          key={rectangle.id}
          x={rectangle.x}
          y={rectangle.y}
          width={rectangle.width}
          height={rectangle.height}
          stroke="#1f2937"
          strokeWidth={2}
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
