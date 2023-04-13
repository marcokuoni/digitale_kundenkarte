import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import type { IncomingMessage, ServerResponse } from 'http'

import { loadGraphQlSchema } from './loader'
import type { JwtUserPayloadInterface } from './services/auth'
import { verifyTokenAndGetUser } from './services/auth'
import { ACCESS_CONTROL_ALLOW_ORIGIN, ACCESS_CONTROL_EXPOSE_HEADERS, AUTHORIZATION } from './lib/const'

export type ServerContext = MyContext & {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
}

interface MyContext {
  user?: JwtUserPayloadInterface
}

export const startupServer = async function () {
  const { resolvers, typeDefs } = await loadGraphQlSchema()
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({
            graphRef: 'Karte@current',
            footer: false,
          })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  })
  const { url } = await startStandaloneServer(server, {
    context: async ({ req, res }) => {
      const user = verifyTokenAndGetUser(req, res)

      res.setHeader(
        ACCESS_CONTROL_ALLOW_ORIGIN,
        process.env.CLIENT_URL || 'https://karte.localhost'
      )
      res.setHeader(ACCESS_CONTROL_EXPOSE_HEADERS, AUTHORIZATION)

      return {
        user,
        req,
        res,
      }
    },
    listen: { port: parseInt(process.env.SERVER_PORT || '3003') },
  })
  console.log(`🚀  Server ready at ${url}`)
}
