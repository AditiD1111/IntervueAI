import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import BrandLogo from "../brand/BrandLogo";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "AI Coach", to: "/chat" },
];

export default function DashboardLayout({ description, title, children }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_20%),linear-gradient(180deg,#f8fbff_0%,#eef4fa_38%,#f8fafc_100%)] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/88 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <BrandLogo />
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{description}</p>
          </div>

          <div className="flex flex-col gap-4 lg:min-w-[360px] lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <nav className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-50 p-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    `inline-flex min-w-[118px] justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-white hover:text-slate-950"
                    }`
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
              </nav>

              <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-3 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "I"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.name || "InterVue User"}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button className="btn-secondary whitespace-nowrap px-5 py-2.5" onClick={handleLogout} type="button">
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
