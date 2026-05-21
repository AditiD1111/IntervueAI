const InterviewQuestion = require("../models/interviewQuestion");
const User = require("../models/user");

/**
 * Interpolates template placeholders with session context.
 * Supported placeholders: {topic}, {experience}, {role}
 */
function interpolate(template, context) {
  if (!template) return "";
  return template
    .replace(/\{topic\}/gi, context.topic || "general concepts")
    .replace(/\{experience\}/gi, context.experience || "any level")
    .replace(/\{role\}/gi, context.role || "software engineer");
}

/**
 * Pick a topic from the comma-separated topics string using round-robin by index.
 */
function pickTopic(topicsString, index) {
  const topics = (topicsString || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (topics.length === 0) return "general concepts";
  return topics[index % topics.length];
}

/**
 * GET /api/interview-questions/random
 *
 * Query params:
 *   - role (required): e.g. "frontend developer"
 *   - experience: e.g. "2-3 years"
 *   - topics: comma-separated, e.g. "React, JavaScript"
 *   - count: number of questions to return (default 10)
 *
 * Returns pinned questions first (always included), then fills remaining
 * slots with random questions from the bank.
 */
exports.getRandomQuestions = async (req, res) => {
  try {
    const role = (req.query.role || "").trim().toLowerCase();
    const experience = (req.query.experience || "").trim();
    const topics = (req.query.topics || "").trim();
    const count = Math.min(Math.max(parseInt(req.query.count, 10) || 10, 1), 20);

    if (!role) {
      return res.status(400).json({ message: "Role is required." });
    }

    // Get the user's pinned questions for this role
    const user = await User.findById(req.userId).lean();
    const allPinnedIds = (user?.pinnedQuestions || []).map((id) => id.toString());

    // Fetch pinned questions that match this role
    let pinnedQuestions = [];
    if (allPinnedIds.length > 0) {
      pinnedQuestions = await InterviewQuestion.find({
        _id: { $in: allPinnedIds },
        role,
      }).lean();
    }

    const pinnedIds = pinnedQuestions.map((q) => q._id.toString());
    const remainingCount = Math.max(0, count - pinnedQuestions.length);

    // Fetch random questions excluding pinned ones
    let randomQuestions = [];
    if (remainingCount > 0) {
      randomQuestions = await InterviewQuestion.aggregate([
        { $match: { role, _id: { $nin: pinnedQuestions.map((q) => q._id) } } },
        { $sample: { size: remainingCount } },
      ]);
    }

    // Combine: pinned first, then random
    const combined = [...pinnedQuestions, ...randomQuestions];

    // Interpolate templates and build response
    const questions = combined.map((q, index) => {
      const topic = pickTopic(topics, index);
      const context = { topic, experience, role: req.query.role || role };

      return {
        id: q._id,
        number: index + 1,
        question: interpolate(q.questionTemplate, context),
        answer: interpolate(q.answerTemplate, context),
        isPinned: pinnedIds.includes(q._id.toString()),
        theme: q.theme,
        difficulty: q.difficulty,
      };
    });

    res.status(200).json({
      success: true,
      questions,
      meta: {
        total: questions.length,
        pinnedCount: pinnedQuestions.length,
        randomCount: randomQuestions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to fetch interview questions.",
    });
  }
};

/**
 * POST /api/interview-questions/pin
 *
 * Body: { questionId }
 * Adds questionId to the user's pinnedQuestions array.
 */
exports.pinQuestion = async (req, res) => {
  try {
    const questionId = (req.body.questionId || "").trim();

    if (!questionId) {
      return res.status(400).json({ message: "questionId is required." });
    }

    // Verify the question exists
    const question = await InterviewQuestion.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    // Add to user's pinned list (avoid duplicates)
    await User.findByIdAndUpdate(
      req.userId,
      { $addToSet: { pinnedQuestions: questionId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Question pinned successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to pin the question.",
    });
  }
};

/**
 * POST /api/interview-questions/unpin
 *
 * Body: { questionId }
 * Removes questionId from the user's pinnedQuestions array.
 */
exports.unpinQuestion = async (req, res) => {
  try {
    const questionId = (req.body.questionId || "").trim();

    if (!questionId) {
      return res.status(400).json({ message: "questionId is required." });
    }

    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { pinnedQuestions: questionId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Question unpinned successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to unpin the question.",
    });
  }
};

/**
 * GET /api/interview-questions/pinned
 *
 * Returns all pinned question IDs for the current user.
 */
exports.getPinnedQuestions = async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    const pinnedIds = (user?.pinnedQuestions || []).map((id) => id.toString());

    res.status(200).json({
      success: true,
      pinnedQuestionIds: pinnedIds,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Unable to fetch pinned questions.",
    });
  }
};
