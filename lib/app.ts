import { t_grid } from './grid.ts'
import type { Text } from './text.ts'
import type { Screen } from './screen.ts'
import type { FPSInfo, Loop } from './loop.ts'
import type { Scene } from './scene.ts'

export interface App {
  use(component: Component): void
  start(): void
}

type Component = Screen | Loop | Scene | Text

export const t_app = (...components: Component[]): App => {
  let screen: Screen | null = null
  let loop: Loop | null = null
  const items: Record<string, Scene | Text> = {}

  const use = (component: Component) => {
    if (component.type === 'screen') screen = component
    if (component.type === 'loop') loop = component
    if (component.type === 'scene') items[component.name] = component
    if (component.type === 'text') items[component.name] = component
  }

  for (const it of components) use(it)

  const update = (info: FPSInfo) => {
    if (!screen) throw new Error('A screen component is required')
    const grid = t_grid([], screen.width, screen.height)

    for (const item of Object.values(items)) {
      item.update(info)
      grid.add(item.grid, item.pos.x, item.pos.y)
    }

    screen.render(grid)
  }

  const start = () => {
    if (!screen) throw new Error('A screen component is required')
    if (!loop) throw new Error('A loop component is required')
    loop.start(update)
  }

  return { use, start }
}
