const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { validateBooking, validateBookingUpdate } = require("../middlewares/validation.middleware");

// POST create new booking with validation
// http://localhost:5000/api/v1/bookings
router.post("/", validateBooking, bookingController.createBooking);

// GET all bookings (admin)
// http://localhost:5000/api/v1/bookings/all
router.get("/all", bookingController.getAllBookings);

// GET user bookings
// http://localhost:5000/api/v1/bookings/user/:user
router.get("/user/:user", bookingController.getUserBookings);

// PUT cancel booking
// http://localhost:5000/api/v1/bookings/:id/cancel
router.put("/:id/cancel", bookingController.cancelBooking);

// GET booking by ID
// http://localhost:5000/api/v1/bookings/:id
router.get("/:id", bookingController.getBookingById);

// PUT update booking with validation
// http://localhost:5000/api/v1/bookings/:id
router.put("/:id", validateBookingUpdate, bookingController.updateBooking);

// DELETE booking
// http://localhost:5000/api/v1/bookings/:id
router.delete("/:id", bookingController.deleteBooking);

module.exports = router;