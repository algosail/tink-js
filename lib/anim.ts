import { t_frame } from './frame.ts'
import { t_print } from './print.ts'
import type { Grid } from './grid.ts'
import type { Sprite } from './sprite.ts'
import type { Frame } from './frame.ts'

export interface Anim {
  type: 'anim'
  name: string
  grid: Grid
  width: number
  height: number
  update(fpsInterval: number): void
  print(): string
}

type Component = Sprite | Frame

export const t_anim = (
  name: string,
  speed: number,
  ...components: Component[]
): Anim => {
  const frames: Frame[] = []
  let width = 0
  let height = 0
  let ticks = 0
  let tickLength = speed / ticks

  let currentFrameIdx = 0
  let totalElapsed = 0

  for (const it of components) {
    const frame = typeof it === 'string' || it.type === 'sprite'
      ? t_frame(it)
      : it

    ticks += frame.duration
    width = Math.max(width, frame.grid.width)
    height = Math.max(height, frame.grid.height)
    frames.push(frame)
  }

  tickLength = speed / ticks

  const getCurrentGrid = (): Grid => frames[currentFrameIdx]!.grid

  const print = () => t_print(getCurrentGrid(), { width, height })

  const update = (fpsInterval: number) => {
    totalElapsed += fpsInterval
    if (totalElapsed < frames[currentFrameIdx].duration * tickLength) return

    totalElapsed = 0

    if (currentFrameIdx + 1 === frames.length) {
      currentFrameIdx = 0
    } else {
      currentFrameIdx += 1
    }
  }

  return {
    type: 'anim',
    name,
    get width(): number {
      return width
    },
    get height(): number {
      return height
    },
    update,
    print,
    get grid(): Grid {
      return getCurrentGrid()
    },
  }
}
