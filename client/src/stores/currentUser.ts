import { writable } from 'svelte/store'
import type { Exact, GetCurrentUserQuery, User } from '../codegen'
import { AsyncgetCurrentUser, getCurrentUser } from '../codegen'
import type { ApolloQueryResult, ObservableQuery } from '@apollo/client'

const clientPingIntervall = parseInt(
  'process.env.CLIENT_PING_INTERVAL' || '5000'
)

function currentUser() {
  const { subscribe, set } = writable<User>(null)
  let timer = null

  const fetchCurrentUser = async () => {
    try {
      const { data } = await AsyncgetCurrentUser({
        fetchPolicy: 'cache-first',
      })

      _checkUserData(data)
      _loadUserInfinity()
    } catch (e) {
      //ignore error
      // after login no token is set yet, so we need to fetch the user data
    }
  }

  const _loadUserInfinity = () => {
    try {
      const reloadUser = () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(async () => {
          try {
            const token = localStorage.getItem('process.env.JWT_COOKIE_NAME')
            if (token) {
              const { data } = await AsyncgetCurrentUser({
                fetchPolicy: 'network-only',
                errorPolicy: 'ignore',
              })
              _checkUserData(data)
            } else {
              clearTimeout(timer)
            }
          } catch (e) {
            //ignore error
            // after login no token is set yet, so we need to fetch the user data
          }
          reloadUser()
        }, clientPingIntervall)
      }
      if (!timer) {
        reloadUser()
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
