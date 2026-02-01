const PetModel = require("../models/pet");
const mongoose = require("mongoose");

// Create a new pet
exports.createPet = async (req, res) => {
  try {
    const { name, breed, image, owner } = req.body;
    let { age } = req.body;

    if (!name || age === undefined || !breed || !owner) {
      return res.status(400).json({
        success: false,
        message: "Validation error: name, age, breed and owner are required",
      });
    }

    // Parse age as number if it's a string
    age = Number(age);
    if (isNaN(age) || age < 0) {
      return res.status(400).json({ success: false, message: "Age must be a non-negative number" });
    }

    if (!owner.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid owner ID format" });
    }

    const pet = await PetModel.create({ name, age, breed, image, owner });
    res.status(201).json({ success: true, message: "Pet created", data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating pet", error: error.message });
  }
};

// Get all pets (optionally by owner)
exports.getPets = async (req, res) => {
  try {
    const { owner } = req.query;
    const filter = {};
    if (owner) {
      if (!owner.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: "Invalid owner ID format" });
      }
      filter.owner = owner;
    }

    const pets = await PetModel.find(filter).populate("owner", "username").select("-__v").sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: pets, count: pets.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pets", error: error.message });
  }
};

// Get pet by ID
exports.getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid pet ID" });
    }

    const pet = await PetModel.findById(id).populate("owner", "username").select("-__v");
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    res.status(200).json({ success: true, data: pet });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching pet", error: error.message });
  }
};

// Update pet
exports.updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid pet ID" });
    }

    if (updates.owner && !updates.owner.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid owner ID format" });
    }

    // Parse age as number if it's provided and is a string
    if (updates.age !== undefined) {
      updates.age = Number(updates.age);
      if (isNaN(updates.age) || updates.age < 0) {
        return res.status(400).json({ success: false, message: "Age must be a non-negative number" });
      }
    }

    const updated = await PetModel.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).populate("owner", "username");
    if (!updated) return res.status(404).json({ success: false, message: "Pet not found" });

    res.status(200).json({ success: true, message: "Pet updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating pet", error: error.message });
  }
};

// Delete pet
exports.deletePet = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid pet ID" });
    }

    const deleted = await PetModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Pet not found" });

    res.status(200).json({ success: true, message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting pet", error: error.message });
  }
};
