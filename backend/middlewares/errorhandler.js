const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  let message = err.message || "Server Error";

  if (req.originalUrl?.startsWith("/api/ai")) {
    if (/429|rate limit|quota/i.test(message)) {
      message =
        "Groq rate limit reached. Wait a moment and try again, or check your free-tier limits at console.groq.com.";
    } else if (/401|invalid api key|authentication/i.test(message)) {
      message = "Invalid Groq API key. Check GROQ_API_KEY in backend/.env and restart the server.";
    } else if (/GROQ_API_KEY is not configured/i.test(message)) {
      message = err.message;
    }
  }

  res.status(status).json({
    success: false,
    status,
    message,
  });
};

module.exports = errorHandler;