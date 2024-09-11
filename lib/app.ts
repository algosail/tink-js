import { t_grid } from './grid.ts'
import type { Screen } from './screen.ts'
import type { Loop } from './loop.ts'
import type { Scene } from './scene.ts'

export interface App {
  use(component: Component): void
  start(): void
}

type Component = Screen | Loop | Scene

export const t_app = (...components: Component[]): App => {
  const scenes: Record<string, Scene> = {}
  let screen: Screen | null = null
  let loop: Loop | null = null

  const use = (component: Component) => {
    if (component.type === 'screen') screen = component
    if (component.type === 'loop') loop = component
    if (component.type === 'scene') scenes[component.name] = component
  }

  for (const it of components) use(it)

  const update = (fpsInterval: number) => {
    if (!screen) throw new Error('A screen component is required')
    const grid = t_grid([], screen.width, screen.height)

    for (const scene of Object.values(scenes)) {
      scene.update(fpsInterval)
      grid.add(scene.grid, scene.pos.x, scene.pos.y)
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
