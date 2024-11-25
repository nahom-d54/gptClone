const mongoose = require("mongoose");
const schema = require("./schema");
const statics = require("./static");

schema.static(statics);

const Chat = mongoose.model("Chat", schema);

module.exports = Chat;
