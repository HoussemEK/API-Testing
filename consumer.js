const { Kafka } = require("kafkajs");
const mongoose = require("mongoose");
const connectDB = require("./db");

const MessageSchema = new mongoose.Schema({ value: String });
const Message = mongoose.model("Message", MessageSchema);

const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await connectDB();
  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const text = message.value.toString();
      console.log("Received:", text);
      const newMsg = new Message({ value: text });
      await newMsg.save();
    },
  });
};

run().catch(console.error);
