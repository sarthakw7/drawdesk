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
        gap: 8,
        padding: 8,
      }}
    >
      {availableTools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          aria-pressed={activeTool === tool.id}
          onClick={() => onSelectTool(tool.id)}
        >
          {tool.label}
        </button>
      ))}
    </div>
  )
}
