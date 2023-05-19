import { writable } from 'svelte/store'
import type { GetCurrentUserQuery, User } from '../codegen'
import { AsyncgetCurrentUser } from '../codegen'
import { ERROR_POLICY, FETCH_POLICY, KIND, PROCESS_ENV, PRODUCTION } from '../lib/const'
import alerts from './alerts'

function currentUser() {
  const { subscribe, set } = writable<User>(null)
  const production = PROCESS_ENV.NODE_ENV.toString() === PRODUCTION

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)
      if (token) {
        const { data } = await AsyncgetCurrentUser({
          fetchPolicy: FETCH_POLICY.CACHE_FIRST,
        })

        _checkUserData(data)
        _fetchCurrentUserOverNetwork()
      }
    } catch (e) {
      alerts.addAlert(
        KIND.NEGATIVE,
        'Es konnten keine Benutzerdaten geladen werden. Melde dich ab und erneut an'
      )
      !production && console.error(e)
    }
  }

  const _fetchCurrentUserOverNetwork = async () => {
    const { data } = await AsyncgetCurrentUser({
      fetchPolicy: FETCH_POLICY.NETWORK_ONLY,
      errorPolicy: ERROR_POLICY.IGNORE,
    })
    _checkUserData(data)
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
