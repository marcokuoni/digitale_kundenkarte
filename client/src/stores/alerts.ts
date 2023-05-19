import { writable } from 'svelte/store'
import type { KIND } from '../lib/const'

function alerts() {
  const { subscribe, set } = writable<
    Map<
      number,
      {
        kind: KIND
        message: string
      }
    >
  >(new Map())
  const alertMap = new Map<
    number,
    {
      kind: KIND
      message: string
    }
  >()

  const addAlert = (kind: KIND, message: string) => {
    alertMap.set(Date.now(), { kind, message })
    set(alertMap)
  }

  const removeAlert = (id: number) => {
    alertMap.delete(id)
    set(alertMap)
  }

  return {
    subscribe,
    addAlert,
    removeAlert,
  }
}

export default alerts()
