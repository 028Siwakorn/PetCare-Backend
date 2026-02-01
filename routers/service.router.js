const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const { validateService } = require("../middlewares/validation.middleware");
const authJwt = require("../middlewares/authJWT.middleware");

// GET all services (public)
// http://localhost:5000/api/v1/services
router.get("/", serviceController.getAllServices);

// GET service by ID (public)
// http://localhost:5000/api/v1/services/:id
router.get("/:id", serviceController.getServiceById);

// POST create new service (admin only)
router.post("/", authJwt.verifyToken, authJwt.requireAdmin, validateService, serviceController.createService);

// PUT update service (admin only)
router.put("/:id", authJwt.verifyToken, authJwt.requireAdmin, validateService, serviceController.updateService);

// DELETE service (admin only)
router.delete("/:id", authJwt.verifyToken, authJwt.requireAdmin, serviceController.deleteService);

module.exports = router;
