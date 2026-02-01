const BookingModel = require("../models/booking");
const ServiceModel = require("../models/service");

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    const { customerName, phoneNumber, petName, appointmentDateTime, serviceId, owner, notes } = req.body;

    const serviceIdStr = serviceId != null ? String(serviceId).trim() : "";
    if (!serviceIdStr || !/^[0-9a-fA-F]{24}$/.test(serviceIdStr)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing service ID"
      });
    }

    const service = await ServiceModel.findById(serviceIdStr);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found. Make sure the service exists in the same database (e.g. add services on the same backend you use for booking)."
      });
    }

    // Check if service is available
    if (!service.available) {
      return res.status(400).json({
        success: false,
        message: "This service is not currently available"
      });
    }

    // Create new booking
    const newBooking = new BookingModel({
      customerName,
      phoneNumber,
      petName,
      appointmentDateTime,
      serviceId: serviceIdStr,
      owner,
      notes,
      status: "pending"
    });

    const savedBooking = await newBooking
      .save()
      .then(booking => booking.populate("serviceId", "name price duration"))
      .then(booking => booking.populate("owner", "-password"));

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: savedBooking
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message
    });
  }
};

// Get all bookings for a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const { user } = req.params;

    // Validate user ID format
    if (!user.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const bookings = await BookingModel.find({ owner: user })
      .populate("serviceId", "name price duration description imageUrl")
      .populate("owner", "-password")
      .select("-__v")
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user"
      });
    }

    res.status(200).json({
      success: true,
      message: "User bookings retrieved successfully",
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user bookings",
      error: error.message
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    const booking = await BookingModel.findById(id)
      .populate("serviceId", "name price duration description imageUrl")
      .populate("owner", "-password")
      .select("-__v");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving booking",
      error: error.message
    });
  }
};

// Get all bookings (admin functionality)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, serviceId, sortBy = "createdAt" } = req.query;

    // Build filter object
    let filter = {};
    if (status) {
      filter.status = status;
    }
    if (serviceId) {
      filter.serviceId = serviceId;
    }

    const bookings = await BookingModel.find(filter)
      .populate("serviceId", "name price duration")
      .populate("owner", "-password")
      .select("-__v")
      .sort({ [sortBy]: -1 });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found"
      });
    }

    res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving bookings",
      error: error.message
    });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    // Check if booking exists
    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // If serviceId is being updated, verify it exists
    if (updates.serviceId) {
      const service = await ServiceModel.findById(updates.serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found"
        });
      }
    }

    // Update the booking
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("serviceId", "name price duration")
      .populate("owner", "-password");

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Check if booking can be cancelled
    if (booking.status === "completed" || booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking with status: ${booking.status}`
      });
    }

    // Update booking status to cancelled
    const cancelledBooking = await BookingModel.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    )
      .populate("serviceId", "name price")
      .populate("owner", "-password");

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID format"
      });
    }

    const deletedBooking = await BookingModel.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      data: deletedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting booking",
      error: error.message
    });
  }
};