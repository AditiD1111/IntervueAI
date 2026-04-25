const express = require("express");
const {
  chatWithCoach,
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", chatWithCoach);
router.post("/generate-questions", generateInterviewQuestions);
router.post("/generate-explanation", generateConceptExplanation);

module.exports = router;
