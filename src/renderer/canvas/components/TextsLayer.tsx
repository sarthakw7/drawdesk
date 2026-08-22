import { Text } from 'react-konva'
import type { TextShape } from '../../../domain/shapes'
import type { ToolId } from '../../tools/drawingTools'
import type { ShapeSelection } from '../selection'

type TextsLayerProps = {
  texts: TextShape[]
  activeTool: ToolId
  selection: ShapeSelection
}

export function TextsLayer({ texts, activeTool, selection }: TextsLayerProps) {
  return (
    <>
      {texts.map((text) => (
        <Text
          key={text.id}
          x={text.x}
          y={text.y}
          text={text.text}
          fill="#1f2937"
          fontFamily="sans-serif"
          fontSize={16}
          stroke={selection.selectedShapeId === text.id ? '#f59e0b' : undefined}
          strokeWidth={selection.selectedShapeId === text.id ? 1 : 0}
          draggable={selection.canInteractWithShape(text.id)}
          onPointerDown={(event) => {
            if (activeTool !== 'select') {
              return
            }

            event.cancelBubble = true
            selection.selectShape(text.id)
          }}
          onDragEnd={(event) => {
            selection.moveText(text.id, event.target.x(), event.target.y())
          }}
        />
      ))}
    </>
  )
}
