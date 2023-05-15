import { writable } from 'svelte/store'
import type { GetCurrentUserQuery, User } from '../codegen'
import { AsyncgetCurrentUser } from '../codegen'
import { ERROR_POLICY, FETCH_POLICY, PROCESS_ENV } from '../lib/const'

function currentUser() {
  const { subscribe, set } = writable<User>(null)

  const fetchCurrentUser = async () => {
    try {
      const { data } = await AsyncgetCurrentUser({
        fetchPolicy: FETCH_POLICY.CACHE_FIRST,
      })

      _checkUserData(data)
      _fetchCurrentUserOverNetwork()
    } catch (e) {
      //ignore error
      // after login no token is set yet, so we need to fetch the user data
    }
  }

  const _fetchCurrentUserOverNetwork = async () => {
    try {
      const token = localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)
      if (token) {
        const { data } = await AsyncgetCurrentUser({
          fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
          errorPolicy: ERROR_POLICY.IGNORE,
        })
        _checkUserData(data)
      }
    } catch (e) {
      //ignore error
      // after login no token is set yet, so we need to fetch the user data
    }
  }

  const _checkUserData = (data: GetCurrentUserQuery) => {
    if (data?.getCurrentUser) {
      set(data.getCurrentUser as User)
    }
  }

  return {
    subscribe,
    fetchCurrentUser,
    reset: () => set(null),
    set,
  }
}

export default currentUser()
