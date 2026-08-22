export type ToolId = 'select' | 'rectangle' | 'ellipse' | 'line' | 'text' | 'pan'

export type DrawingTool = {
  id: ToolId
  label: string
}

export const defaultTool: ToolId = 'rectangle'

export const availableTools: DrawingTool[] = [
  {
    id: 'select',
    label: 'Select',
  },
  {
    id: 'rectangle',
    label: 'Rectangle',
  },
  {
    id: 'ellipse',
    label: 'Ellipse',
  },
  {
    id: 'line',
    label: 'Line',
  },
  {
    id: 'text',
    label: 'Text',
  },
]
