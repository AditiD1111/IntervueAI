import { useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import AuthShell from "../components/auth/AuthShell";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export default function Signup() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        },
      });

      setSession({
        token: response.token,
        user: response.user,
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      alternateActionLabel="Log in instead"
      alternateActionTo="/login"
      alternatePrompt="Already have an account?"
      badge="Create Account"
      subtitle="Set up your workspace in a few seconds, then head straight into your dashboard and interview prep sessions."
      title="Create a clean, reliable prep account."
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Start here</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Sign up</h2>
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Your email is validated before submission, and successful sign-up takes you directly into the app.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="form-label" htmlFor="name">
            Full name
          </label>
          <input
            autoComplete="name"
            className="form-input"
            id="name"
            name="name"
            onChange={updateField}
            placeholder="Aarav Sharma"
            type="text"
            value={form.name}
          />
          {errors.name ? <p className="form-error">{errors.name}</p> : null}
        </div>

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

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="new-password"
              className="form-input"
              id="password"
              name="password"
              onChange={updateField}
              placeholder="Minimum 8 characters"
              type="password"
              value={form.password}
            />
            {errors.password ? <p className="form-error">{errors.password}</p> : null}
          </div>

          <div>
            <label className="form-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              autoComplete="new-password"
              className="form-input"
              id="confirmPassword"
              name="confirmPassword"
              onChange={updateField}
              placeholder="Re-enter password"
              type="password"
              value={form.confirmPassword}
            />
            {errors.confirmPassword ? <p className="form-error">{errors.confirmPassword}</p> : null}
          </div>
        </div>

        {serverError ? <div className="alert-error">{serverError}</div> : null}

        <button className="btn-primary w-full justify-center" disabled={loading} type="submit">
          {loading ? (
            <>
              <LuLoaderCircle className="animate-spin" size={16} />
              Creating your account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthShell>
  );
}
