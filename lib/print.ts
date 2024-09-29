import type { Grid } from './grid.ts'

interface ViewBox {
  width: number
  height: number
  x: number
  y: number
}

export const t_print = (
  grid: Grid,
  viewBox: Partial<ViewBox> = {},
  fill: string = ' ',
): string => {
  const v = {
    x: 0,
    y: 0,
    width: grid.width,
    height: grid.height,
    ...viewBox,
  }

  const content: string[] = []

  const valid = (x: number, y: number): boolean => {
    if (x < v.x || x >= v.x + v.width || y < v.y || y >= v.y + v.height) {
      return false
    }
    return true
  }

  const index = (x: number, y: number) =>
    Math.floor(y) * v.width + Math.floor(x)

  const set = (s: string, x: number, y: number) => {
    if (!valid(x, y)) return
    content[index(x, y)] = s
  }

  for (const cell of grid.list()) {
    set(...cell)
  }

  let str = ''

  for (let i = 0; i < v.width * v.height; i++) {
    str += (i && Number.isInteger(i / v.width) ? '\n' : '') +
      (content[i] ?? fill)
  }

  return str
}
