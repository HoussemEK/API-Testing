const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Kafka } = require("kafkajs");

// Kafka setup
const kafka = new Kafka({
  clientId: "movie-service",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

// Load proto file
const movieProtoPath = "movie.proto";
const movieProtoDefinition = protoLoader.loadSync(movieProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const movieProto = grpc.loadPackageDefinition(movieProtoDefinition).movie;

// In-memory database for demo
let movies = [
  {
    id: "1",
    title: "Inception",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology.",
  },
  {
    id: "2",
    title: "The Matrix",
    description: "A computer hacker learns about the true nature of reality.",
  },
];

// Implement service methods
const movieService = {
  getMovie: (call, callback) => {
    const movie = movies.find((m) => m.id === call.request.movie_id);
    if (movie) {
      callback(null, { movie });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Movie not found",
      });
    }
  },

  searchMovies: (call, callback) => {
    const { query } = call.request;
    const results = query
      ? movies.filter(
          (m) =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.description.toLowerCase().includes(query.toLowerCase())
        )
      : movies;
    callback(null, { movies: results });
  },

  createMovie: async (call, callback) => {
    const newMovie = call.request.movie;
    movies.push(newMovie);

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

    callback(null, { movie: newMovie });
  },
};

// Create and start server
const server = new grpc.Server();
server.addService(movieProto.MovieService.service, movieService);
const port = 50051;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }
    console.log(`Movie microservice running on port ${port}`);
    server.start();
  }
);
