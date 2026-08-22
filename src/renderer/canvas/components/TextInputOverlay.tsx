import { useEffect, useRef } from 'react'
import type { DraftText } from '../hooks/useTextDrawing'
import type { Viewport } from '../viewport/coordinates'
import { worldToScreen } from '../viewport/coordinates'

type TextInputOverlayProps = {
  draftText: DraftText | null
  viewport: Viewport
  onChange: (text: string) => void
  onCommit: () => void
  onCancel: () => void
}

export function TextInputOverlay({
  draftText,
  viewport,
  onChange,
  onCommit,
  onCancel,
}: TextInputOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [draftText])

  if (!draftText) {
    return null
  }

  const screenPosition = worldToScreen(draftText, viewport)

  return (
    <input
      ref={inputRef}
      value={draftText.text}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onCommit()
        }

        if (event.key === 'Escape') {
          event.preventDefault()
          onCancel()
        }
      }}
      style={{
        position: 'absolute',
        left: screenPosition.x,
        top: screenPosition.y,
        boxSizing: 'border-box',
        minWidth: 120,
        padding: '2px 4px',
        border: '1px solid #2563eb',
        font: '16px sans-serif',
        outline: 'none',
      }}
    />
  )
}
