import { useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { ChevronLeftIcon } from "../components/layout/icons";
import { familyData } from "../data/mockData";

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FamilyDashboardPage() {
  const navigate = useNavigate();
  const { resident } = familyData;
  const actionItems = [
    { label: "Past Updates", to: "/family/daily-logs", tone: "primary" },
    { label: "View More", to: "/family/daily-logs", tone: "secondary" },
    { label: "Appointments", to: "/family/scheduling", tone: "primary" },
    { label: "Message Care Team", to: "/family/messages", tone: "primary" }
  ];

  return (
    <FamilyAppShell>
      <section className="family-dashboard-header">
        <div>
          <p className="eyebrow">Resident</p>
          <h1 className="page-title page-title--compact" id="family-dashboard-title">
            {resident.name}
          </h1>
        </div>
        <button
          className="family-scheduling-back"
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back to staff dashboard"
        >
          <ChevronLeftIcon />
        </button>
      </section>

      <section className="family-dashboard-panel" aria-labelledby="family-dashboard-title">
        <div className="family-dashboard-summary">
          <div className="family-avatar" aria-label={`${resident.name} profile photo`}>
            {resident.image ? <img src={resident.image} alt={resident.name} /> : <span>{getInitials(resident.name)}</span>}
          </div>
          <div className="family-room-summary">
            <p className="family-room-value">{resident.room}</p>
            <p className="family-updated">Updated {resident.lastUpdated}</p>
          </div>
          <div className="family-status-summary">
            <p className="family-status-heading">Today’s Status</p>
            <p className="family-status-copy">{resident.status}</p>
          </div>
        </div>

        <div className="family-actions-grid" aria-label="Family actions">
          {actionItems.map((item) => (
            <button
              key={item.label}
              className={`family-action-button family-action-button--${item.tone}`}
              type="button"
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
    </FamilyAppShell>
  );
}
