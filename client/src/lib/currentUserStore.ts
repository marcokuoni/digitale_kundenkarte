import { writable } from 'svelte/store'
import type { User } from '../codegen'
import { getCurrentUser } from '../codegen'

// create a writable store with an initial value of null
export const currentUser = writable<User>(null)
export const currentUserLoading = writable<boolean>(false)
export const currentUserError = writable<string>('')

export const fetchCurrentUser = () => {
  currentUserLoading.set(true)
  console.log('%ccurrentUserStore.ts line:12 object', 'color: #007acc;', 11)
  const query = getCurrentUser(
    {
      fetchPolicy: 'cache-first',
    }
  )

  query.subscribe((data) => {
    if (data.error) {
      console.log('error', data.error)
      currentUserError.set(data.error.message)
      currentUserLoading.set(false)
    }
    if (data.loading) {
      console.log('loading...')
    } else {
      if (data.data.getCurrentUser) {
        currentUser.set(data.data.getCurrentUser)
      }
      currentUserLoading.set(false)
    }
  })
}
