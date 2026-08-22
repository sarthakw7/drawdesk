type ZoomControlsProps = {
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut }: ZoomControlsProps) {
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
      <button type="button" onClick={onZoomOut}>
        -
      </button>
      <span style={{ minWidth: 44, textAlign: 'center' }}>
        {Math.round(zoom * 100)}%
      </span>
      <button type="button" onClick={onZoomIn}>
        +
      </button>
    </div>
  )
}
