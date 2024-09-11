import { t_grid } from './grid.ts'
import { t_size } from './size.ts'
import { t_pos } from './pos.ts'
import { t_print } from './print.ts'
import { keyEvents } from './keyboard.ts'
import type { Grid } from './grid.ts'
import type { Size } from './size.ts'
import type { Pos } from './pos.ts'
import type { Border } from './border.ts'
import type { Layer } from './layer.ts'
import type { KeyEvent } from './keyboard.ts'

export interface Scene {
  type: 'scene'
  name: string
  size: Size
  pos: Pos
  grid: Grid
  update(fpsInterval: number): void
  print(): string
}

type Component = Layer | Pos | Size | Border | KeyEvent

export const t_scene = (
  name: string,
  ...components: Component[]
): Scene => {
  const layers: Layer[] = []
  const keyboard = keyEvents()
  let size: Size = t_size(16, 9)
  let pos: Pos = t_pos(0, 0)
  let border: Border | null = null

  for (const it of components) {
    if (it.type === 'size') size = it
    if (it.type === 'pos') pos = it
    if (it.type === 'border') border = it
    if (it.type === 'layer') layers.push(it)
    if (it.type === 'key_event') keyboard.add(it)
  }

  const getSceneGrid = () => {
    const grid = t_grid([], size.width, size.height)
    for (const it of layers) grid.add(it.grid, 0, 0)
    if (border) grid.add(border.getGrid(size.width, size.height), 0, 0)
    return grid
  }

  const update = (fpsInterval: number) => {
    size.update(fpsInterval)
    pos.update(fpsInterval)
    for (const it of layers) it.update(fpsInterval)
  }

  const print = () => {
    return t_print(getSceneGrid(), { width: size.width, height: size.height })
  }

  return {
    type: 'scene',
    name,
    size,
    pos,
    update,
    print,
    get grid() {
      return getSceneGrid()
    },
  }
}
