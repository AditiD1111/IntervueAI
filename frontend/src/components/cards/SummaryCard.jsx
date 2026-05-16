const statusTheme = {
  active: {
    accent: "from-sky-500 to-cyan-400",
    label: "Active",
  },
  completed: {
    accent: "from-emerald-500 to-teal-400",
    label: "Completed",
  },
  draft: {
    accent: "from-amber-500 to-orange-400",
    label: "Draft",
  },
};

export default function SummaryCard({
  role,
  topics,
  experience,
  questions,
  updated,
  status = "active",
  onOpenCoach,
  onOpenQuestions,
  onEdit,
  onEnd,
}) {
  const theme = statusTheme[status] || statusTheme.active;

  return (
    <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
      <div className={`h-2 w-full bg-gradient-to-r ${theme.accent}`} />

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
              Interview track
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950">{role}</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {theme.label}
          </span>
        </div>

        <p className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">{topics}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
            <p className="text-slate-500">Experience</p>
            <p className="mt-1 font-semibold text-slate-950">{experience}</p>
          </div>
          <div className="rounded-[24px] border border-sky-100 bg-[linear-gradient(180deg,#f4fbff_0%,#eef8ff_100%)] p-4">
            <p className="text-slate-500">Questions</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{questions}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
              Question target
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-slate-500">Updated {updated}</p>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary justify-center" onClick={onOpenQuestions} type="button">
              View questions
            </button>
            <button className="btn-primary justify-center" onClick={onOpenCoach} type="button">
              Open in coach
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-secondary justify-center" onClick={onEdit} type="button">
              Edit session
            </button>
            <button
              className="btn-secondary justify-center"
              disabled={status !== "active"}
              onClick={onEnd}
              type="button"
            >
              {status === "active" ? "End session" : "Session ended"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
