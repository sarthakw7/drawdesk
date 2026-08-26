import { Check, FilePlus, FolderOpen, Save } from 'lucide-react'

type ToolbarProps = {
  fileDisplayName: string
  onNewDrawing: () => void
  onOpenDrawing: () => void
  onSaveDrawing: () => void
  saveStatusText: string | null
}

export function Toolbar({
  fileDisplayName,
  onNewDrawing,
  onOpenDrawing,
  onSaveDrawing,
  saveStatusText,
}: ToolbarProps) {
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 34,
    padding: '0 12px',
    borderRadius: 4,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#1f2937',
    cursor: 'pointer',
  }
  const iconProps = {
    size: 16,
    strokeWidth: 2,
  }
  const isSaved = saveStatusText === 'Saved'
  const isSaving = saveStatusText === 'Saving...'
  const isError = saveStatusText === 'Save failed'

  return (
    <div
      role="toolbar"
      aria-label="Application"
      style={{
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        gap: 8,
        padding: 8,
        borderBottom: '1px solid #e5e7eb',
        background: '#ffffff',
      }}
    >
      <strong
        style={{
          marginRight: 8,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        DrawDesk
      </strong>
      <span
        style={{
          marginRight: 8,
          color: '#6b7280',
          fontSize: 13,
        }}
      >
        {fileDisplayName}
      </span>
      <button
        type="button"
        onClick={onNewDrawing}
        style={buttonStyle}
      >
        <FilePlus {...iconProps} aria-hidden="true" />
        New
      </button>
      <button
        type="button"
        onClick={onOpenDrawing}
        style={buttonStyle}
      >
        <FolderOpen {...iconProps} aria-hidden="true" />
        Open
      </button>
      <button
        type="button"
        onClick={onSaveDrawing}
        style={buttonStyle}
      >
        <Save {...iconProps} aria-hidden="true" />
        Save
      </button>
      <div style={{ flex: 1 }} />
      <span
        aria-live="polite"
        style={{
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          color: isError ? '#b91c1c' : isSaved ? '#07885f' : '#6b7280',
          minWidth: 104,
          fontSize: isSaving ? 12 : 13,
        }}
      >
        {isSaved ? (
          <Check {...iconProps} aria-hidden="true" />
        ) : null}
        {saveStatusText}
      </span>
    </div>
  )
}
