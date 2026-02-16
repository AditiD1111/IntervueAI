const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  updateProfilePicture,
  deleteProfilePicture,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadmiddleware");

const router = express.Router();

// Register and Login routes
router.post("/register", upload.single("profilePicture"), register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/profile-picture", protect, upload.single("profilePicture"), updateProfilePicture);
router.delete("/profile-picture", protect, deleteProfilePicture);

module.exports = router;
