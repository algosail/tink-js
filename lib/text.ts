import { t_pos } from './pos.ts'
import { t_print } from './print.ts'
import { t_grid } from './grid.ts'
import type { Pos } from './pos.ts'
import type { Size } from './size.ts'
import type { Border } from './border.ts'
import type { Cell, Grid } from './grid.ts'
import type { FPSInfo, UpdateEvent } from './loop.ts'

export interface Text {
  type: 'text'
  name: string
  pos: Pos
  grid: Grid
  set(value: string): void
  update(info: FPSInfo): void
  print(): string
}

type Component = Pos | Size | Border | UpdateEvent

interface CellConstruct {
  cells: Cell[]
  column: number
  row: number
  width: number
  height: number
}

const getMaxWidth = (size: Size | null, border: Border | null) => {
  if (!size) return null
  if (border) return size.width - 1
  return size.width
}

const getTextGrid = (
  value: string,
  size: Size | null,
  border: Border | null,
): Grid => {
  const params: CellConstruct = {
    cells: [],
    row: border ? 1 : 0,
    column: border ? 1 : 0,
    width: border ? 1 : 0,
    height: border ? 1 : 0,
  }

  const maxWidth = getMaxWidth(size, border)

  for (const row of value.split('\n')) {
    if (size && size.height < (border ? params.row : params.row)) continue
    params.column = border ? 1 : 0
    params.width = size?.width ??
      Math.max(params.width, border ? row.length + 5 : row.length + 1)

    for (const word of row.split(' ')) {
      if (maxWidth && word.length + params.column > maxWidth) {
        params.row++
        params.column = border ? 1 : 0
      }

      for (const s of word.split('')) {
        params.cells.push([s, params.column, params.row])
        params.column++
      }

      params.cells.push([' ', params.column, params.row])
      params.column++
    }

    params.row++
  }

  if (border) params.row++

  const grid = t_grid(params.cells, params.width, params.row)
  grid.fill()
  if (border) grid.add(border.getGrid(params.width, params.row), 0, 0)
  return grid
}

export const t_text = (
  name: string,
  value: string,
  ...components: Component[]
): Text => {
  let pos: Pos = t_pos(0, 0)
  let fixedSize: Size | null = null
  let border: Border | null = null
  let onUpdate: UpdateEvent | null = null

  for (const it of components) {
    if (it.type === 'pos') pos = it
    if (it.type === 'size') fixedSize = it
    if (it.type === 'border') border = it
    if (it.type === 'update_event') onUpdate = it
  }

  let grid: Grid = getTextGrid(value, fixedSize, border)

  const set = (value: string) => {
    grid = getTextGrid(value, fixedSize, border)
  }

  const update = (info: FPSInfo) => {
    if (onUpdate) onUpdate.cb(info)
  }

  const print = () => t_print(grid)

  return {
    type: 'text',
    name,
    pos,
    set,
    update,
    print,
    get grid() {
      return grid
    },
  }
}
