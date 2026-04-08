import { Link } from "react-router-dom";

import { StaffAppShell } from "../components/layout/StaffAppShell";

export default function NotFoundPage({
  title = "Page Not Found",
  description = "The page you requested is not available in this SharedCare mock app yet.",
  actionLabel = "Back to dashboard",
  actionTo = "/"
}) {
  return (
    <StaffAppShell>
      <section className="not-found-panel">
        <p className="eyebrow">SharedCare</p>
        <h1 className="page-title page-title--compact">{title}</h1>
        <p className="not-found-copy">{description}</p>
        <Link className="login-button login-button--inline" to={actionTo}>
          {actionLabel}
        </Link>
      </section>
    </StaffAppShell>
  );
}
