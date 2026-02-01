const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { validateService } = require("../middlewares/validation.middleware");

// GET all services
// http://localhost:5000/api/v1/services
router.get("/", serviceController.getAllServices);

// GET service by ID
// http://localhost:5000/api/v1/services/:id
router.get("/:id", serviceController.getServiceById);

// POST create new service
// http://localhost:5000/api/v1/services
router.post("/", validateService, serviceController.createService);

// PUT update service
// http://localhost:5000/api/v1/services/:id
router.put("/:id", validateService, serviceController.updateService);

// DELETE service
// http://localhost:5000/api/v1/services/:id
router.delete("/:id", serviceController.deleteService);

module.exports = router;
