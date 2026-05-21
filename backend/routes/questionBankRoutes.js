const express = require("express");
const {
  getRandomQuestions,
  pinQuestion,
  unpinQuestion,
  getPinnedQuestions,
} = require("../controllers/questionBankController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/random", getRandomQuestions);
router.get("/pinned", getPinnedQuestions);
router.post("/pin", pinQuestion);
router.post("/unpin", unpinQuestion);

module.exports = router;
