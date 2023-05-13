import { ApolloClient, ApolloLink } from '@apollo/client'

import OfflineLink from "./offline-link";
import cache from "./cache";
import httpLink from "./http-link";
import errorLink from './error-link';
import authLink from './auth-link';

const offlineLink = new OfflineLink();

const link = ApolloLink.from([
  //NOTE deactivate local storage cache
  offlineLink,
  /// NOTE deactivate local storage cache
  errorLink,
  authLink,
  httpLink,
])



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
    },
  },
})

export default client
