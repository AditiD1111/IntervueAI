const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDirectory = path.join(__dirname, "../data");
const usersFilePath = path.join(dataDirectory, "users.json");
const sessionsFilePath = path.join(dataDirectory, "sessions.json");

const ensureStoreFile = (filePath) => {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
};

const readCollection = (filePath) => {
  ensureStoreFile(filePath);

  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCollection = (filePath, collection) => {
  ensureStoreFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(collection, null, 2), "utf8");
};

const normalizeLocalUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  password: user.password,
  profilePicture: user.profilePicture || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const normalizeLocalSession = (session) => ({
  _id: session._id,
  user: session.user,
  role: session.role,
  topics: session.topics,
  experience: session.experience,
  questions: Number(session.questions) || 10,
  status: session.status || "active",
  score: Number(session.score) || 0,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

const getUsers = () => readCollection(usersFilePath).map(normalizeLocalUser);

const saveUsers = (users) => {
  writeCollection(usersFilePath, users.map(normalizeLocalUser));
};

const getSessions = () => readCollection(sessionsFilePath).map(normalizeLocalSession);

const saveSessions = (sessions) => {
  writeCollection(sessionsFilePath, sessions.map(normalizeLocalSession));
};

const createLocalUser = ({ name, email, password, profilePicture = null }) => {
  const now = new Date().toISOString();
  return normalizeLocalUser({
    _id: crypto.randomUUID(),
    name,
    email,
    password,
    profilePicture,
    createdAt: now,
    updatedAt: now,
  });
};

const createLocalSession = ({ user, role, topics, experience, questions }) => {
  const now = new Date().toISOString();
  return normalizeLocalSession({
    _id: crypto.randomUUID(),
    user,
    role,
    topics,
    experience,
    questions,
    status: "active",
    score: 0,
    createdAt: now,
    updatedAt: now,
  });
};

module.exports = {
  createLocalSession,
  createLocalUser,
  getSessions,
  getUsers,
  saveSessions,
  saveUsers,
};
