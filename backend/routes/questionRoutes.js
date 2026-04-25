const express = require("express");
const {
  createQuestion,
  getQuestionsBySession,
  updateQuestionAnswer,
} = require("../controllers/questionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/", createQuestion);
router.get("/session/:sessionId", getQuestionsBySession);
router.put("/:id", updateQuestionAnswer);

module.exports = router;
