import { writable } from 'svelte/store'
import type { Exact, GetCurrentUserQuery, User } from '../codegen'
import { getCurrentUser } from '../codegen'
import type { ApolloQueryResult, ObservableQuery } from '@apollo/client'

// create a writable store with an initial value of null
export const currentUser = writable<User>(null)
export const currentUserLoading = writable<boolean>(false)
export const currentUserError = writable<string>('')

export const fetchCurrentUser = async () => {
  const token = localStorage.getItem('process.env.JWT_COOKIE_NAME')
  if (token) {
    currentUserLoading.set(true)
    try {
      const query = getCurrentUser({
        fetchPolicy: 'cache-first',
      })

      query.subscribe((data) => {
        _checkUserData(data)
      })
    } catch (e) {
      console.error(e)
      currentUserError.set(e)
      currentUserLoading.set(false)
    }
  } else {
    // after login no token is set yet, so we need to fetch the user data
    try {
      const query = await getCurrentUser({
        fetchPolicy: 'network-only',
      })
      await query.subscribe((data) => {
        _checkUserData(data)
      })
    } catch (e) {
      console.error(e.message)
    }
  }
}

const _checkUserData = (
  data: ApolloQueryResult<GetCurrentUserQuery> & {
    query: ObservableQuery<
      GetCurrentUserQuery,
      Exact<{
        [key: string]: never
      }>
    >
  }
) => {
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
}
