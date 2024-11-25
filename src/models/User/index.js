const userSchema = require("./schema");
const mongoose = require("mongoose");
const userMethods = require("./methods")
const userStatics = require("./statics")

userSchema.method(userMethods)
userSchema.static(userStatics)

const User = mongoose.model("User", userSchema);
module.exports = User