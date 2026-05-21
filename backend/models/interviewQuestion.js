const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    theme: {
      type: String,
      required: true,
      trim: true,
    },
    questionTemplate: {
      type: String,
      required: true,
      trim: true,
    },
    answerTemplate: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

interviewQuestionSchema.index({ role: 1, theme: 1 });

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);
