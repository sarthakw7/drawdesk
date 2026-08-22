import { availableTools, type ToolId } from '../tools/drawingTools'

type ToolbarProps = {
  activeTool: ToolId
  onSelectTool: (tool: ToolId) => void
  onNewDrawing: () => void
  onOpenDrawing: () => void
  onSaveDrawing: () => void
  saveStatusText: string | null
}

export function Toolbar({
  activeTool,
  onSelectTool,
  onNewDrawing,
  onOpenDrawing,
  onSaveDrawing,
  saveStatusText,
}: ToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Drawing tools"
      style={{
        display: 'flex',
        flexShrink: 0,
        gap: 8,
        padding: 8,
      }}
    >
      <button
        type="button"
        onClick={onNewDrawing}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        New
      </button>
      <button
        type="button"
        onClick={onOpenDrawing}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        Open
      </button>
      <button
        type="button"
        onClick={onSaveDrawing}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          background: '#fff',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
      {saveStatusText ? (
        <span
          aria-live="polite"
          style={{
            alignSelf: 'center',
            color: saveStatusText === 'Save failed' ? '#b91c1c' : '#374151',
            minWidth: 76,
          }}
        >
          {saveStatusText}
        </span>
      ) : null}
      {availableTools.map((tool) => {
        const isActive = activeTool === tool.id

        return (
          <button
            key={tool.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectTool(tool.id)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: isActive ? '2px solid #2c9' : '1px solid #ccc',
              background: isActive ? '#efe' : '#fff',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {tool.label}
          </button>
        )
      })}
    </div>
  )
}
