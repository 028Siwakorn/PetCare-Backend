const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PetSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    breed: { type: String, required: true, trim: true },
    image: { type: String, required: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const PetModel = model("Pet", PetSchema);
module.exports = PetModel;