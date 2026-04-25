import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LuArrowUp,
  LuBot,
  LuBriefcaseBusiness,
  LuCircleCheckBig,
  LuClock3,
  LuLoaderCircle,
  LuMessagesSquare,
} from "react-icons/lu";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { API_BASE_URL, apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const MAX_HISTORY_MESSAGES = 4;

const starterQuestions = [
  "Give me a frontend interview question with an ideal answer.",
  "How should I answer 'Tell me about yourself' for campus placements?",
  "Create a 7-day DSA revision plan for product companies.",
  "Ask me one SQL joins question and then evaluate my answer.",
];

const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatBot() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const autoPrompt = searchParams.get("prompt");
  const [sessionDetails, setSessionDetails] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to InterVue Coach. I can help with technical interviews, HR rounds, project explanations, resume stories, DSA plans, and mock answers.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");
  const messagesEndRef = useRef(null);
  const lastAutoPromptRef = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        setSessionDetails(null);
        setSessionError("");
        return;
      }

      try {
        const response = await apiRequest(`/api/sessions/${sessionId}`, {
          token,
        });
        setSessionDetails(response.session);
        setSessionError("");
      } catch (requestError) {
        setSessionDetails(null);
        setSessionError(requestError.message);
      }
    };

    loadSession();
  }, [sessionId, token]);

  useEffect(() => {
    if (!autoPrompt || loading || lastAutoPromptRef.current === autoPrompt) {
      return;
    }

    lastAutoPromptRef.current = autoPrompt;
    sendMessage(autoPrompt);
  }, [autoPrompt, loading]);

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const nextMessages = [
      ...messages,
      { role: "user", content: trimmedMessage, time: formatTime() },
    ];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          messages: messages.slice(-MAX_HISTORY_MESSAGES),
        }),
      });

      const rawResponse = await response.text();
      const data = rawResponse ? JSON.parse(rawResponse) : {};

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch a reply right now.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply || "I could not generate a reply this time.",
          time: formatTime(),
        },
      ]);
    } catch (requestError) {
      if (requestError instanceof SyntaxError) {
        setError("The server returned an unreadable response. Please check the backend logs.");
      } else {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <DashboardLayout
      description="Ask concise interview questions, practice mock answers, and keep the coach aligned with your active session."
      title="Coach workspace"
    >
      {sessionError ? <div className="alert-error mb-6">{sessionError}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <LuBot size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">Coach mode</p>
                <p className="text-xs text-slate-500">Short, interview-ready replies</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <LuBriefcaseBusiness className="mt-0.5 text-sky-600" size={16} />
                <p>Use it for mock interviews, project explanations, and role-specific prep.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <LuMessagesSquare className="mt-0.5 text-sky-600" size={16} />
                <p>Only recent context is kept so replies stay focused and faster.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <LuClock3 className="mt-0.5 text-sky-600" size={16} />
                <p>Short, specific prompts usually lead to better interview-style answers.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Current context
                </h2>
                <p className="mt-3 text-lg font-semibold text-slate-950">
                  {sessionDetails?.role || "General interview preparation"}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                <LuCircleCheckBig size={16} />
                Coach ready
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Topics</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {sessionDetails?.topics || "Resume stories, DSA, CS fundamentals, behavioral answers"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Experience</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {sessionDetails?.experience || "Use this space for broad preparation or quick practice."}
                </p>
              </div>
              {sessionDetails ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-sky-100 bg-[linear-gradient(180deg,#f4fbff_0%,#eef8ff_100%)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Questions</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                      {sessionDetails.questions}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Status</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {sessionDetails.status?.charAt(0).toUpperCase()}
                      {sessionDetails.status?.slice(1) || "Active"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  Open coach conversation
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Quick prompts</h2>
            <div className="mt-4 space-y-3">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm leading-6 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-slate-900"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
          <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-slate-950">Conversation</h2>
                  <p className="text-xs leading-6 text-slate-500">
                    Ask concise questions to get faster interview-focused answers.
                  </p>
                </div>
              </div>
            </div>

          <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4 sm:px-5">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[20px] px-4 py-3 shadow-sm sm:max-w-[78%] ${
                      message.role === "user"
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-4">
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                          message.role === "user" ? "text-slate-300" : "text-sky-600"
                        }`}
                      >
                        {message.role === "user" ? "You" : "InterVue Coach"}
                      </span>
                      <span className="text-xs text-slate-400">{message.time}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-[13px] leading-6 sm:text-sm">{message.content}</p>
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <LuLoaderCircle className="animate-spin" size={16} />
                    Generating answer...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
            {error ? <div className="alert-error mb-4">{error}</div> : null}

            <form className="mx-auto max-w-3xl" onSubmit={handleSubmit}>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-2.5 shadow-inner">
                <div className="flex flex-col gap-2.5 md:flex-row md:items-end">
                  <textarea
                    className="min-h-[72px] flex-1 resize-none rounded-[18px] border border-white bg-white px-4 py-3 text-[13px] leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 sm:text-sm"
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask a technical, HR, project, or resume interview question..."
                    rows="2"
                    value={input}
                  />
                  <button
                    className="btn-primary h-11 justify-center rounded-[18px] px-5"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? "Sending..." : "Send"}
                    <LuArrowUp size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
