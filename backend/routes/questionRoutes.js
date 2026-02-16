const express = require("express");
const {
  createQuestion,
  getQuestionsBySession,
  updateQuestionAnswer,
} = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, createQuestion);
router.get("/session/:sessionId", protect, getQuestionsBySession);
router.put("/:id", protect, updateQuestionAnswer);

module.exports = router;
