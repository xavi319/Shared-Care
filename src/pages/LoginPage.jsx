import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../components/auth/AuthProvider";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [userId, password, errorMessage]);

  if (isAuthenticated) {
    const nextPath = location.state?.from || "/";
    return <Navigate to={nextPath} replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = login(userId, password);

    if (result.success) {
      const nextPath = location.state?.from || "/";
      navigate(nextPath, { replace: true });
      return;
    }

    setErrorMessage(result.message);
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
              Log In
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
