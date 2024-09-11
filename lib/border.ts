import { t_grid } from './grid.ts'
import type { Cell, Grid } from './grid.ts'

export interface Border {
  type: 'border'
  changeStyle(type: BorderType | BorderType[], rounded?: boolean): void
  getGrid(width: number, height: number): Grid
}

export enum BorderType {
  Regular = 'regular',
  Bold = 'bold',
  Double = 'double',
  Dashed = 'dashed',
  DashedBold = 'dashedBold',
}

const getTopType = (type: BorderType | BorderType[]): BorderType => {
  if (!Array.isArray(type)) return type
  return type[0]
}

const getRightType = (type: BorderType | BorderType[]): BorderType => {
  if (!Array.isArray(type)) return type
  if (type[1]) return type[1]
  return type[0]
}

const getBottomType = (type: BorderType | BorderType[]): BorderType => {
  if (!Array.isArray(type)) return type
  if (type[2]) return type[2]
  return type[0]
}

const getLeftType = (type: BorderType | BorderType[]): BorderType => {
  if (!Array.isArray(type)) return type
  if (type[3]) return type[3]
  if (type[1]) return type[1]
  return type[0]
}

const getLeftTop = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '╭'

  const left = getLeftType(type)
  const top = getTopType(type)

  if (left === BorderType.Regular || left === BorderType.Dashed) {
    if (top === BorderType.Regular || top === BorderType.Dashed) return '┌'
    if (top === BorderType.Bold || top === BorderType.DashedBold) return '┍'
    return '╒'
  }

  if (left === BorderType.Bold || left === BorderType.DashedBold) {
    if (top === BorderType.Regular || top === BorderType.Dashed) return '┎'
    if (top === BorderType.Bold || top === BorderType.DashedBold) return '┏'
    return '╔'
  }

  if (top === BorderType.Regular || top === BorderType.Dashed) return '╓'
  return '╔'
}

const getRightTop = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '╮'

  const right = getRightType(type)
  const top = getTopType(type)

  if (right === BorderType.Regular || right === BorderType.Dashed) {
    if (top === BorderType.Regular || top === BorderType.Dashed) return '┐'
    if (top === BorderType.Bold || top === BorderType.DashedBold) return '┑'
    return '╕'
  }

  if (right === BorderType.Bold || right === BorderType.DashedBold) {
    if (top === BorderType.Regular || top === BorderType.Dashed) return '┒'
    if (top === BorderType.Bold || top === BorderType.DashedBold) return '┓'
    return '╗'
  }

  if (top === BorderType.Regular || top === BorderType.Dashed) return '╖'
  return '╗'
}

const getRightBottom = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '╯'

  const right = getRightType(type)
  const bottom = getBottomType(type)

  if (right === BorderType.Regular || right === BorderType.Dashed) {
    if (bottom === BorderType.Regular || bottom === BorderType.Dashed) {
      return '┘'
    }
    if (bottom === BorderType.Bold || bottom === BorderType.DashedBold) {
      return '┙'
    }
    return '╛'
  }

  if (right === BorderType.Bold || right === BorderType.DashedBold) {
    if (bottom === BorderType.Regular || bottom === BorderType.Dashed) {
      return '┚'
    }
    if (bottom === BorderType.Bold || bottom === BorderType.DashedBold) {
      return '┛'
    }
    return '╝'
  }

  if (bottom === BorderType.Regular || bottom === BorderType.Dashed) return '╜'
  return '╝'
}

const getLeftBottom = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '╰'

  const left = getLeftType(type)
  const bottom = getBottomType(type)

  if (left === BorderType.Regular || left === BorderType.Dashed) {
    if (bottom === BorderType.Regular || bottom === BorderType.Dashed) {
      return '└'
    }
    if (bottom === BorderType.Bold || bottom === BorderType.DashedBold) {
      return '┕'
    }
    return '╘'
  }

  if (left === BorderType.Bold || left === BorderType.DashedBold) {
    if (bottom === BorderType.Regular || bottom === BorderType.Dashed) {
      return '┖'
    }
    if (bottom === BorderType.Bold || bottom === BorderType.DashedBold) {
      return '┗'
    }
    return '╚'
  }

  if (bottom === BorderType.Regular || bottom === BorderType.Dashed) return '╙'
  return '╚'
}

const getTop = (type: BorderType | BorderType[], rounded: boolean = false) => {
  if (rounded) return '─'
  const top = getTopType(type)
  if (top === BorderType.Regular) return '─'
  if (top === BorderType.Bold) return '━'
  if (top === BorderType.Dashed) return '┄'
  if (top === BorderType.DashedBold) return '┅'
  return '═'
}

const getBottom = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '─'
  const bottom = getBottomType(type)
  if (bottom === BorderType.Regular) return '─'
  if (bottom === BorderType.Bold) return '━'
  if (bottom === BorderType.Dashed) return '┄'
  if (bottom === BorderType.DashedBold) return '┅'
  return '═'
}

const getRight = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
) => {
  if (rounded) return '│'
  const right = getRightType(type)
  if (right === BorderType.Regular) return '│'
  if (right === BorderType.Bold) return '┃'
  if (right === BorderType.Dashed) return '┆'
  if (right === BorderType.DashedBold) return '┇'
  return '║'
}

const getLeft = (type: BorderType | BorderType[], rounded: boolean = false) => {
  if (rounded) return '│'
  const left = getLeftType(type)
  if (left === BorderType.Regular) return '│'
  if (left === BorderType.Bold) return '┃'
  if (left === BorderType.Dashed) return '┆'
  if (left === BorderType.DashedBold) return '┇'
  return '║'
}

export const t_border = (
  type: BorderType | BorderType[],
  rounded: boolean = false,
): Border => {
  let grid: Grid | null = null

  let leftTop = getLeftTop(type, rounded)
  let rightTop = getRightTop(type, rounded)
  let rightBottom = getRightBottom(type, rounded)
  let leftBottom = getLeftBottom(type, rounded)
  let top = getTop(type, rounded)
  let right = getRight(type, rounded)
  let bottom = getBottom(type, rounded)
  let left = getLeft(type, rounded)

  const changeStyle = (
    type: BorderType | BorderType[],
    rounded: boolean = false,
  ) => {
    leftTop = getLeftTop(type, rounded)
    rightTop = getRightTop(type, rounded)
    rightBottom = getRightBottom(type, rounded)
    leftBottom = getLeftBottom(type, rounded)
    top = getTop(type, rounded)
    right = getRight(type, rounded)
    bottom = getBottom(type, rounded)
    left = getLeft(type, rounded)
  }

  const getGrid = (width: number, height: number): Grid => {
    if (grid && grid.width === width && grid.height === height) {
      return grid
    }

    const cells: Cell[] = []
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (x === 0 && y === 0) cells.push([leftTop, x, y])
        else if (x === 0 && y === height - 1) cells.push([leftBottom, x, y])
        else if (x === width - 1 && y === height - 1) {
          cells.push([rightBottom, x, y])
        } else if (x === width - 1 && y === 0) cells.push([rightTop, x, y])
        else if (y === 0) cells.push([top, x, y])
        else if (y === height - 1) cells.push([bottom, x, y])
        else if (x === 0) cells.push([left, x, y])
        else if (x === width - 1) cells.push([right, x, y])
      }
    }

    grid = t_grid(cells, width, height)
    return grid
  }

  return {
    type: 'border',
    getGrid,
    changeStyle,
  }
}
