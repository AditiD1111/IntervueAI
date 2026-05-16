import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BrandLogo from "../components/brand/BrandLogo";

const featureCards = [
  {
    title: "Structured Prep",
    description: "Follow a guided roadmap covering aptitude, DSA, and core CS fundamentals.",
  },
  {
    title: "Coding Practice",
    description: "Practice interview-level coding questions with clearer, faster revision loops.",
  },
  {
    title: "Interview Ready",
    description: "Prepare role-specific questions, polished answers, and confident talking points.",
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,#f8fbff_0%,#eef4fa_42%,#f8fafc_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_26%),radial-gradient(circle_at_80%_18%,_rgba(15,23,42,0.06),_transparent_24%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <BrandLogo />

          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              to={isAuthenticated ? "/dashboard" : "/login"}
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Link>
            <Link
              className="btn-primary rounded-full px-4 py-2 text-sm"
              to={isAuthenticated ? "/chat" : "/signup"}
            >
              {isAuthenticated ? "Open Coach" : "Sign Up"}
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">Interview Platform</p>
          <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Prepare Smart. Crack Interviews.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Get role-specific questions, expand answers when you need them, dive deeper into concepts,
            and organize everything inside one focused interview workspace.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            From preparation to mastery, your all-in-one interview toolkit is here.
          </p>

          <div className="mt-10">
            <Link
              className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm"
              to={isAuthenticated ? "/dashboard" : "/signup"}
            >
              Get Started
            </Link>
          </div>
        </section>

        <section className="grid gap-5 pb-10 md:grid-cols-3">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[28px] border border-slate-200 bg-white px-6 py-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
            >
              <h3 className="text-lg font-semibold text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">{card.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
