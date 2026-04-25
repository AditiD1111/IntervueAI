import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuCirclePlus, LuFolderPlus, LuLoaderCircle, LuMessageSquareMore } from "react-icons/lu";
import SummaryCard from "../components/cards/SummaryCard";
import DashboardLayout from "../components/layouts/DashboardLayout";
import CreateSessionModal from "../components/dashboard/CreateSessionModal";
import SessionQuestionsModal from "../components/dashboard/SessionQuestionsModal";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { buildSessionQuestionSet } from "../lib/sessionQuestionSet";

const PROGRESS_STORAGE_KEY = "intervueai.questionProgress";

const initialFormState = {
  roleOption: "",
  role: "",
  topics: "",
  experience: "0-1 years",
  questions: "10",
};

const readProgress = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

const formatUpdatedDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const buildCoachPrompt = (session) =>
  `${session.questions} questions on topics ${session.topics} for the role ${session.role}`;

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [questionModalSession, setQuestionModalSession] = useState(null);
  const [questionProgress, setQuestionProgress] = useState(readProgress);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(questionProgress));
    }
  }, [questionProgress]);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest("/api/sessions", {
          token,
        });
        setSessions(response.sessions || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  const quickStats = useMemo(() => {
    const totalQuestions = sessions.reduce((sum, session) => sum + Number(session.questions || 0), 0);
    const activeSessions = sessions.filter((session) => session.status === "active").length;

    return [
      { label: "Saved sessions", value: sessions.length.toString().padStart(2, "0") },
      { label: "Active tracks", value: activeSessions.toString().padStart(2, "0") },
      { label: "Planned questions", value: totalQuestions.toString().padStart(2, "0") },
    ];
  }, [sessions]);

  const questionSet = useMemo(
    () => (questionModalSession ? buildSessionQuestionSet(questionModalSession) : []),
    [questionModalSession]
  );

  const viewedIndexes = questionModalSession
    ? questionProgress[questionModalSession.id]?.viewedIndexes || []
    : [];

  const updateForm = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!form.topics.trim()) {
      nextErrors.topics = "Topics are required.";
    }

    if (!form.experience.trim()) {
      nextErrors.experience = "Experience level is required.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openCreateModal = () => {
    setEditingSession(null);
    setForm(initialFormState);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (session) => {
    const commonRoles = [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Software Engineer",
      "DevOps Engineer",
      "Data Engineer",
      "Machine Learning Engineer",
      "QA Engineer",
      "Cloud Engineer",
      "Cybersecurity Engineer",
    ];

    setEditingSession(session);
    setForm({
      roleOption: commonRoles.includes(session.role) ? session.role : "other",
      role: session.role,
      topics: session.topics,
      experience: session.experience,
      questions: String(session.questions),
    });
    setFormErrors({});
    setShowModal(true);
  };

  const updateSessionRecord = async (sessionId, body) => {
    const response = await apiRequest(`/api/sessions/${sessionId}`, {
      method: "PUT",
      token,
      body,
    });

    setSessions((currentSessions) =>
      currentSessions.map((session) => (session.id === sessionId ? response.session : session))
    );

    return response.session;
  };

  const handleCreateOrEditSession = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        role: form.role.trim(),
        topics: form.topics.trim(),
        experience: form.experience,
        questions: Number(form.questions),
      };

      if (editingSession) {
        const updatedSession = await updateSessionRecord(editingSession.id, payload);
        setQuestionProgress((currentProgress) => ({
          ...currentProgress,
          [editingSession.id]: { viewedIndexes: [] },
        }));

        if (questionModalSession?.id === editingSession.id) {
          setQuestionModalSession(updatedSession);
        }
      } else {
        const response = await apiRequest("/api/sessions", {
          method: "POST",
          token,
          body: payload,
        });

        setSessions((currentSessions) => [response.session, ...currentSessions]);
      }

      setForm(initialFormState);
      setEditingSession(null);
      setShowModal(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCoach = (session) => {
    const prompt = buildCoachPrompt(session);
    navigate(`/chat?session=${session.id}&prompt=${encodeURIComponent(prompt)}`);
  };

  const handleViewQuestions = (session) => {
    setQuestionModalSession(session);
    setQuestionProgress((currentProgress) => ({
      ...currentProgress,
      [session.id]: currentProgress[session.id] || { viewedIndexes: [] },
    }));
  };

  const handleEndSession = async (session) => {
    if (session.status !== "active") {
      return;
    }

    try {
      const updatedSession = await updateSessionRecord(session.id, { status: "completed" });

      if (questionModalSession?.id === session.id) {
        setQuestionModalSession(updatedSession);
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleRevealAnswer = async (questionIndex) => {
    if (!questionModalSession) {
      return;
    }

    const sessionId = questionModalSession.id;
    const existing = questionProgress[sessionId]?.viewedIndexes || [];

    if (existing.includes(questionIndex)) {
      return;
    }

    const nextViewed = [...existing, questionIndex].sort((left, right) => left - right);

    setQuestionProgress((currentProgress) => ({
      ...currentProgress,
      [sessionId]: {
        viewedIndexes: nextViewed,
      },
    }));

    if (nextViewed.length === questionSet.length && questionModalSession.status === "active") {
      try {
        const updatedSession = await updateSessionRecord(sessionId, { status: "completed" });
        setQuestionModalSession(updatedSession);
      } catch (requestError) {
        setError(requestError.message);
      }
    }
  };

  return (
    <DashboardLayout
      description="Track your interview roles, create focused prep workspaces, and jump into the AI coach from a cleaner dashboard."
      title={`Welcome${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
    >
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">Overview</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            Build interview sessions that are easy to revisit.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Save one workspace per role, keep the topic list crisp, and use the coach whenever you need
            quick follow-up practice.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={openCreateModal} type="button">
              <LuCirclePlus size={17} />
              Add new session
            </button>
            <button className="btn-secondary" onClick={() => navigate("/chat")} type="button">
              <LuMessageSquareMore size={17} />
              Go to AI coach
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {quickStats.map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {error ? <div className="alert-error mt-6">{error}</div> : null}

      <section className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Interview sessions</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Your saved workspaces</h2>
          </div>
          <button className="btn-secondary" onClick={openCreateModal} type="button">
            <LuFolderPlus size={17} />
            Create another
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex min-h-[260px] items-center justify-center rounded-[32px] border border-slate-200 bg-white">
            <div className="flex items-center gap-3 text-slate-500">
              <LuLoaderCircle className="animate-spin" size={18} />
              Loading your sessions...
            </div>
          </div>
        ) : null}

        {!loading && sessions.length === 0 ? (
          <div className="mt-8 rounded-[32px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">No sessions yet</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">Create your first interview workspace</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Start with one target role and a short list of topics. You can open the AI coach right after
              creating it.
            </p>
            <div className="mt-7 flex justify-center">
              <button className="btn-primary" onClick={openCreateModal} type="button">
                <LuCirclePlus size={17} />
                Add first session
              </button>
            </div>
          </div>
        ) : null}

        {!loading && sessions.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <SummaryCard
                experience={session.experience}
                key={session.id}
                onEdit={() => openEditModal(session)}
                onEnd={() => handleEndSession(session)}
                onOpenCoach={() => handleOpenCoach(session)}
                onOpenQuestions={() => handleViewQuestions(session)}
                questions={session.questions}
                role={session.role}
                status={session.status}
                topics={session.topics}
                updated={formatUpdatedDate(session.updatedAt)}
              />
            ))}
          </div>
        ) : null}
      </section>

      <CreateSessionModal
        errors={formErrors}
        form={form}
        isOpen={showModal}
        mode={editingSession ? "edit" : "create"}
        onChange={updateForm}
        onClose={() => {
          if (!submitting) {
            setShowModal(false);
            setEditingSession(null);
            setForm(initialFormState);
          }
        }}
        onSubmit={handleCreateOrEditSession}
        submitting={submitting}
      />

      <SessionQuestionsModal
        isOpen={Boolean(questionModalSession)}
        onClose={() => setQuestionModalSession(null)}
        onEditSession={() => {
          if (questionModalSession) {
            setQuestionModalSession(null);
            openEditModal(questionModalSession);
          }
        }}
        onEndSession={() => {
          if (questionModalSession) {
            handleEndSession(questionModalSession);
          }
        }}
        onRevealAnswer={handleRevealAnswer}
        questions={questionSet}
        session={questionModalSession}
        viewedIndexes={viewedIndexes}
      />
    </DashboardLayout>
  );
}
