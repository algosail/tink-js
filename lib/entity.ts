import { t_pos } from './pos.ts'
import { t_state } from './state.ts'
import { t_sprite } from './sprite.ts'
import { t_print } from './print.ts'
import type { Grid } from './grid.ts'
import type { Pos } from './pos.ts'
import type { State } from './state.ts'
import type { Anim } from './anim.ts'
import type { Sprite } from './sprite.ts'

export interface Entity {
  type: 'entity'
  name: string
  pos: Pos
  grid: Grid
  startAnim(name: string): void
  update(fpsInterval: number): void
  print(): string
}

type EntityComponent = Pos | State | Anim | Sprite

export const t_entity = (
  name: string,
  ...components: EntityComponent[]
): Entity => {
  const animations: Record<string, Anim> = {}
  let state = t_state({})
  let pos = t_pos(0, 0)
  let sprite: Sprite = t_sprite()
  let currentAnim: string | null = null

  for (const it of components) {
    if (it.type === 'pos') pos = it
    if (it.type === 'state') state = it
    if (it.type === 'sprite') {
      sprite = it
      currentAnim = null
    }
    if (it.type === 'anim') {
      animations[it.name] = it
      if (!sprite && !currentAnim) currentAnim = it.name
    }
  }

  const startAnim = (name: string) => {
    currentAnim = name
  }

  const getCurrentView = () => {
    if (!currentAnim) return sprite
    return animations[currentAnim]
  }

  const update = (fpsInterval: number) => {
    const view = getCurrentView()
    if (view.type === 'anim') view.update(fpsInterval)
    pos.update(fpsInterval)
  }

  const getCurrentGrid = () => getCurrentView().grid

  const print = () => t_print(getCurrentGrid())

  return {
    type: 'entity',
    name,
    pos,
    startAnim,
    update,
    print,
    get grid(): Grid {
      return getCurrentGrid()
    },
  }
}
