import { t_vec2 } from './vec2.ts'

export interface Pos {
  type: 'pos'
  x: number
  y: number
  move(x: number, y: number): void
  moveTo(x: number, y: number, time?: number): void
  update(fpsInterval: number): void
}

export const t_pos = (x: number, y: number): Pos => {
  const vec2 = t_vec2(x, y)

  return {
    type: 'pos',
    move: vec2.change,
    moveTo: vec2.changeTo,
    update: vec2.update,
    get x() {
      return vec2.x
    },
    get y() {
      return vec2.y
    },
  }
}
