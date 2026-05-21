import { useEffect, useState } from "react";
import { LuLoaderCircle, LuPin, LuPinOff, LuShuffle } from "react-icons/lu";

export default function SessionQuestionsModal({
  isOpen,
  session,
  questions,
  viewedIds,
  loading,
  onClose,
  onRevealAnswer,
  onEditSession,
  onEndSession,
  onPin,
  onUnpin,
  onShuffle,
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const visibleQuestions = questions.slice(0, 10);
  const viewedCount = visibleQuestions.filter((q) => viewedIds.includes(q.id)).length;
  const allViewed = visibleQuestions.length > 0 && viewedCount === visibleQuestions.length;

  useEffect(() => {
    setOpenIndex(0);
    setShowAnswer(false);
  }, [session?.id, questions]);

  if (!isOpen || !session) {
    return null;
  }

  const currentQuestion = visibleQuestions[openIndex];

  const handleSelect = (index) => {
    setOpenIndex(index);
    setShowAnswer(false);
  };

  const handleRevealAnswer = () => {
    if (!currentQuestion) return;
    setShowAnswer(true);
    onRevealAnswer(currentQuestion.id);
  };

  const handleTogglePin = (event, question) => {
    event.stopPropagation();
    if (question.isPinned) {
      onUnpin(question.id);
    } else {
      onPin(question.id);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="mx-4 w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Question Set</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              {session.role} interview set
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              10 questions for <span className="font-semibold text-slate-700">{session.experience}</span>{" "}
              based on <span className="font-semibold text-slate-700">{session.topics}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-sm text-slate-500 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
              onClick={onShuffle}
              title="Shuffle non-pinned questions"
              type="button"
            >
              <LuShuffle size={16} />
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              onClick={onClose}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            Viewed answers: <span className="font-semibold text-slate-950">{viewedCount}/10</span>
          </div>
          <div className="rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm text-sky-800">
            Status: <span className="font-semibold">{allViewed || session.status === "completed" ? "Completed" : "Active"}</span>
          </div>
          {visibleQuestions.some((q) => q.isPinned) ? (
            <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
              <LuPin size={12} className="mr-1 inline-block" />
              <span className="font-semibold">{visibleQuestions.filter((q) => q.isPinned).length}</span> pinned
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 text-slate-500">
              <LuLoaderCircle className="animate-spin" size={18} />
              Loading questions...
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="max-h-[420px] overflow-y-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {visibleQuestions.map((item, index) => {
                  const isOpenCard = openIndex === index;
                  const isViewed = viewedIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      className={`group relative rounded-[20px] border p-4 text-left transition ${
                        isOpenCard
                          ? "border-sky-200 bg-[linear-gradient(180deg,#f5fbff_0%,#edf8ff_100%)] shadow-[0_12px_30px_rgba(14,165,233,0.10)]"
                          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50"
                      } ${item.isPinned ? "ring-2 ring-amber-300/50" : ""}`}
                      onClick={() => handleSelect(index)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                            Q{index + 1}
                          </p>
                          {item.isPinned ? (
                            <LuPin size={12} className="text-amber-600" />
                          ) : null}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`rounded-2xl border p-1.5 text-slate-400 transition hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 ${
                              item.isPinned ? "text-amber-600 border-amber-300 bg-amber-50" : "border-transparent opacity-0 group-hover:opacity-100"
                            }`}
                            onClick={(e) => handleTogglePin(e, item)}
                            role="button"
                            tabIndex={0}
                            title={item.isPinned ? "Unpin question" : "Pin question"}
                          >
                            {item.isPinned ? <LuPinOff size={13} /> : <LuPin size={13} />}
                          </span>
                          {isViewed ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                              Viewed
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-800">
                        {isOpenCard ? item.question : `Open question ${index + 1}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              {currentQuestion ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                      Question {currentQuestion.number}
                    </p>
                    {currentQuestion.isPinned ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                        Pinned
                      </span>
                    ) : null}
                    {currentQuestion.theme ? (
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                        {currentQuestion.theme}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-8 text-slate-950">
                    {currentQuestion.question}
                  </h3>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="btn-primary" onClick={handleRevealAnswer} type="button">
                      {viewedIds.includes(currentQuestion.id) ? "View answer again" : "See answer"}
                    </button>
                    <button
                      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                        currentQuestion.isPinned
                          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                      onClick={(e) => handleTogglePin(e, currentQuestion)}
                      type="button"
                    >
                      {currentQuestion.isPinned ? <LuPinOff size={15} /> : <LuPin size={15} />}
                      {currentQuestion.isPinned ? "Unpin" : "Pin"}
                    </button>
                    <button className="btn-secondary" onClick={onEditSession} type="button">
                      Edit session
                    </button>
                    <button
                      className="btn-secondary"
                      disabled={session.status !== "active"}
                      onClick={onEndSession}
                      type="button"
                    >
                      {session.status === "active" ? "End active session" : "Session ended"}
                    </button>
                  </div>

                  {showAnswer ? (
                    <div className="mt-5 rounded-[20px] border border-sky-100 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Suggested answer</p>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{currentQuestion.answer}</p>
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[20px] border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
                      Reveal the answer to mark this question as viewed.
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
