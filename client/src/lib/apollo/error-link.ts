import { ApolloClient, ApolloLink, fromPromise } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { navigate } from 'svelte-routing'
import gql from 'graphql-tag'

import { PATHS } from '../const'
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
          if (!isRefreshing) {
            setIsRefreshing(true)

            return fromPromise(
              getNewToken().catch(async () => {
                resolvePendingRequests()
                setIsRefreshing(false)

                localStorage.removeItem('process.env.JWT_COOKIE_NAME')
                await purge()
                refreshTokenApiClient.resetStore()

                //TODO: i dont think navigate will work, we need here a stronger tool like - window.location.replace(`/${PATHS.LOGIN_USER}`) ;)
                navigate(`/${PATHS.LOGIN_USER}`)

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
