import { t_sprite } from './sprite.ts'
import { t_print } from './print.ts'
import type { Sprite } from './sprite.ts'
import type { Grid } from './grid.ts'

export interface Frame {
  type: 'frame'
  grid: Grid
  duration: number
  print(): string
}

export const t_frame = (
  data: string | Sprite,
  duration: number = 1,
  back = ' ',
): Frame => {
  const sprite = typeof data === 'string' ? t_sprite(data, back) : data

  const print = () => t_print(sprite.grid)

  return {
    type: 'frame',
    grid: sprite.grid,
    duration,
    print,
  }
}
