import type { ToolId } from '../tools/drawingTools'

export const getCanvasCursor = (activeTool: ToolId, isPanning: boolean) => {
  if (activeTool === 'pan') {
    return isPanning ? 'grabbing' : 'grab'
  }

  if (activeTool === 'text') {
    return 'text'
  }

  if (activeTool === 'rectangle' || activeTool === 'ellipse' || activeTool === 'line') {
    return 'crosshair'
  }

  return 'default'
}
