import { ApolloServer } from '@apollo/server'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'

import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express'
import http from 'http'
import { json } from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { loadGraphQlSchema } from './loader'
import { verifyTokenAndGetUser } from './services/auth'
import { ACCESS_CONTROL_EXPOSE_HEADERS, AUTHORIZATION } from './lib/const'
import type { KarteContext } from './server_types'
import trackRequestCountIpBlock from './services/trackRequestCountIpBlock'

export const startupServer = async function () {
  const { resolvers, typeDefs } = await loadGraphQlSchema()
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer<KarteContext>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: 'Karte@current',
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  })

  await server.start()

  app.use(cookieParser())

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: [process.env.CLIENT_URL || 'https://karte.localhost'],
      credentials: true,
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const user = await verifyTokenAndGetUser(req, res)
        await trackRequestCountIpBlock(req.socket.remoteAddress || '0.0.0.0', !!user)

        res.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS, AUTHORIZATION)

        return {
          user,
          req,
          res,
        }
      },
    })
  )

  await new Promise<void>((resolve) =>
    httpServer.listen(
      { port: parseInt(process.env.SERVER_PORT || '3003') },
      resolve
    )
  )

  console.log(`🚀 Server ready at http://localhost:${process.env.SERVER_PORT || '3003'}/graphql`);
}
