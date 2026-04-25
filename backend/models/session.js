const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    topics: {
      type: String,
      required: true,
      trim: true,
      maxlength: 240,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    questions: {
      type: Number,
      default: 10,
      min: 1,
      max: 50,
    },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "active",
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
