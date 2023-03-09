import client from "./apollo-client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, MutationOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Movie = {
  __typename?: 'Movie';
  _id: Scalars['ID'];
  director?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addMovie: Movie;
};


export type MutationAddMovieArgs = {
  director: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  movies?: Maybe<Array<Maybe<Movie>>>;
};

export type GetMoviesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMoviesQuery = { __typename?: 'Query', movies?: Array<{ __typename?: 'Movie', _id: string, title?: string | null, director?: string | null } | null> | null };

export type AddMovieMutationVariables = Exact<{
  title: Scalars['String'];
  director: Scalars['String'];
}>;


export type AddMovieMutation = { __typename?: 'Mutation', addMovie: { __typename?: 'Movie', _id: string, title?: string | null, director?: string | null } };


export const GetMoviesDoc = gql`
    query GetMovies {
  movies {
    _id
    title
    director
  }
}
    `;
export const AddMovieDoc = gql`
    mutation AddMovie($title: String!, $director: String!) {
  addMovie(title: $title, director: $director) {
    _id
    title
    director
  }
}
    `;
export const GetMovies = (
            options: Omit<
              WatchQueryOptions<GetMoviesQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<GetMoviesQuery> & {
              query: ObservableQuery<
                GetMoviesQuery,
                GetMoviesQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: GetMoviesDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<GetMoviesQuery> & {
                query: ObservableQuery<
                  GetMoviesQuery,
                  GetMoviesQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
export const AddMovie = (
            options: Omit<
              MutationOptions<any, AddMovieMutationVariables>, 
              "mutation"
            >
          ) => {
            const m = client.mutate<AddMovieMutation, AddMovieMutationVariables>({
              mutation: AddMovieDoc,
              ...options,
            });
            return m;
          }