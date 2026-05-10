import { Link } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { familyData } from "../data/mockData";

const pageCopy = {
  dailyLogs: {
    eyebrow: "Overview",
    title: "Overview",
    description:
      "Family-friendly daily updates will appear here with simple summaries from the care team."
  },
  scheduling: {
    eyebrow: "Scheduling",
    title: "Appointments",
    description:
      "Upcoming visits and appointment requests will be shown here once family scheduling is connected."
  },
  messages: {
    eyebrow: "Messages",
    title: "Message Care Team",
    description:
      "A simplified message thread with the care team will live here for family communication."
  }
};

export default function FamilyPlaceholderPage({ page }) {
  const content = pageCopy[page];

  return (
    <FamilyAppShell>
      <section className="family-placeholder-panel">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1 className="page-title page-title--compact">{content.title}</h1>
        <p className="family-placeholder-resident">
          {familyData.resident.name} · {familyData.resident.room}
        </p>
        <p className="family-placeholder-copy">{content.description}</p>
        <Link className="family-placeholder-link" to="/family">
          Back to family dashboard
        </Link>
      </section>
    </FamilyAppShell>
  );
}
