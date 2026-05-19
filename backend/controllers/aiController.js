const OpenAI = require("openai");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = (
  process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
).replace(/\/$/, "");
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const groq = new OpenAI({
  baseURL: GROQ_BASE_URL,
  apiKey: GROQ_API_KEY,
});

const assertGroqConfigured = () => {
  if (!GROQ_API_KEY) {
    const error = new Error(
      "GROQ_API_KEY is not configured. Add it to backend/.env and restart the server."
    );
    error.statusCode = 503;
    throw error;
  }
};

const createChatCompletion = (options) => {
  assertGroqConfigured();
  return groq.chat.completions.create({
    model: GROQ_MODEL,
    ...options,
  });
};

const MAX_HISTORY_MESSAGES = 4;

const CHATBOT_INSTRUCTIONS = `
You are IntervueAI, an interview preparation coach.
Help users prepare for technical and behavioral interviews.
Be concise, practical, and encouraging.
Focus on interview prep, coding concepts, DSA, system design, resume advice, mock interview answers, and study plans.
Keep answers short by default, usually under 120 words unless the user asks for detail.
When useful, suggest one follow-up practice question or one next step.
`;

const parseJsonResponse = (content) => {
  const trimmed = typeof content === "string" ? content.trim() : "";
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = codeBlockMatch ? codeBlockMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidate);
  } catch {
    const arrayMatch = candidate.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const sanitizeMessages = (messages = []) =>
  messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string"
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content);

exports.chatWithCoach = async (req, res, next) => {
  try {
    const history = sanitizeMessages(req.body.messages).slice(-MAX_HISTORY_MESSAGES);
    const latestMessage =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!latestMessage) {
      return res.status(400).json({ message: "A message is required" });
    }

    const response = await createChatCompletion({
      messages: [
        { role: "system", content: CHATBOT_INSTRUCTIONS.trim() },
        ...history,
        { role: "user", content: latestMessage },
      ],
      temperature: 0.3,
      max_tokens: 256,
    });

    res.status(200).json({
      success: true,
      reply: response.choices?.[0]?.message?.content?.trim() || "",
      model: GROQ_MODEL,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateInterviewQuestions = async (req, res, next) => {
  try {
    const {
      category = "general programming",
      difficulty = "medium",
      count = 5,
    } = req.body;

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      return res.status(400).json({
        message: "Count must be an integer between 1 and 20",
      });
    }

    const prompt =
      `Generate ${count} interview questions in JSON format for the category ${category} with difficulty ${difficulty}. ` +
      "Return only a JSON array where each object has questionText, correctAnswer, and difficulty. " +
      'Example: [{"questionText":"...","correctAnswer":"...","difficulty":"medium"}]';

    const response = await createChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You return interview questions as valid JSON only. No markdown, no commentary, only the JSON array.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = response.choices?.[0]?.message?.content || "";
    const questions = parseJsonResponse(content) || [];

    res.status(200).json({
      success: true,
      questions,
      raw: questions.length === 0 ? content : undefined,
      model: GROQ_MODEL,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateConceptExplanation = async (req, res, next) => {
  try {
    const concept = typeof req.body.concept === "string" ? req.body.concept.trim() : "";

    if (!concept) {
      return res.status(400).json({ message: "A concept is required" });
    }

    const response = await createChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Explain technical concepts simply with interview-relevant examples. Keep the answer crisp but useful.",
        },
        {
          role: "user",
          content: `Explain the concept "${concept}" for someone preparing for interviews.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const explanation = response.choices?.[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      explanation: explanation.trim(),
      model: GROQ_MODEL,
    });
  } catch (error) {
    next(error);
  }
};
