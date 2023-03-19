import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client'
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import QueueLink from 'apollo-link-queue'
import SerializingLink from 'apollo-link-serialize'
import Cookies from 'js-cookie'

//!the process.env gets replaced by precompiler
const httpLink = new HttpLink({ uri: `https://process.env.SERVER_URL/graphql` })
const retryLink = new RetryLink({ attempts: { max: Infinity } })

const authLink = setContext(({ headers }) => {
  const token = Cookies.get('token')

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.statusCode === 401) {
    Cookies.remove('token')
    window.location.replace('/login')
  }
})

const queueLink = new QueueLink()

window.addEventListener('offline', () => queueLink.close())
window.addEventListener('online', () => queueLink.open())

const serializingLink = new SerializingLink()

const trackerLink = new ApolloLink((operation, forward) => {
  if (forward === undefined) return null

  const context = operation.getContext()
  const trackedQueries =
    JSON.parse(window.localStorage.getItem('trackedQueries') || null) || []

  if (context.tracked) {
    const { operationName, query, variables } = operation

    const newTrackedQuery = {
      query,
      context,
      variables,
      operationName,
    }

    window.localStorage.setItem(
      'trackedQueries',
      JSON.stringify([...trackedQueries, newTrackedQuery])
    )
  }

  return forward(operation).map((data) => {
    if (context.tracked) {
      window.localStorage.setItem(
        'trackedQueries',
        JSON.stringify(trackedQueries)
      )
    }

    return data
  })
})

const link = ApolloLink.from([
  trackerLink,
  queueLink,
  serializingLink,
  retryLink,
  errorLink,
  authLink,
  httpLink,
])

const cache = new InMemoryCache()

const persistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})

const currentVersion = window.localStorage.getItem(
  'process.env.SCHEMA_VERSION_KEY'
)

const client = new ApolloClient({
  link,
  cache,
})

const execute = async () => {
  const trackedQueries =
    JSON.parse(window.localStorage.getItem('trackedQueries') || null) || []

  const promises = trackedQueries.map(
    ({ variables, query, context, operationName }) =>
      client.mutate({
        context,
        variables,
        mutation: query,
        // update: updateFunctions[operationName],
        // optimisticResponse: context.optimisticResponse,
      })
  )

  try {
    await Promise.all(promises)
  } catch (error) {
    // A good place to show notification
  }

  window.localStorage.setItem('trackedQueries', [])
}

execute()

export default client

export const initPersistor = async () => {
  if (currentVersion === 'process.env.SCHEMA_VERSION') {
    await persistor.restore()
  } else {
    await persistor.purge()
    window.localStorage.setItem(
      'process.env.SCHEMA_VERSION_KEY',
      'process.env.SCHEMA_VERSION'
    )
  }
}
