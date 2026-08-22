import { Text } from 'react-konva'
import type { TextShape } from '../../../domain/shapes'

type TextsLayerProps = {
  texts: TextShape[]
}

export function TextsLayer({ texts }: TextsLayerProps) {
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
        />
      ))}
    </>
  )
}
