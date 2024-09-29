import { t_frame } from './frame.ts'
import { t_print } from './print.ts'
import type { Grid } from './grid.ts'
import type { Sprite } from './sprite.ts'
import type { Frame } from './frame.ts'
import type { FPSInfo, UpdateEvent } from './loop.ts'

/**
 * @module
 * This module contains {@link t_anim} method to create an animation component
 *
 * @example
 * ```ts
 * import { t_anim } from '@algosail/tink/mod.ts'
 *
 * const idleAnimation = t_anim('idle', 1, idleFrame1, idleFrame1)
 * ```
 */

/** Inteface of an animation component */
export interface Anim {
  /** The field defining this object as a component of an animation */
  type: 'anim'
  /** Unique animation name */
  name: string
  /** Text grid of current frame of this animation */
  grid: Grid
  /** Add new {@link AnimComponents} to this animation */
  use(component: AnimComponents): void
  /** Run this method every global frame for update component state */
  update(fpsInfo: FPSInfo): void
  /** Get text of current animation state */
  print(): string
}

/**
 * The types of components that can be added to an animation:
 *
 * string - create a frame from text data with default length (1 tick)
 * {@link Sprite} - create a frame from this sprite with default length (1 tick)
 * {@link Frame} - add this frame to animation
 * {@link UpdateEvent} - Listener of every global frame
 */
type AnimComponents = Sprite | Frame | string | UpdateEvent

/**
 * Create an animation component.
 *
 * @param name Unique animation name
 * @param speed Time for which all animation frames are played in milliseconds
 * @param components {@link AnimComponents} Initial components for this animation
 * @returns The {@link Anim} component
 */
export const t_anim = (
  name: string,
  speed: number,
  ...components: AnimComponents[]
): Anim => {
  /** All frames of this animations */
  const frames: Frame[] = []
  /** Sum of ticks */
  let ticks = 0
  /** One tick length in milliseconds */
  let tickLength = speed / ticks
  /** Index of current frame */
  let currentFrameIdx = 0
  /** Time elapsed since the last frame change. */
  let passedTime = 0
  /** Listener of every global frame */
  let onUpdate: UpdateEvent | null = null

  /** Add new {@link AnimComponents} to this animation */
  const use = (component: AnimComponents) => {
    if (typeof component === 'string' || component.type === 'sprite') {
      const frame = t_frame(component)
      ticks += frame.duration
      frames.push(frame)
    } else if (component.type === 'frame') {
      ticks += component.duration
      frames.push(component)
    } else if (component.type === 'update_event') {
      onUpdate = component
    }
  }

  for (const it of components) use(it)

  tickLength = speed / ticks

  /**
   * Get text grid of current frame
   *
   * @returns {@link Grid} component
   */
  const getCurrentGrid = (): Grid => frames[currentFrameIdx]!.grid

  /**
   * Get text of current animation state
   *
   * @returns string
   */
  const print = () => t_print(getCurrentGrid())

  /**
   * Run this method every global frame for update component state
   *
   * @param fpsInfo {@link FPSInfo} Information about FPS state
   */
  const update = (fpsInfo: FPSInfo) => {
    if (onUpdate) onUpdate.cb(fpsInfo)

    passedTime += fpsInfo.interval
    if (passedTime < frames[currentFrameIdx].duration * tickLength) return

    passedTime = 0

    if (currentFrameIdx + 1 === frames.length) {
      currentFrameIdx = 0
    } else {
      currentFrameIdx += 1
    }
  }

  return {
    type: 'anim',
    name,
    use,
    update,
    print,
    get grid(): Grid {
      return getCurrentGrid()
    },
  }
}
