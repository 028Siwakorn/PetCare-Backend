// Service validation middleware
exports.validateService = (req, res, next) => {
  const { name, description, price, imageUrl, duration } = req.body;

  // Check required fields
  if (!name || !description || !price || !imageUrl) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["name, description, price, and imageUrl are required fields"]
    });
  }

  // Validate name
  if (typeof name !== "string" || name.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Service name must be a string with at least 3 characters"]
    });
  }

  // Validate description
  if (typeof description !== "string" || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Service description must be at least 10 characters"]
    });
  }

  // Validate price
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Service price must be a positive number"]
    });
  }

  // Validate imageUrl
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if (!urlRegex.test(imageUrl)) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Please provide a valid image URL"]
    });
  }

  // Validate duration if provided
  if (duration && (typeof duration !== "number" || duration < 15)) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Duration must be a number with minimum 15 minutes"]
    });
  }

  next();
};

// Booking validation middleware
exports.validateBooking = (req, res, next) => {
  const { customerName, phoneNumber, petName, appointmentDateTime, serviceId } = req.body;

  // Check required fields
  if (!customerName || !phoneNumber || !petName || !appointmentDateTime || !serviceId) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["customerName, phoneNumber, petName, appointmentDateTime, and serviceId are required"]
    });
  }

  // Validate customer name
  if (typeof customerName !== "string" || customerName.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Customer name must be at least 3 characters"]
    });
  }

  // Validate phone number (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber.toString())) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Phone number must be exactly 10 digits"]
    });
  }

  // Validate pet name
  if (typeof petName !== "string" || petName.trim().length < 1) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Pet name is required"]
    });
  }

  // Validate appointment date/time
  const appointmentDate = new Date(appointmentDateTime);
  if (isNaN(appointmentDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Invalid appointment date/time format"]
    });
  }

  if (appointmentDate <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Appointment date must be in the future"]
    });
  }

  // Validate service ID format (MongoDB ObjectId)
  if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Invalid service ID format"]
    });
  }

  next();
};

// Booking update validation middleware
exports.validateBookingUpdate = (req, res, next) => {
  const { status, notes } = req.body;

  // Validate status if provided
  if (status) {
    const validStatuses = ["pending", "confirmed", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: [`Status must be one of: ${validStatuses.join(", ")}`]
      });
    }
  }

  // Validate notes if provided
  if (notes && typeof notes === "string" && notes.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: ["Notes cannot exceed 500 characters"]
    });
  }

  next();
};
