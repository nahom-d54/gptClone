const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatHistory",
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = chatSchema;
