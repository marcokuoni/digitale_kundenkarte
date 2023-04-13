import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client'
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import OfflineLink from "./lib/OfflineLink";
import Cookies from 'js-cookie'

//!the process.env gets replaced by precompiler
const httpLink = new HttpLink({ uri: `https://process.env.SERVER_URL/graphql` })

const authLink = setContext(() => {
  const token = Cookies.get('token')

  return {
    headers: {
      Authorization: token ? token : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors}) => {
  // if (graphQLErrors) {
  //   for (const err of graphQLErrors) {
  //     switch (err.extensions.code) {
  //       case "UNAUTHENTICATED":
  //         Cookies.remove('token')
  //         window.location.replace('/login')
  //     }
  //   }
  // }
});

const offlineLink = new OfflineLink();

const link = ApolloLink.from([
  //NOTE deactivate local storage cache
  offlineLink,
  /// NOTE deactivate local storage cache
  errorLink,
  authLink,
  httpLink,
])

const cache = new InMemoryCache()

//NOTE deactivate local storage cache
const persistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
})
// /NOTE deactivate local storage cache

const currentVersion = window.localStorage.getItem(
  'process.env.SCHEMA_VERSION_KEY'
)

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all"
    }
  }
})

export default client

export const initPersistor = async () => {
  //NOTE deactivate local storage cache
  if (currentVersion === 'process.env.SCHEMA_VERSION') {
    await persistor.restore()
  } else {
    await persistor.purge()
    window.localStorage.setItem(
      'process.env.SCHEMA_VERSION_KEY',
      'process.env.SCHEMA_VERSION'
    )
  }
  // /NOTE deactivate local storage cache
}
