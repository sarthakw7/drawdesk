export type ShapeSelection = {
  selectedShapeId: string | null
  selectShape: (shapeId: string) => void
  clearSelection: () => void
  canInteractWithShape: (shapeId: string) => boolean
  moveRectangle: (shapeId: string, x: number, y: number) => void
  moveEllipse: (shapeId: string, x: number, y: number) => void
  moveText: (shapeId: string, x: number, y: number) => void
}
