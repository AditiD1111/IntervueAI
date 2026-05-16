const express = require("express");
const {
  createSession,
  getUserSessions,
  getSessionById,
  updateSession,
} = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createSession);
router.get("/", getUserSessions);
router.get("/:id", getSessionById);
router.put("/:id", updateSession);

module.exports = router;
