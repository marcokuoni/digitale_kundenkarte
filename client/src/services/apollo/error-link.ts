import { ApolloClient, ApolloLink, fromPromise } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { navigate } from 'svelte-routing'
import gql from 'graphql-tag'

import { CODES, PATHS, PROCESS_ENV } from '../../lib/const'
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

const _setIsRefreshing = (value: boolean) => {
  isRefreshing = value
}

const _addPendingRequest = (pendingRequest: () => void) => {
  pendingRequests.push(pendingRequest)
}

const link = ApolloLink.from([authLink, httpLink])
const refreshTokenApiClient = new ApolloClient({
  link,
  cache,
})

const _resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback())
  pendingRequests = []
}

const _getNewToken = async () => {
  await refreshTokenApiClient.mutate({
    mutation: RefreshDoc,
  })
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const e of graphQLErrors) {
      switch (e.extensions.code) {
        case CODES.UNAUTHENTICATED:
          if (!isRefreshing && localStorage.getItem(PROCESS_ENV.JWT_COOKIE_NAME)) {
            _setIsRefreshing(true)

            return fromPromise(
              _getNewToken().catch(async () => {
                _resolvePendingRequests()
                _setIsRefreshing(false)

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
              _resolvePendingRequests()
              _setIsRefreshing(false)

              return forward(operation)
            })
          } else {
            return fromPromise(
              new Promise((resolve) => {
                _addPendingRequest(() => resolve(true))
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
