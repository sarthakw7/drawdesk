import { availableTools, type ToolId } from '../tools/drawingTools'

type ToolbarProps = {
  activeTool: ToolId
  onSelectTool: (tool: ToolId) => void
}

export function Toolbar({ activeTool, onSelectTool }: ToolbarProps) {
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
