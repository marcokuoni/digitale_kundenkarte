import Movie from '../models/movie'
 
export const moviesResolvers = {
   Query: {
     async movies() {
       return await Movie.find()
     },
   },
   Mutation: {
      async addMovie(root: never, { title, director }: {title: string, director: string}) {
         return await Movie.create({
            title,
            director,
         })
      },
   }
 }