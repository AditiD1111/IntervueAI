const Session = require("../models/Session");

// Create Session
exports.createSession = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    const session = await Session.create({
      userId: req.userId,
      title,
      description,
      duration,
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Sessions for User
exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Session
exports.updateSession = async (req, res) => {
  try {
    const { title, description, status, score } = req.body;

    let session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session = await Session.findByIdAndUpdate(
      req.params.id,
      { title, description, status, score },
      { new: true }
    );

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};