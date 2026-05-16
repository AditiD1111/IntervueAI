const Session = require("../models/session");
const isDatabaseReady = require("../utils/isDatabaseReady");
const { createLocalSession, getSessions, saveSessions } = require("../utils/fileStore");

const isBufferingError = (error) =>
  typeof error?.message === "string" &&
  (error.message.includes("buffering timed out") || error.message.includes("ECONNREFUSED"));

const serializeSession = (session) => ({
  id: session._id,
  role: session.role,
  topics: session.topics,
  experience: session.experience,
  questions: session.questions,
  status: session.status,
  score: session.score,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

const findSessionsForUser = async (userId) => {
  if (!isDatabaseReady()) {
    return getSessions()
      .filter((session) => session.user === userId)
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
  }

  try {
    return await Session.find({ user: userId }).sort({ updatedAt: -1 });
  } catch (error) {
    if (isBufferingError(error)) {
      return getSessions()
        .filter((session) => session.user === userId)
        .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
    }

    throw error;
  }
};

const findSessionById = async (sessionId, userId) => {
  if (!isDatabaseReady()) {
    return (
      getSessions().find(
        (session) => session._id === sessionId && session.user === userId
      ) || null
    );
  }

  try {
    return await Session.findOne({ _id: sessionId, user: userId });
  } catch (error) {
    if (isBufferingError(error)) {
      return (
        getSessions().find(
          (session) => session._id === sessionId && session.user === userId
        ) || null
      );
    }

    throw error;
  }
};

const createSessionRecord = async ({ user, role, topics, experience, questions }) => {
  if (!isDatabaseReady()) {
    const sessions = getSessions();
    const session = createLocalSession({
      user,
      role,
      topics,
      experience,
      questions,
    });
    saveSessions([...sessions, session]);
    return session;
  }

  try {
    return await Session.create({
      user,
      role,
      topics,
      experience,
      questions,
    });
  } catch (error) {
    if (isBufferingError(error)) {
      const sessions = getSessions();
      const session = createLocalSession({
        user,
        role,
        topics,
        experience,
        questions,
      });
      saveSessions([...sessions, session]);
      return session;
    }

    throw error;
  }
};

exports.createSession = async (req, res) => {
  try {
    const role = typeof req.body.role === "string" ? req.body.role.trim() : "";
    const topics = typeof req.body.topics === "string" ? req.body.topics.trim() : "";
    const experience = typeof req.body.experience === "string" ? req.body.experience.trim() : "";
    const questions = Number(req.body.questions) || 10;

    if (!role || !topics || !experience) {
      return res.status(400).json({
        message: "Please provide the role, topics, and experience level for this session.",
      });
    }

    const session = await createSessionRecord({
      user: req.userId,
      role,
      topics,
      experience,
      questions,
    });

    res.status(201).json({
      success: true,
      session: serializeSession(session),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to create the session." });
  }
};

exports.getUserSessions = async (req, res) => {
  try {
    const sessions = await findSessionsForUser(req.userId);

    res.status(200).json({
      success: true,
      sessions: sessions.map(serializeSession),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch interview sessions." });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await findSessionById(req.params.id, req.userId);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    res.status(200).json({
      success: true,
      session: serializeSession(session),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch the session." });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await findSessionById(req.params.id, req.userId);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const allowedFields = ["role", "topics", "experience", "questions", "status", "score"];

    if (isDatabaseReady() && typeof session.save === "function") {
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          session[field] = req.body[field];
        }
      });

      await session.save();
    } else {
      const updatedSession = {
        ...session,
        updatedAt: new Date().toISOString(),
      };

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updatedSession[field] = req.body[field];
        }
      });

      const sessions = getSessions().map((currentSession) =>
        currentSession._id === req.params.id ? updatedSession : currentSession
      );

      saveSessions(sessions);
      Object.assign(session, updatedSession);
    }

    res.status(200).json({
      success: true,
      session: serializeSession(session),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to update the session." });
  }
};
