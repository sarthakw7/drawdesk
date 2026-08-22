import { Line } from 'react-konva'
import type { LineShape } from '../../../domain/shapes'
import type { LineGeometry } from '../geometry/lines'

type LinesLayerProps = {
  lines: LineShape[]
  previewLine: LineGeometry | null
}

const getLinePoints = (line: LineGeometry) => [
  line.startX,
  line.startY,
  line.endX,
  line.endY,
]

export function LinesLayer({ lines, previewLine }: LinesLayerProps) {
  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={getLinePoints(line)}
          stroke="#1f2937"
          strokeWidth={2}
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
