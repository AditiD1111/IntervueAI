const experienceOptions = ["Fresher", "0-1 years", "2-3 years", "4-6 years", "7+ years"];
const questionOptions = [5, 10, 15, 20];
const roleOptions = [
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

export default function CreateSessionModal({
  isOpen,
  mode = "create",
  form,
  errors,
  submitting,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  const selectRole = (role) => {
    onChange({
      target: {
        name: "roleOption",
        value: role,
      },
    });

    onChange({
      target: {
        name: "role",
        value: role === "other" ? "" : role,
      },
    });
  };

  const isCustomRole = form.roleOption === "other";
  const selectedPreset = roleOptions.includes(form.role) ? form.role : "";

  return (
    <div className="modal-backdrop">
      <div className="mx-4 w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
              {mode === "edit" ? "Edit Session" : "New Session"}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {mode === "edit" ? "Update interview prep workspace" : "Create an interview prep workspace"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              {mode === "edit"
                ? "Refine the role, topics, and question target so the session reflects your updated preparation plan."
                : "Add the role, key topics, and expected question count so your preparation stays organized from day one."}
            </p>
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-lg text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>

        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-2">
            <label className="form-label">Role</label>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-700">Choose a common engineering role</p>
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">Scroll</span>
              </div>

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {roleOptions.map((role) => {
                  const isSelected = selectedPreset === role && !isCustomRole;

                  return (
                    <button
                      key={role}
                      className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                        isSelected
                          ? "border-sky-200 bg-sky-100 text-slate-950 shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950"
                      }`}
                      onClick={() => selectRole(role)}
                      type="button"
                    >
                      {role}
                    </button>
                  );
                })}

                <button
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                    isCustomRole
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                  }`}
                  onClick={() => selectRole("other")}
                  type="button"
                >
                  Other
                </button>
              </div>

              {isCustomRole ? (
                <div className="mt-4">
                  <label className="form-label" htmlFor="role">
                    Custom role
                  </label>
                  <input
                    className="form-input"
                    id="role"
                    name="role"
                    onChange={onChange}
                    placeholder="Platform Engineer"
                    value={form.role}
                  />
                </div>
              ) : selectedPreset ? (
                <div className="mt-4 rounded-2xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-700">
                  Selected role: <span className="font-semibold text-slate-950">{selectedPreset}</span>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  Pick a role above or choose <span className="font-semibold text-slate-700">Other</span>.
                </div>
              )}
            </div>
            {errors.role ? <p className="form-error">{errors.role}</p> : null}
          </div>

          <div className="md:col-span-2">
            <label className="form-label" htmlFor="topics">
              Topics
            </label>
            <input
              className="form-input"
              id="topics"
              name="topics"
              onChange={onChange}
              placeholder="React, JavaScript, performance, accessibility"
              value={form.topics}
            />
            {errors.topics ? <p className="form-error">{errors.topics}</p> : null}
          </div>

          <div>
            <label className="form-label" htmlFor="experience">
              Experience
            </label>
            <select
              className="form-input"
              id="experience"
              name="experience"
              onChange={onChange}
              value={form.experience}
            >
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.experience ? <p className="form-error">{errors.experience}</p> : null}
          </div>

          <div>
            <label className="form-label" htmlFor="questions">
              Question count
            </label>
            <select
              className="form-input"
              id="questions"
              name="questions"
              onChange={onChange}
              value={form.questions}
            >
              {questionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button className="btn-secondary" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="btn-primary" disabled={submitting} type="submit">
              {submitting ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save changes" : "Create session"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
