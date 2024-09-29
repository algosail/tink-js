import { t_vec2 } from './vec2.ts'
import type { FPSInfo } from './loop.ts'

export interface Size {
  type: 'size'
  width: number
  height: number
  resize(width: number, height: number): void
  resizeTo(width: number, height: number, time?: number): void
  update(fpsInfo: FPSInfo): void
}

export const t_size = (width: number, height: number): Size => {
  const vec2 = t_vec2(width, height)

  return {
    type: 'size',
    resize: vec2.change,
    resizeTo: vec2.changeTo,
    update: vec2.update,
    get width() {
      return vec2.x
    },
    get height() {
      return vec2.y
    },
  }
}
