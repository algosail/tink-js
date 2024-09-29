import type { FPSInfo } from './loop.ts'

interface Vec2 {
  type: 'vec2'
  x: number
  y: number
  change(x: number, y: number): void
  changeTo(x: number, y: number, time?: number): void
  update(fpsInfo: FPSInfo): void
}

interface Param {
  x: number
  y: number
}

export const t_vec2 = (x: number, y: number): Vec2 => {
  const current: Param = { x, y }
  const escaped: Param = { x: 0, y: 0 }
  let vel: Param = { x: 0, y: 0 }
  let target: Param | null = null

  // Points per second
  const change = (x: number, y: number) => {
    target = null
    vel = {
      x: x === 0 ? 0 : Math.floor(1000 / x),
      y: y === 0 ? 0 : Math.floor(1000 / y),
    }
  }

  const changeTo = (x: number, y: number, time: number = 0) => {
    if (time === 0) {
      current.x = x
      current.y = y
      return
    }

    target = { x, y }
    vel = {
      x: (time * 1000) / (target.x - current.x),
      y: (time * 1000) / (target.y - current.y),
    }
  }

  const updateVec = (vec: 'x' | 'y', fpsInterval: number) => {
    if (vel[vec] === 0) return
    escaped[vec] += fpsInterval
    if (escaped[vec] < Math.abs(vel[vec])) return

    escaped[vec] = 0
    if (vel[vec] > 0) {
      current[vec]++
    } else {
      current[vec]--
    }

    if (target && target[vec] === current[vec]) vel[vec] = 0
  }

  const update = ({ interval }: FPSInfo) => {
    updateVec('x', interval)
    updateVec('y', interval)
  }

  return {
    type: 'vec2',
    change,
    changeTo,
    update,
    get x() {
      return current.x
    },
    get y() {
      return current.y
    },
  }
}
