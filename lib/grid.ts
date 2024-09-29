export type Cell = [string, number, number] // [glyph, x, y]

export interface Grid {
  type: 'grid'
  width: number
  height: number
  list(): Cell[]
  fill(background?: string): void
  add(grid: Grid, x: number, y: number): void
}

export const t_grid = (data: Cell[], width: number, height: number): Grid => {
  const cells: Map<number, Cell> = new Map()

  const valid = (x: number, y: number): boolean => {
    if (x >= width || x < 0 || y >= height || y < 0) {
      return false
    }
    return true
  }

  const index = (x: number, y: number) => Math.floor(y) * width + Math.floor(x)

  for (const it of data) {
    if (!valid(it[1], it[2])) continue
    cells.set(index(it[1], it[2]), it)
  }

  const list = () => Array.from(cells.values())

  const add = (grid: Grid, x: number, y: number) => {
    for (const cell of grid.list()) {
      const $x = cell[1] + x
      const $y = cell[2] + y

      if (!valid($x, $y)) continue

      cells.set(index($x, $y), [cell[0], $x, $y])
    }
  }

  const fill = (background = ' ') => {
    for (let i = 0; i < width * height; i++) {
      if (cells.has(i)) continue
      const x = i % width
      const y = Math.floor(i / width)
      cells.set(i, [background, x, y])
    }
  }

  return {
    type: 'grid',
    get width(): number {
      return width
    },
    get height(): number {
      return height
    },
    list,
    add,
    fill,
  }
}
