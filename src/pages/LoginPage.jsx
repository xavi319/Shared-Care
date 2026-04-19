import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/AuthProvider";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [userId, password, errorMessage]);

  if (!isLoading && isAuthenticated) {
    const nextPath = location.state?.from || "/";
    return <Navigate to={nextPath} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await login(userId, password);

    if (result.success) {
      const nextPath = location.state?.from || "/";
      navigate(nextPath, { replace: true });
      return;
    }

    setErrorMessage(result.message);
    setIsSubmitting(false);
  }

  return (
    <main className="login-screen">
      <section className="login-card">
        <img className="brand-wordmark" src="/images/sharedcare-logo-blue.png" alt="SharedCare" />
        <p className="eyebrow">Staff Portal</p>
        <h1 className="page-title page-title--compact">Welcome back</h1>
        <p className="login-copy">Sign in to continue to the SharedCare caregiver dashboard.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-label">ID</span>
            <input
              className="login-input"
              type="email"
              autoComplete="username"
              placeholder="sarah@sharedcare.com"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </label>

          <label className="login-field">
            <span className="login-label">Password</span>
            <input
              className="login-input"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <p className={`login-error${errorMessage ? " is-visible" : ""}`} aria-live="polite">
            {errorMessage}
          </p>

          <div className="login-actions">
            <button className="login-button" type="submit">
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
