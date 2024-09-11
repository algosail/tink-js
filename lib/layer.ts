import { t_size } from './size.ts'
import { t_grid } from './grid.ts'
import { t_print } from './print.ts'
import type { Size } from './size.ts'
import type { Grid } from './grid.ts'
import type { Entity } from './entity.ts'

export interface Layer {
  type: 'layer'
  level: number
  grid: Grid
  setLevel(level: number): void
  update(fpsInterval: number): void
  print(): string
}

type Component = Size | Entity

export const t_layer = (...components: Component[]): Layer => {
  let level = 0
  const entities: Record<string, Entity> = {}
  let size: Size = t_size(16, 9)

  for (const it of components) {
    if (it.type === 'size') size = it
    if (it.type === 'entity') entities[it.name] = it
  }

  const setLevel = (value: number) => level = value

  const getLayerGrid = () => {
    const grid = t_grid([], size.width, size.height)
    for (const it of Object.values(entities)) {
      grid.add(it.grid, it.pos.x, it.pos.y)
    }
    return grid
  }

  const update = (fpsInterval: number) => {
    for (const it of Object.values(entities)) {
      it.update(fpsInterval)
    }
  }

  const print = () => t_print(getLayerGrid())

  return {
    type: 'layer',
    get level() {
      return level
    },
    setLevel,
    update,
    print,
    get grid(): Grid {
      return getLayerGrid()
    },
  }
}
