const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db");

const app = express();
const PORT = 3000;

const Message = mongoose.model(
  "Message",
  new mongoose.Schema({ value: String })
);

connectDB();

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
