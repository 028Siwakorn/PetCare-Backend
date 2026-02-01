const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ServiceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Service name must be at least 3 characters"]
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
      minlength: [10, "Service description must be at least 10 characters"]
    },
    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price must be a positive number"]
    },
    imageUrl: {
      type: String,
      required: [true, "Service image URL is required"],
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        "Please provide a valid image URL"
      ]
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required"],
      default: 60,
      min: [15, "Duration must be at least 15 minutes"]
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const ServiceModel = model("Service", ServiceSchema);
module.exports = ServiceModel;
