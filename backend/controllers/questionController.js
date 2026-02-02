const Question = require("../models/Question");

// Create Question
exports.createQuestion = async (req, res) => {
  try {
    const { sessionId, question, category, difficulty } = req.body;

    const newQuestion = await Question.create({
      sessionId,
      question,
      category,
      difficulty,
    });

    res.status(201).json({
      success: true,
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Questions by Session
exports.getQuestionsBySession = async (req, res) => {
  try {
    const questions = await Question.find({ sessionId: req.params.sessionId });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Question Answer
exports.updateQuestionAnswer = async (req, res) => {
  try {
    const { userAnswer, feedback, score } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { userAnswer, feedback, score },
      { new: true }
    );

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};