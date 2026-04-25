import { Link } from "react-router-dom";

const toneClasses = {
  light: {
    container: "text-slate-950",
    mark: "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]",
    label: "text-slate-500",
    name: "text-slate-950",
  },
  dark: {
    container: "text-white",
    mark: "bg-white/10 text-white backdrop-blur",
    label: "text-sky-200/80",
    name: "text-white",
  },
};

export default function BrandLogo({ tone = "light" }) {
  const palette = toneClasses[tone] || toneClasses.light;

  return (
    <Link className={`inline-flex items-center gap-3 ${palette.container}`} to="/">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.18em] ${palette.mark}`}
      >
        IV
      </span>
      <span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.3em] ${palette.label}`}>
          Interview Platform
        </span>
        <span className={`mt-1 block text-lg font-semibold tracking-tight ${palette.name}`}>InterVue AI</span>
      </span>
    </Link>
  );
}
