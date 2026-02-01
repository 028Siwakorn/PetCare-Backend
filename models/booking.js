const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BookingSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"]
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"]
    },
    petName: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true
    },
    appointmentDateTime: {
      type: Date,
      required: [true, "Appointment date and time are required"],
      validate: {
        validator: function(value) {
          return value > new Date();
        },
        message: "Appointment date must be in the future"
      }
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service ID is required"]
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "completed", "cancelled"],
        message: "Status must be one of: pending, confirmed, completed, cancelled"
      },
      default: "pending"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"]
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"]
    }
  },
  {
    timestamps: true
  }
);

const BookingModel = model("Booking", BookingSchema);
module.exports = BookingModel;