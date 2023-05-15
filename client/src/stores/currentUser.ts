import { writable } from 'svelte/store'
import type { GetCurrentUserQuery, User } from '../codegen'
import { AsyncgetCurrentUser } from '../codegen'
import { ERROR_POLICY, FETCH_POLICY, PROCESS_ENV } from '../lib/const'

const clientPingIntervall = parseInt(
  PROCESS_ENV.CLIENT_PING_INTERVAL || '5000'
)

function currentUser() {
  const { subscribe, set } = writable<User>(null)
  let timer = null

  const fetchCurrentUser = async () => {
    try {
      const { data } = await AsyncgetCurrentUser({
        fetchPolicy: FETCH_POLICY.CACHE_FIRST,
      })

      _checkUserData(data)
      _loadUserInfinity()
    } catch (e) {
      //ignore error
      // after login no token is set yet, so we need to fetch the user data
    }
  }

  const fetchCurrentUserOverNetwork = async () => {
    try {
      const token = localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)
      if (token) {
        const { data } = await AsyncgetCurrentUser({
          fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
          errorPolicy: ERROR_POLICY.IGNORE,
        })
        _checkUserData(data)
      } else {
        clearTimeout(timer)
      }
    } catch (e) {
      //ignore error
      // after login no token is set yet, so we need to fetch the user data
    }
  }


  const _loadUserInfinity = async () => {
    try {
      const reloadUser = async () => {
        if (timer) {
          clearTimeout(timer)
        }
        await fetchCurrentUserOverNetwork()
        timer = setTimeout(async () => {
          await fetchCurrentUserOverNetwork()
          await reloadUser()
        }, clientPingIntervall)
      }
      if (!timer) {
        await reloadUser()
      }
    } catch (e) {
      console.error(e.message)
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
