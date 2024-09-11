import { t_print } from './print.ts'
import type { Grid } from './grid.ts'

export interface Screen {
  type: 'screen'
  width: number
  height: number
  render(grid: Grid): void
}

export const t_htmlScreen = (
  el: Element,
  width: number,
  height: number,
  background: string = ' ',
): Screen => {
  const render = (grid: Grid) => {
    el.innerHTML = t_print(grid, { width, height }, background)
  }

  return { type: 'screen', width, height, render }
}
