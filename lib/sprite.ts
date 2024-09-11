import { t_grid } from './grid.ts'
import { t_print } from './print.ts'
import type { Cell, Grid } from './grid.ts'

export interface Sprite {
  type: 'sprite'
  grid: Grid
  print(): string
}

interface ParseRes {
  cells: Cell[]
  width: number
  height: number
}

const parseData = (data: string, back = ' '): [Cell[], number, number] => {
  const cells: Cell[] = []
  let width: number = 0

  const rows = data.split('\n')

  rows.forEach((row, y) => {
    row.split('').forEach((s, x) => {
      if (s === back) return
      width = Math.max(width, x + 1)
      cells.push([s, x, y])
    })
  })

  return [cells, width, rows.length]
}

export const t_sprite = (data: string = '', back = ' '): Sprite => {
  const grid = t_grid(...parseData(data, back))

  const print = () => t_print(grid)

  return {
    type: 'sprite',
    grid,
    print,
  }
}
