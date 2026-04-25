const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const isDatabaseReady = require("../utils/isDatabaseReady");
const { createLocalUser, getUsers, saveUsers } = require("../utils/fileStore");

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const isBufferingError = (error) =>
  typeof error?.message === "string" &&
  (error.message.includes("buffering timed out") || error.message.includes("ECONNREFUSED"));

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const safeDeleteUploadedFile = (file) => {
  if (file?.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profilePicture: user.profilePicture,
});

const findUserByEmail = async (email) => {
  if (!isDatabaseReady()) {
    return getUsers().find((user) => user.email === email) || null;
  }

  try {
    return await User.findOne({ email });
  } catch (error) {
    if (isBufferingError(error)) {
      return getUsers().find((user) => user.email === email) || null;
    }

    throw error;
  }
};

const findUserById = async (userId) => {
  if (!isDatabaseReady()) {
    return getUsers().find((user) => user._id === userId) || null;
  }

  try {
    return await User.findById(userId);
  } catch (error) {
    if (isBufferingError(error)) {
      return getUsers().find((user) => user._id === userId) || null;
    }

    throw error;
  }
};

const createUser = async ({ name, email, password, profilePicture }) => {
  if (!isDatabaseReady()) {
    const users = getUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createLocalUser({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });

    saveUsers([...users, user]);
    return user;
  }

  try {
    return await User.create({
      name,
      email,
      password,
      profilePicture,
    });
  } catch (error) {
    if (isBufferingError(error)) {
      const users = getUsers();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = createLocalUser({
        name,
        email,
        password: hashedPassword,
        profilePicture,
      });

      saveUsers([...users, user]);
      return user;
    }

    throw error;
  }
};

exports.register = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password.trim() : "";

    if (!name || !email || !password) {
      safeDeleteUploadedFile(req.file);
      return res.status(400).json({ message: "Please provide your name, email, and password." });
    }

    if (!emailPattern.test(email)) {
      safeDeleteUploadedFile(req.file);
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (password.length < 8) {
      safeDeleteUploadedFile(req.file);
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const userExists = await findUserByEmail(email);

    if (userExists) {
      safeDeleteUploadedFile(req.file);
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const user = await createUser({
      name,
      email,
      password,
      profilePicture: req.profilePicture || null,
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    safeDeleteUploadedFile(req.file);
    res.status(500).json({ message: error.message || "Unable to create your account right now." });
  }
};

exports.login = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch =
      typeof user.matchPassword === "function"
        ? await user.matchPassword(password)
        : await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to log you in right now." });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to fetch the current user." });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.profilePicture) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const user = await findUserById(req.userId);

    if (!user) {
      safeDeleteUploadedFile(req.file);
      return res.status(404).json({ message: "User not found." });
    }

    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, "../", user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profilePicture = req.profilePicture;

    if (isDatabaseReady() && typeof user.save === "function") {
      await user.save();
    } else {
      const users = getUsers().map((currentUser) =>
        currentUser._id === req.userId
          ? { ...currentUser, profilePicture: req.profilePicture, updatedAt: new Date().toISOString() }
          : currentUser
      );
      saveUsers(users);
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    safeDeleteUploadedFile(req.file);
    res.status(500).json({ message: error.message || "Unable to update the profile picture." });
  }
};

exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await findUserById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: "No profile picture to delete." });
    }

    const imagePath = path.join(__dirname, "../", user.profilePicture);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    user.profilePicture = null;

    if (isDatabaseReady() && typeof user.save === "function") {
      await user.save();
    } else {
      const users = getUsers().map((currentUser) =>
        currentUser._id === req.userId
          ? { ...currentUser, profilePicture: null, updatedAt: new Date().toISOString() }
          : currentUser
      );
      saveUsers(users);
    }

    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully.",
      user: serializeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Unable to delete the profile picture." });
  }
};
