const Question = require("../models/question");

// Create Question
exports.createQuestion = async (req, res) => {
  try {
    const { sessionId, questionText, correctAnswer, difficulty } = req.body;

    const newQuestion = await Question.create({
      session: sessionId,
      questionText,
      correctAnswer,
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
    const questions = await Question.find({ session: req.params.sessionId });

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
    const { userAnswer, explanation, isCorrect } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { userAnswer, explanation, isCorrect },
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