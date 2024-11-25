const mongoose = require("mongoose");
const schema = require("./schema");
const static = require("./static");

schema.static(static);
const ChatHistory = mongoose.model("ChatHistory", schema);

module.exports = ChatHistory;
