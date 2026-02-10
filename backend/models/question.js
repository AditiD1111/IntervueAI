const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },
    questionText: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
    },
    userAnswer: {
      type: String,
    },
    explanation: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    isCorrect: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);