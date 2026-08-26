import { Minus, Plus } from 'lucide-react'

type ZoomControlsProps = {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut }: ZoomControlsProps) {
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    padding: 0,
    borderRadius: 4,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    cursor: 'pointer',
  }
  const iconProps = {
    size: 16,
    strokeWidth: 2,
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 12,
        bottom: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 6,
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: 4,
        boxShadow: '0 1px 4px rgb(0 0 0 / 0.12)',
        cursor: 'default',
      }}
    >
      <button
        type="button"
        aria-label="Zoom out"
        title="Zoom out"
        onClick={onZoomOut}
        style={buttonStyle}
      >
        <Minus {...iconProps} aria-hidden="true" />
      </button>
      <span style={{ minWidth: 44, textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        aria-label="Zoom in"
        title="Zoom in"
        onClick={onZoomIn}
        style={buttonStyle}
      >
        <Plus {...iconProps} aria-hidden="true" />
      </button>
    </div>
  )
}
