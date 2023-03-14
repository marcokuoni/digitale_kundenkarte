import {
    ApolloClient,
    InMemoryCache,
  } from '@apollo/client';

  //!the process.env gets replaced by precompiler
  export default new ApolloClient({
    uri: `http://process.env.SERVER_URL/graphql`,  
    cache: new InMemoryCache(),  
  });