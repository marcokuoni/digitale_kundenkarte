import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloLink,
  } from '@apollo/client';
  // import { getOperationAST } from 'graphql';
  
  // const cache = new InMemoryCache({
  //   addTypename: true,
  // });
  
  // const httpLink = new HttpLink({
  //   uri: 'https://server.localhost:5001/graphql/',
  // });
  
  // const link = ApolloLink.split(
  //   (op: any) => {
  //     // check if it is a subscription
  //     const operationAST = getOperationAST(op.query, op.operationName);
  //     return !!operationAST && operationAST.operation === 'subscription';
  //   },
  //   httpLink
  // );
  
  // export default new ApolloClient({
  //   cache,
  //   link,
  //   connectToDevTools: true,
  // });

  export default new ApolloClient({

    uri: 'https://server.localhost:5001/graphql',
  
    cache: new InMemoryCache(),
  
  });