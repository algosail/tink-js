export interface ScreenOptions {
  width: number
  height: number
  el?: HTMLElement
}

export interface Screen {
  addScene(name: string): void
}

const defaultOptions: ScreenOptions = {
  width: 320,
  height: 300,
}

export const screen = (opt: ScreenOptions = defaultOptions) => {
  const screen = document.createElement('pre')
  const background = opt.el ?? document.body
  background.appendChild(screen)
}
