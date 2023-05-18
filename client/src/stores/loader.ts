import { writable } from 'svelte/store'

function loader() {
  const { subscribe, set } = writable<boolean>(false)
  const loaderSet = new Set<string>()

  const setLoader = (id: string, value: boolean) => {
    if(value) {
      loaderSet.add(id)
    } else {
      loaderSet.delete(id)
    }
    set(loaderSet.size > 0)
  }

  const resetLoader = () => {
    loaderSet.clear()
    set(false)
  }

  return {
    subscribe,
    setLoader,
    resetLoader
  }
}

export default loader()
