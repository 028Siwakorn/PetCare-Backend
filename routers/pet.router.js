const express = require("express");
const router = express.Router();
const petController = require("../controllers/pet.controller");

// GET /api/v1/pets - list pets (optional ?owner=ownerId)
router.get("/", petController.getPets);

// GET /api/v1/pets/:id - get pet by id
router.get("/:id", petController.getPetById);

// POST /api/v1/pets - create new pet
router.post("/create", petController.createPet);

// PUT /api/v1/pets/:id - update pet
router.put("/:id", petController.updatePet);

// DELETE /api/v1/pets/:id - delete pet
router.delete("/:id", petController.deletePet);

module.exports = router;
