import User from '../models/user'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { signIn, signUp, refresh, signOut } from '../services/auth'
import type { ServerContext } from '../server'

export interface iNewUser {
  name?: string
  email?: string
  newsletter: boolean
  password?: string
}

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
    async signUp(root: never, newUser: iNewUser, context: ServerContext) {
      await signUp(context.req, context.res, newUser)
      return true
    },
    async refresh(root: never, args: never, context: ServerContext) {
      await refresh(context.req, context.res)
      return true
    },
    async signOut(root: never, args: never, context: ServerContext) {
      await signOut(context.req, context.res)
      return true
    },
  },
}
