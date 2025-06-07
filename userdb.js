const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: { type: String, required: [true, "userName is required"] },
  password: { type: String, required: [true, "password is required"] },
});

const userModel = mongoose.model("UserSchema", userSchema);
module.exports = userModel;
