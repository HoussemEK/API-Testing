const { Kafka } = require("kafkajs");

const kafka = new Kafka({ clientId: "my-app", brokers: ["localhost:9092"] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  setInterval(async () => {
    try {
      await producer.send({
        topic: "test-topic",
        messages: [{ value: "Hello KafkaJS user!" }],
      });
      console.log("Message sent");
    } catch (err) {
      console.error("Error producing:", err);
    }
  }, 1000);
};

run().catch(console.error);
