const express = require("express");
const {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createSession);
router.get("/", protect, getUserSessions);
router.get("/:id", protect, getSessionById);
router.put("/:id", protect, updateSession);

module.exports = router;
