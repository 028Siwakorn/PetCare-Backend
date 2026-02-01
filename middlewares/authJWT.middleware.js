const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const UserModel = require("../models/user");

function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.headers["x-access-token"];
}

const verifyToken = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Token is missing!" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ success: false, message: "Access Forbidden" });
    req.username = decoded.username;
    req.ownerId = decoded.id;
    next();
  });
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!req.ownerId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const user = await UserModel.findById(req.ownerId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const authJwt = {
  verifyToken,
  requireAdmin,
};
module.exports = authJwt;