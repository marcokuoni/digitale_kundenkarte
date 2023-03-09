import { loadGraphQlSchema } from './loader'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import { json } from 'body-parser'
import cors from 'cors'

export const startupServer = async function () {
  const { resolvers, typeDefs } = await loadGraphQlSchema()
  const app = express()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()

  app.use(
    '/graphql',

    cors<cors.CorsRequest>({
      origin: [
        'https://client.localhost',
      ],
    }),

    json(),
    expressMiddleware(server)
  )

  await new Promise<void>((resolve) =>
    httpServer.listen(
      { port: parseInt(process.env.SERVER_PORT || '3003') },
      resolve
    )
  )
  console.log(`🚀 Server ready at http://localhost:3003/graphql`)

  app.get('/health', (req, res) => {
    res.status(200).send('Okay!');  
  });
}
