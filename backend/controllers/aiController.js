const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";
const MAX_HISTORY_MESSAGES = 4;

const CHATBOT_INSTRUCTIONS = `
You are IntervueAI, an interview preparation coach.
Help users prepare for technical and behavioral interviews.
Be concise, practical, and encouraging.
Focus on interview prep, coding concepts, DSA, system design, resume advice, mock interview answers, and study plans.
Keep answers short by default, usually under 120 words unless the user asks for detail.
When useful, suggest one follow-up practice question or one next step.
`;

const stripCodeFences = (text) =>
  text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

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

const callOllamaChat = async ({ messages, format }) => {
  let response;

  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      stream: false,
      keep_alive: "30m",
      options: {
        num_predict: 96,
        temperature: 0.3,
      },
      ...(format ? { format } : {}),
    }),
  });
  } catch (error) {
    const connectionError = new Error(
      `Could not connect to Ollama at ${OLLAMA_BASE_URL}. Please start Ollama and pull the model "${DEFAULT_MODEL}".`
    );
    connectionError.statusCode = 503;
    throw connectionError;
  }

  const rawResponse = await response.text();
  let payload = {};

  if (rawResponse) {
    try {
      payload = JSON.parse(rawResponse);
    } catch (parseError) {
      payload = { raw: rawResponse };
    }
  }

  if (!response.ok) {
    const message =
      payload?.error ||
      payload?.message ||
      payload?.raw ||
      "Ollama request failed while generating a response";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  return payload;
};

exports.chatWithCoach = async (req, res, next) => {
  try {
    const history = sanitizeMessages(req.body.messages).slice(-MAX_HISTORY_MESSAGES);
    const latestMessage =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!latestMessage) {
      return res.status(400).json({ message: "A message is required" });
    }

    const response = await callOllamaChat({
      messages: [
        { role: "system", content: CHATBOT_INSTRUCTIONS.trim() },
        ...history,
        { role: "user", content: latestMessage },
      ],
    });

    res.status(200).json({
      success: true,
      reply: response?.message?.content?.trim() || "",
      model: DEFAULT_MODEL,
    });
  } catch (error) {
    next(error);
  }
};

exports.generateInterviewQuestions = async (req, res, next) => {
  try {
    const category =
      typeof req.body.category === "string" && req.body.category.trim()
        ? req.body.category.trim()
        : "software engineering";
    const difficulty =
      typeof req.body.difficulty === "string" && req.body.difficulty.trim()
        ? req.body.difficulty.trim()
        : "medium";
    const requestedCount = Number(req.body.count) || 5;
    const count = Math.min(Math.max(requestedCount, 1), 10);

    const response = await callOllamaChat({
      messages: [
        {
          role: "system",
          content:
            'Return only valid JSON with no markdown fences. The format must be {"questions":["question 1","question 2"]}.',
        },
        {
          role: "user",
          content: `Generate ${count} ${difficulty} interview questions for ${category}. Keep each question clear and interview-ready.`,
        },
      ],
      format: "json",
    });

    const parsed = JSON.parse(stripCodeFences(response?.message?.content || ""));
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

    res.status(200).json({
      success: true,
      questions,
      model: DEFAULT_MODEL,
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

    const response = await callOllamaChat({
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
    });

    res.status(200).json({
      success: true,
      explanation: response?.message?.content?.trim() || "",
      model: DEFAULT_MODEL,
    });
  } catch (error) {
    next(error);
  }
};
