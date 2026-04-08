import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="login-screen">
      <section className="login-card">
        <img className="brand-wordmark" src="/images/sharedcare-logo-blue.png" alt="SharedCare" />
        <p className="eyebrow">Staff Portal</p>
        <h1 className="page-title page-title--compact">Mock Login</h1>
        <p className="login-copy">
          This capstone build still uses mock behavior only. Enter the dashboard to review the
          caregiver flow without backend authentication.
        </p>

        <div className="login-actions">
          <button className="login-button" type="button" onClick={() => navigate("/")}>
            Enter Dashboard
          </button>
          <Link className="ghost-link" to="/residents">
            Go to Residents
          </Link>
        </div>
      </section>
    </main>
  );
}
