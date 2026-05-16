import { Link } from "react-router-dom";
import { LuChartColumnBig, LuShieldCheck, LuSparkles } from "react-icons/lu";
import BrandLogo from "../brand/BrandLogo";

const highlights = [
  {
    icon: LuSparkles,
    title: "Focused prep flows",
    description: "Structured sessions for technical, product, and behavioral interview practice.",
  },
  {
    icon: LuChartColumnBig,
    title: "Cleaner progress tracking",
    description: "Keep your interview roles, topics, and practice count organized in one place.",
  },
  {
    icon: LuShieldCheck,
    title: "Reliable account flow",
    description: "Clear validation, stronger feedback, and predictable redirects after sign in.",
  },
];

export default function AuthShell({
  badge,
  title,
  subtitle,
  alternatePrompt,
  alternateActionLabel,
  alternateActionTo,
  children,
}) {
  return (
    <div className="auth-shell">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_36%),radial-gradient(circle_at_75%_20%,_rgba(20,184,166,0.18),_transparent_28%),linear-gradient(160deg,#020617_0%,#0f172a_54%,#0b1120_100%)]" />
          <div className="relative mx-auto flex h-full max-w-xl flex-col">
            <BrandLogo tone="dark" />

            <div className="mt-16">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-sky-100">
                {badge}
              </span>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="mt-12 grid gap-4">
              {highlights.map(({ icon: Icon, title: highlightTitle, description }) => (
                <div
                  key={highlightTitle}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-200">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">{highlightTitle}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#eef5fb_52%,#f8fafc_100%)] px-5 py-10 sm:px-8 lg:px-10">
          <div className="auth-panel w-full max-w-xl rounded-[32px] border border-white/80 bg-white/92 p-7 shadow-[0_28px_90px_rgba(2,6,23,0.12)] backdrop-blur sm:p-10">
            {children}

            <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
              {alternatePrompt}{" "}
              <Link
                className="font-semibold text-slate-950 transition hover:text-sky-600"
                to={alternateActionTo}
              >
                {alternateActionLabel}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
