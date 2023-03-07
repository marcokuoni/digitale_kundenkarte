import { loadGraphQlSchema } from './loader.js'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

export const startupServer = async function () {
  const { resolvers, typeDefs } = await loadGraphQlSchema()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.SERVER_PORT || '3003') },
  })

  console.log(`🚀  Server ready at: ${url}`)
}
