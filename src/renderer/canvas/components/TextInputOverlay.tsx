import { useEffect, useLayoutEffect, useRef } from 'react'
import type { DraftText } from '../hooks/useTextDrawing'
import type { Viewport } from '../viewport/coordinates'
import { worldToScreen } from '../viewport/coordinates'

type TextInputOverlayProps = {
  draftText: DraftText | null
  viewport: Viewport
  canvasWidth: number
  onChange: (text: string) => void
  onCommit: () => void
  onCancel: () => void
}

export function TextInputOverlay({
  draftText,
  viewport,
  canvasWidth,
  onChange,
  onCommit,
  onCancel,
}: TextInputOverlayProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    inputRef.current?.focus({
      preventScroll: true,
    })
  }, [draftText])

  useEffect(() => {
    if (!draftText) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && inputRef.current?.contains(event.target)) {
        return
      }

      onCommit()
    }

    document.addEventListener('pointerdown', handlePointerDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
    }
  }, [draftText, onCommit])

  if (!draftText) {
    return null
  }

  const screenPosition = worldToScreen(draftText, viewport)
  const availableWidth = Math.max(0, canvasWidth - screenPosition.x)

  return (
    <input
      ref={inputRef}
      data-drawdesk-text-input="true"
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
        width: 120,
        maxWidth: availableWidth,
        padding: '0 1px 1px',
        border: 0,
        borderBottom: '1px solid rgb(31 41 55 / 0.35)',
        background: 'transparent',
        color: '#1f2937',
        font: '16px sans-serif',
        lineHeight: 1,
        outline: 'none',
      }}
    />
  )
}
