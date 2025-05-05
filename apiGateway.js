const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Kafka } = require("kafkajs");

// Load resolvers and schema
const resolvers = require("./resolvers");
const typeDefs = require("./schema");

// Create Express app
const app = express();

// Create Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Apply middleware
server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

// REST endpoints
app.get("/movies", (req, res) => {
  const client = new movieProto.MovieService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  client.searchMovies({ query: "" }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.movies);
    }
  });
});

app.get("/movies/:id", (req, res) => {
  const client = new movieProto.MovieService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  const id = req.params.id;
  client.getMovie({ movie_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.movie);
    }
  });
});

app.post("/movies", async (req, res) => {
  const client = new movieProto.MovieService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  const newMovie = {
    id: Date.now().toString(),
    ...req.body,
  };

  client.createMovie({ movie: newMovie }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.movie);
    }
  });
});

app.get("/tvshows", (req, res) => {
  const client = new tvShowProto.TVShowService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );
  client.searchTvshows({ query: "" }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_shows);
    }
  });
});

app.get("/tvshows/:id", (req, res) => {
  const client = new tvShowProto.TVShowService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );
  const id = req.params.id;
  client.getTvshow({ tv_show_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_show);
    }
  });
});

app.post("/tvshows", async (req, res) => {
  const client = new tvShowProto.TVShowService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );

  const newTvShow = {
    id: Date.now().toString(),
    ...req.body,
  };

  client.createTvshow({ tv_show: newTvShow }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.tv_show);
    }
  });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
