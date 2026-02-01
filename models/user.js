const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, min: 4 },
  password: { type: String, required: true, min: 6 },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;