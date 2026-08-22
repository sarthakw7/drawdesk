import { useEffect, useRef } from 'react'
import type { DraftText } from '../hooks/useTextDrawing'

type TextInputOverlayProps = {
  draftText: DraftText | null
  onChange: (text: string) => void
  onCommit: () => void
  onCancel: () => void
}

export function TextInputOverlay({
  draftText,
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
        left: draftText.x,
        top: draftText.y,
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
