const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Kafka } = require("kafkajs");

// Kafka setup
const kafka = new Kafka({
  clientId: "tvshow-service",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

// Load proto file
const tvShowProtoPath = "tvShow.proto";
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

// In-memory database for demo
let tvShows = [
  {
    id: "1",
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with cancer turns to manufacturing and selling methamphetamine.",
  },
  {
    id: "2",
    title: "Game of Thrones",
    description:
      "Nine noble families fight for control over the lands of Westeros.",
  },
];

// Implement service methods
const tvShowService = {
  getTvshow: (call, callback) => {
    const tvShow = tvShows.find((t) => t.id === call.request.tv_show_id);
    if (tvShow) {
      callback(null, { tv_show: tvShow });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "TV Show not found",
      });
    }
  },

  searchTvshows: (call, callback) => {
    const { query } = call.request;
    const results = query
      ? tvShows.filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.description.toLowerCase().includes(query.toLowerCase())
        )
      : tvShows;
    callback(null, { tv_shows: results });
  },

  createTvshow: async (call, callback) => {
    const newTvShow = call.request.tv_show;
    tvShows.push(newTvShow);

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

    callback(null, { tv_show: newTvShow });
  },
};

// Create and start server
const server = new grpc.Server();
server.addService(tvShowProto.TVShowService.service, tvShowService);
const port = 50052;
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }
    console.log(`TV Show microservice running on port ${port}`);
    server.start();
  }
);
