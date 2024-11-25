const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    chatTitle: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = chatHistorySchema;
