export interface State<D extends StateData = StateData> {
  type: 'state'
  data: D
  addEvent(name: string, listener: StateListener<D>): void
  emit(name: string, ...args: (string | number)[]): void
}

export type StateData = Record<string, string | number>
export type StateListener<D extends StateData> = (
  prev: D,
  ...args: (number | string)[]
) => D

export const t_state = <D extends StateData>(initData: D): State<D> => {
  const events: Record<string, StateListener<D>> = {}
  let data = { ...initData }

  const addEvent = (name: string, listener: StateListener<D>) => {
    events[name] = listener
  }

  const emit = (name: string, ...args: (string | number)[]) => {
    if (!events[name]) return
    data = events[name](data, ...args)
  }

  return { type: 'state', data, addEvent, emit }
}
