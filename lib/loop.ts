export interface Loop {
  type: 'loop'
  fps: number
  start(update: Update): void
}

export type Update = (fpsInterval: number) => void

export const t_loop = (targetFPS: number): Loop => {
  // Time
  const timeSpeed: number = 1
  let gameTime = new Date('July 1, 1996, 08:00:00')
  let chronometer = Date.now()

  const evalTimeElapsed = () => {
    const timeElapsed = Date.now() - chronometer
    chronometer += timeElapsed
    gameTime = new Date(gameTime.getTime() + timeElapsed * timeSpeed)
    return timeElapsed * timeSpeed
  }

  // Loop
  let totalElapsed = 0
  let totalFrames = 0
  let framesPerSecond = 0
  let elapsedPerSecond = 0
  let fpsInterval: number
  let currentFPS: number = 0

  const loop = (update: Update) => {
    requestAnimationFrame(() => loop(update))

    const timeElapsed = evalTimeElapsed()
    totalElapsed += timeElapsed
    elapsedPerSecond += timeElapsed

    if (totalElapsed / totalFrames >= fpsInterval) {
      update(fpsInterval)
      totalFrames++
      framesPerSecond++
    }

    if (elapsedPerSecond > 1000) {
      currentFPS = framesPerSecond
      console.log(`FPS:: ${currentFPS}`)
      elapsedPerSecond = 0
      framesPerSecond = 0
    }
  }

  const start = (update: Update) => {
    fpsInterval = Math.floor(1000 / targetFPS)
    loop(update)
  }

  return {
    type: 'loop',
    start,
    get fps() {
      return currentFPS
    },
  }
}
