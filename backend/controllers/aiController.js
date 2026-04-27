const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  try {
    return JSON.parse(content);
  } catch {
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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: CHATBOT_INSTRUCTIONS.trim() },
        ...history,
        { role: "user", content: latestMessage },
      ],
      temperature: 0.3,
      max_tokens: 96,
    });

    res.status(200).json({
      success: true,
      reply: response.choices?.[0]?.message?.content?.trim() || "",
      model: "gpt-3.5-turbo",
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

    const prompt = `Generate ${count} interview questions in JSON format for the category ${category} with difficulty ${difficulty}. ` +
      "Return an array of objects where each object has questionText, correctAnswer, and difficulty. " +
      "Example output: [{\"questionText\": \"...\", \"correctAnswer\": \"...\", \"difficulty\": \"...\"}]";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant that returns interview questions in valid JSON format.",
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

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      max_tokens: 500,
    });

    const explanation = response.choices?.[0]?.message?.content || "";

    res.status(200).json({
      success: true,
      explanation: explanation.trim(),
      model: "gpt-3.5-turbo",
    });
  } catch (error) {
    next(error);
  }
};
