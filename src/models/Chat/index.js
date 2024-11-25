const mongoose = require("mongoose");
const schema = require("./schema");

const Chat = mongoose.model("Chat", schema);

module.exports = Chat;
