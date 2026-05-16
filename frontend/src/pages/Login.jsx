import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import AuthShell from "../components/auth/AuthShell";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
    setServerError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: {
          email: form.email.trim(),
          password: form.password,
        },
      });

      setSession({
        token: response.token,
        user: response.user,
      });

      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      alternateActionLabel="Create one now"
      alternateActionTo="/signup"
      alternatePrompt="New to InterVue AI?"
      badge="Sign In"
      subtitle="Access your interview sessions, continue your prep, and jump back into coach mode with a clean, reliable login flow."
      title="Welcome back to your prep workspace."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Account access</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Log in</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Use the email address tied to your account. After login, you will land directly on your dashboard.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="form-input"
            id="email"
            name="email"
            onChange={updateField}
            placeholder="you@example.com"
            type="email"
            value={form.email}
          />
          {errors.email ? <p className="form-error">{errors.email}</p> : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <span className="text-xs text-slate-400">Minimum 8 characters</span>
          </div>
          <input
            autoComplete="current-password"
            className="form-input"
            id="password"
            name="password"
            onChange={updateField}
            placeholder="Enter your password"
            type="password"
            value={form.password}
          />
          {errors.password ? <p className="form-error">{errors.password}</p> : null}
        </div>

        {serverError ? <div className="alert-error">{serverError}</div> : null}

        <button className="btn-primary w-full justify-center" disabled={loading} type="submit">
          {loading ? (
            <>
              <LuLoaderCircle className="animate-spin" size={16} />
              Logging you in...
            </>
          ) : (
            "Log in"
          )}
        </button>

        <p className="text-sm leading-7 text-slate-500">
          Need a new account instead?{" "}
          <Link className="font-semibold text-slate-950 transition hover:text-sky-600" to="/signup">
            Sign up here
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
