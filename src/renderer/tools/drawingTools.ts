export type ToolId = 'select' | 'rectangle' | 'ellipse' | 'line' | 'text' | 'pan'

export type DrawingTool = {
  id: ToolId
  label: string
  shortcut: string
}

export const defaultTool: ToolId = 'rectangle'

export const availableTools: DrawingTool[] = [
  {
    id: 'select',
    label: 'Select',
    shortcut: 'V',
  },
  {
    id: 'pan',
    label: 'Pan',
    shortcut: 'H',
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
    shortcut: 'R',
  },
  {
    id: 'ellipse',
    label: 'Ellipse',
    shortcut: 'E',
  },
  {
    id: 'line',
    label: 'Line',
    shortcut: 'L',
  },
  {
    id: 'text',
    label: 'Text',
    shortcut: 'T',
  },
]
