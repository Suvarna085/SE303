const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
  validate,
} = require("../utils/validators");
const { authenticate } = require("../middleware/auth");

// Public routes
router.post("/register", registerValidation, validate, register);
router.post("/login", loginValidation, validate, login);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/profile", authenticate, getProfile);

module.exports = router;
