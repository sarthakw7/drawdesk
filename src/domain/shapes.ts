export type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'text'

interface BaseShape {
  id: string
  type: ShapeType
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle'
  x: number
  y: number
  width: number
  height: number
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse'
  x: number
  y: number
  width: number
  height: number
}

export interface LineShape extends BaseShape {
  type: 'line'
  startX: number
  startY: number
  endX: number
  endY: number
}

export interface TextShape extends BaseShape {
  type: 'text'
  x: number
  y: number
  text: string
}

export type Shape =
  | RectangleShape
  | EllipseShape
  | LineShape
  | TextShape