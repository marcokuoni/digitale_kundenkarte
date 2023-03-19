import User from '../models/user'
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
 
export const usersResolvers = {
   Date: new GraphQLScalarType<Date | null, number>({
     name: 'Date',
     description: 'Date custom scalar type',
     parseValue(value) {
       return new Date(value as string); // value from the client
     },
     serialize(value) {
       return (value as Date).getTime(); // value sent to the client
     },
     parseLiteral(ast) {
       if (ast.kind === Kind.INT) {
         return new Date(ast.value) // ast value is always in string format
       }
       return null;
     },
   }),
   Query: {
     async getUsers() {
       return await User.find()
     },
   },
   Mutation: {
      async addUser(root: never, { name }: {name: string}) {
         return await User.create({
            name,
         })
      },
   }
 }