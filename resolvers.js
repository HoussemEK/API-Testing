const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Kafka } = require("kafkajs");

// Kafka setup
const kafka = new Kafka({
  clientId: "api-gateway",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

// Load proto files
const movieProtoPath = "movie.proto";
const tvShowProtoPath = "tvShow.proto";

const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

const resolvers = {
  Query: {
    movie: (_, { id }) => {
      const client = new movieProto.MovieService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.getMovie({ movie_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movie);
          }
        });
      });
    },
    movies: () => {
      const client = new movieProto.MovieService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.searchMovies({ query: "" }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movies);
          }
        });
      });
    },
    tvShow: (_, { id }) => {
      const client = new tvShowProto.TVShowService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.getTvshow({ tv_show_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_show);
          }
        });
      });
    },
    tvShows: () => {
      const client = new tvShowProto.TVShowService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );
      return new Promise((resolve, reject) => {
        client.searchTvshows({ query: "" }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_shows);
          }
        });
      });
    },
  },
  Mutation: {
    createMovie: async (_, { movie }) => {
      const client = new movieProto.MovieService(
        "localhost:50051",
        grpc.credentials.createInsecure()
      );

      // Generate ID for demo purposes
      const newMovie = {
        id: Date.now().toString(),
        ...movie,
      };

      // Send Kafka message
      await producer.connect();
      await producer.send({
        topic: "movies_topic",
        messages: [
          {
            value: JSON.stringify({
              event: "MOVIE_CREATED",
              data: newMovie,
            }),
          },
        ],
      });
      await producer.disconnect();

      return new Promise((resolve, reject) => {
        client.createMovie({ movie: newMovie }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.movie);
          }
        });
      });
    },
    createTVShow: async (_, { tvShow }) => {
      const client = new tvShowProto.TVShowService(
        "localhost:50052",
        grpc.credentials.createInsecure()
      );

      // Generate ID for demo purposes
      const newTvShow = {
        id: Date.now().toString(),
        ...tvShow,
      };

      // Send Kafka message
      await producer.connect();
      await producer.send({
        topic: "tvshows_topic",
        messages: [
          {
            value: JSON.stringify({
              event: "TVSHOW_CREATED",
              data: newTvShow,
            }),
          },
        ],
      });
      await producer.disconnect();

      return new Promise((resolve, reject) => {
        client.createTvshow({ tv_show: newTvShow }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.tv_show);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
