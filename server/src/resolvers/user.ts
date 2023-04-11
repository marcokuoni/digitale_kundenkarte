import User from '../models/user'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { signIn, signUp, refresh, logout } from '../services/auth'
import type { ServerContext } from '../server'

export const usersResolvers = {
  Date: new GraphQLScalarType<Date | null, number>({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value as string) // value from the client
    },
    serialize(value) {
      return (value as Date).getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    },
  }),
  Query: {
    async getUsers() {
      return User.find()
    },
  },
  Mutation: {
    async addUser(
      root: never,
      {
        name,
        email,
        newsletter,
      }: {
        name: string
        email: string
        newsletter: boolean
      }
    ) {
      return await User.create({
        name,
        email,
        newsletter,
      })
    },
    async signIn(
      root: never,
      {
        transferCode,
        password,
      }: {
        transferCode: string
        password: string
      },
      context: ServerContext
    ) {
      await signIn(context.req, context.res, transferCode, password)
      return true
    },
    async signUp(root: never, {password}: {password?: string}, context: ServerContext) {
      await signUp(context.req, context.res, password)
      return true
    },
    async refresh(root: never, args: never, context: ServerContext) {
      await refresh(context.req, context.res)
      return true
    },
    async logout(root: never, args: never, context: ServerContext) {
      await logout(context.req, context.res)
      return true
    },
  },
}
