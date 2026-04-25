const Question = require("../models/question");

exports.createQuestion = async (req, res) => {
  try {
    const session = typeof req.body.session === "string" ? req.body.session.trim() : "";
    const questionText =
      typeof req.body.questionText === "string" ? req.body.questionText.trim() : "";
    const correctAnswer =
      typeof req.body.correctAnswer === "string" ? req.body.correctAnswer.trim() : "";
    const difficulty =
      typeof req.body.difficulty === "string" ? req.body.difficulty.trim() : "medium";

    if (!session || !questionText) {
      return res
        .status(400)
        .json({ message: "Please provide the session id and question text." });
    }

    const newQuestion = await Question.create({
      session,
      questionText,
      correctAnswer,
      difficulty,
    });

    res.status(201).json({
      success: true,
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to create the question." });
  }
};

exports.getQuestionsBySession = async (req, res) => {
  try {
    const questions = await Question.find({ session: req.params.sessionId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch the questions." });
  }
};

exports.updateQuestionAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (req.body.userAnswer !== undefined) {
      question.userAnswer = req.body.userAnswer;
    }

    if (req.body.explanation !== undefined) {
      question.explanation = req.body.explanation;
    }

    if (req.body.correctAnswer !== undefined) {
      question.correctAnswer = req.body.correctAnswer;
    }

    if (req.body.isCorrect !== undefined) {
      question.isCorrect = req.body.isCorrect;
    }

    await question.save();

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to update the question." });
  }
};
