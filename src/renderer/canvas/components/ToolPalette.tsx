import { Fragment, useState } from 'react'
import {
  Circle,
  Hand,
  MousePointer2,
  Slash,
  Square,
  Type,
  type LucideIcon,
} from 'lucide-react'
import { availableTools, type ToolId } from '../../tools/drawingTools'

type ToolPaletteProps = {
  activeTool: ToolId
  onSelectTool: (tool: ToolId) => void
}

const toolIcons: Record<ToolId, LucideIcon> = {
  select: MousePointer2,
  pan: Hand,
  rectangle: Square,
  ellipse: Circle,
  line: Slash,
  text: Type,
}

const iconSize = 16
const iconStrokeWidth = 2

export function ToolPalette({ activeTool, onSelectTool }: ToolPaletteProps) {
  const [tooltipTool, setTooltipTool] = useState<ToolId | null>(null)
  const tooltipToolData = availableTools.find((tool) => tool.id === tooltipTool) ?? null
  const tooltipLabel = tooltipToolData
    ? `${tooltipToolData.label} · ${tooltipToolData.shortcut}`
    : null

  return (
    <div
      role="toolbar"
      aria-label="Drawing tools"
      style={{
        position: 'absolute',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 4,
        background: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: 4,
        boxShadow: '0 1px 4px rgb(0 0 0 / 0.12)',
        cursor: 'default',
      }}
    >
      {availableTools.map((tool, index) => {
        const isActive = activeTool === tool.id
        const ToolIcon = toolIcons[tool.id]

        return (
          <Fragment key={tool.id}>
            {index === 2 ? (
              <span
                aria-hidden="true"
                style={{
                  width: 1,
                  height: 22,
                  background: '#d1d5db',
                  margin: '0 3px',
                }}
              />
            ) : null}
            <button
              type="button"
              aria-label={tool.label}
              aria-pressed={isActive}
              onBlur={() => setTooltipTool(null)}
              onFocus={() => setTooltipTool(tool.id)}
              onClick={() => onSelectTool(tool.id)}
              onMouseEnter={() => setTooltipTool(tool.id)}
              onMouseLeave={() => setTooltipTool(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                padding: 0,
                borderRadius: 4,
                border: isActive ? '2px solid #2c9' : '1px solid #d1d5db',
                background: isActive ? '#efe' : '#fff',
                color: isActive ? '#07885f' : '#374151',
                cursor: 'pointer',
              }}
            >
              <ToolIcon size={iconSize} strokeWidth={iconStrokeWidth} aria-hidden="true" />
            </button>
          </Fragment>
        )
      })}
      {tooltipLabel ? (
        <div
          role="presentation"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '3px 7px',
            borderRadius: 4,
            background: '#1f2937',
            color: '#ffffff',
            fontSize: 11,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 1px 3px rgb(0 0 0 / 0.14)',
          }}
        >
          {tooltipLabel}
        </div>
      ) : null}
    </div>
  )
}
