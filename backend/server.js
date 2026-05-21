require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const questionBankRoutes = require("./routes/questionBankRoutes");
const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middlewares/errorhandler");

const app = express();
const uploadsPath = path.join(__dirname, "uploads");

// Middleware to handle CORS
app.use(cors());

connectDB();

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Middleware
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "IntervueAI API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/interview-questions", questionBankRoutes);
app.use("/api/ai", aiRoutes);

// Serve uploads folder
app.use("/uploads", express.static(uploadsPath));

app.use(errorHandler);

// Start Server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
