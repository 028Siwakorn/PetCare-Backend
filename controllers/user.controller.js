const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({
      message: "Please Provide Username and Password!",
    });
  }
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).send({
      message: "This Username is already existed!",
    });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.status(201).send({
      message: "User registered successfully!",
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some errors occured while registering a new user!",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({
      message: "Please Provide Username and Password!",
    });
  }
  try {
    const userDoc = await UserModel.findOne({ username });
    if (!userDoc) {
      return res.status(404).send({ message: "User not found!" });
    }
    const isPasswordMatched = bcrypt.compareSync(password, userDoc.password);
    if (!isPasswordMatched) {
      return res.status(401).send({ message: "Invalid Credentials!" });
    }
    // Ensure secret is configured
    if (!secret) {
      return res
        .status(500)
        .send({ message: "Server configuration error: SECRET is not set" });
    }

    // Login successfully -> generate token (ส่ง id เป็น string ให้ Frontend ใช้ได้)
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Internal Server Error: Authentication failed!" });
      }
      res.send({
        message: "User logged in successfully!",
        id: String(userDoc._id),
        username,
        role: userDoc.role || "user",
        accessToken: token,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some errors occured while logging in user!",
    });
  }
};