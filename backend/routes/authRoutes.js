const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  updateProfilePicture,
  deleteProfilePicture,
} = require("../controllers/authController");
const upload = require("../middlewares/uploadmiddleware");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

const attachProfilePicturePath = (req, res, next) => {
  if (req.file) {
    req.profilePicture = `uploads/${req.file.filename}`;
  }

  next();
};

router.post("/register", upload.single("profilePicture"), attachProfilePicturePath, register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.put(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  attachProfilePicturePath,
  updateProfilePicture
);
router.delete("/profile-picture", protect, deleteProfilePicture);

module.exports = router;
