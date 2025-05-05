const { gql } = require("graphql-tag");
const typeDefs = gql`
  type Movie {
    id: String!
    title: String!
    description: String!
  }

  type TVShow {
    id: String!
    title: String!
    description: String!
  }

  input MovieInput {
    title: String!
    description: String!
  }

  input TVShowInput {
    title: String!
    description: String!
  }

  type Query {
    movie(id: String!): Movie
    movies: [Movie]
    tvShow(id: String!): TVShow
    tvShows: [TVShow]
  }

  type Mutation {
    createMovie(movie: MovieInput!): Movie
    createTVShow(tvShow: TVShowInput!): TVShow
  }
`;

module.exports = typeDefs;
