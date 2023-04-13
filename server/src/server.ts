import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'

import { loadGraphQlSchema } from './loader'
import type { JwtUserPayloadInterface } from './services/auth'
import { verifyTokenAndGetUser } from './services/auth'
import type { IncomingMessage, ServerResponse } from 'http'

export type ServerContext = MyContext & {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
}

interface MyContext {
  user?: JwtUserPayloadInterface
}

const OPTIONS = 'OPTIONS'
const ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin'

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
