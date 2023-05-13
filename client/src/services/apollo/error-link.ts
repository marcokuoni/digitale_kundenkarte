import { ApolloClient, ApolloLink, fromPromise } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { navigate } from 'svelte-routing'
import gql from 'graphql-tag'

import { PATHS, PROCESS_ENV } from '../../lib/const'
import cache from './cache'
import httpLink from './http-link'
import authLink from './auth-link'
import { purge } from './persistor'

const RefreshDoc = gql`
  mutation refresh {
    refresh
  }
`

let isRefreshing = false
let pendingRequests: (() => void)[] = []

const setIsRefreshing = (value: boolean) => {
  isRefreshing = value
}

const addPendingRequest = (pendingRequest: () => void) => {
  pendingRequests.push(pendingRequest)
}

const link = ApolloLink.from([authLink, httpLink])
const refreshTokenApiClient = new ApolloClient({
  link,
  cache,
})

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback())
  pendingRequests = []
}

const getNewToken = async () => {
  await refreshTokenApiClient.mutate({
    mutation: RefreshDoc,
  })
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          if (!isRefreshing && localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)) {
            setIsRefreshing(true)

            return fromPromise(
              getNewToken().catch(async () => {
                resolvePendingRequests()
                setIsRefreshing(false)

                localStorage.removeItem(PROCESS_ENV.JWT_COOKIE_NAME)
                await purge()
                refreshTokenApiClient.resetStore()

                if (window.location.pathname.indexOf(PATHS.LOGIN_USER) < 0 &&
                window.location.pathname.indexOf(PATHS.RESET_PASSWORD) < 0 && 
                window.location.pathname.indexOf(PATHS.FORGOT_PASSWORD) < 0) {
                  navigate(`/${PATHS.LOGIN_USER}`)
                }

                return forward(operation)
              })
            ).flatMap(() => {
              resolvePendingRequests()
              setIsRefreshing(false)

              return forward(operation)
            })
          } else {
            return fromPromise(
              new Promise((resolve) => {
                addPendingRequest(() => resolve(true))
              })
            ).flatMap(() => {
              return forward(operation)
            })
          }
      }
    }
  }
})

export default errorLink
