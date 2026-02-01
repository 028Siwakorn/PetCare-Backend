const ServiceModel = require("../models/service");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceModel.find().select("-__v");
    
    if (!services || services.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No services found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
      count: services.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving services",
      error: error.message
    });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    const service = await ServiceModel.findById(id).select("-__v");

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving service",
      error: error.message
    });
  }
};

// Create new service
exports.createService = async (req, res) => {
  try {
    const { name, description, price, imageUrl, duration, available } = req.body;

    // Validation checks
    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided (name, description, price, imageUrl)"
      });
    }

    const newService = new ServiceModel({
      name,
      description,
      price,
      imageUrl,
      duration: duration || 60,
      available: available !== undefined ? available : true
    });

    const savedService = await newService.save();

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: savedService
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
      message: "Error creating service",
      error: error.message
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    // Check if service exists
    const service = await ServiceModel.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Update the service
    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService
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
      message: "Error updating service",
      error: error.message
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    const deletedService = await ServiceModel.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message
    });
  }
};
