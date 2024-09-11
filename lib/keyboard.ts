export interface KeyEvent {
  type: 'key_event'
  key: string
  event: 'down' | 'up' | 'press'
  cb: EventFn
}

type EventFn = () => void

interface Events {
  down: Record<string, EventFn[]>
  up: Record<string, EventFn[]>
  press: Record<string, EventFn[]>
}

export const t_onKeyDown = (key: string, cb: () => void): KeyEvent => {
  return {
    type: 'key_event',
    event: 'down',
    key,
    cb,
  }
}

export const t_onKeyUp = (key: string, cb: () => void): KeyEvent => {
  return {
    type: 'key_event',
    event: 'up',
    key,
    cb,
  }
}

export const t_onKeyPress = (key: string, cb: () => void): KeyEvent => {
  return {
    type: 'key_event',
    event: 'press',
    key,
    cb,
  }
}

export const keyEvents = () => {
  const events: Events = { down: {}, up: {}, press: {} }

  const add = ({ event, key, cb }: KeyEvent) => {
    if (events[event][key]) return events[event][key].push(cb)
    events[event][key] = [cb]
  }

  const keydown = (e: KeyboardEvent) => {
    if (!events.down[e.key]) return
    for (const fn of events.down[e.key]) {
      fn()
    }
  }

  const keyup = (e: KeyboardEvent) => {
    if (!events.up[e.key]) return
    for (const fn of events.up[e.key]) {
      fn()
    }
  }

  const keypress = (e: KeyboardEvent) => {
    if (!events.press[e.key]) return
    for (const fn of events.press[e.key]) {
      fn()
    }
  }

  const clear = () => {
    document.removeEventListener('keydown', keydown)
    document.removeEventListener('keyup', keyup)
    document.removeEventListener('keypress', keypress)
  }

  document.addEventListener('keydown', keydown)
  document.addEventListener('keyup', keyup)
  document.addEventListener('keypress', keypress)

  return { add, clear }
}
