import { useEffect, useMemo, useState } from "react";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { familyData, loadDailyLogEntries } from "../data/mockData";

const moodEmojiByValue = {
  Good: "😊",
  Neutral: "😐",
  Irritable: "😣",
  Withdrawn: "😔",
  Confused: "😕"
};

function getTimestamp(value) {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? Number.NEGATIVE_INFINITY : date.getTime();
}

function formatLogDate(value) {
  if (!value) {
    return "Date not shared yet";
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function getMoodSentence(residentName, mood) {
  const emoji = moodEmojiByValue[mood] ?? "🙂";

  if (!mood) {
    return `${residentName}'s mood has not been shared yet ${emoji}`;
  }

  const moodTextByValue = {
    Good: "in a good mood",
    Neutral: "feeling steady",
    Irritable: "a little irritable",
    Withdrawn: "more withdrawn than usual",
    Confused: "a bit confused"
  };

  return `${residentName} seemed to be ${moodTextByValue[mood] ?? mood.toLowerCase()} today ${emoji}`;
}

function getMealSentence(residentName, meals) {
  if (!meals) {
    return "Meal details have not been shared yet.";
  }

  const mealTextByValue = {
    "Ate well": `${residentName} ate well today.`,
    "Ate moderately": `${residentName} ate a moderate amount today.`,
    "Ate poorly": `${residentName} did not eat much today.`,
    "Refused meals": `${residentName} refused meals today.`
  };

  return mealTextByValue[meals] ?? `${residentName}'s meal update: ${meals}.`;
}

function getActivitySentence(residentName, activityEngagement) {
  if (!activityEngagement) {
    return "Activity details have not been shared yet.";
  }

  const activityTextByValue = {
    "Fully Engaged": `${residentName} was fully engaged in activities.`,
    "Moderately Engaged": `${residentName} participated in some activities.`,
    Disinterested: `${residentName} was less interested in activities today.`,
    "Did Not Engage": `${residentName} did not join activities today.`
  };

  return activityTextByValue[activityEngagement] ?? `${residentName}'s activity update: ${activityEngagement}.`;
}

function getAssistanceSentence(residentName, assistanceLevel) {
  if (!assistanceLevel) {
    return "Assistance details have not been shared yet.";
  }

  const assistanceTextByValue = {
    Independent: `${residentName} handled most care needs independently.`,
    "Partial Assist": `${residentName} needed some help from staff.`,
    "Full Assist": `${residentName} needed full staff support.`,
    "Declined Assistance": `${residentName} declined some assistance today.`
  };

  return assistanceTextByValue[assistanceLevel] ?? `${residentName}'s assistance update: ${assistanceLevel}.`;
}

function getSummarySentence(entry, residentName) {
  if (entry.notes) {
    return entry.notes;
  }

  return [
    getMoodSentence(residentName, entry.mood),
    getMealSentence(residentName, entry.meals),
    getActivitySentence(residentName, entry.activityEngagement)
  ].join(" ");
}

function FamilyUpdateCard({ entry, residentName, isFeatured }) {
  const detailItems = [
    { label: "Mood", value: getMoodSentence(residentName, entry.mood) },
    { label: "Meals", value: getMealSentence(residentName, entry.meals) },
    {
      label: "Activity & Engagement",
      value: getActivitySentence(residentName, entry.activityEngagement)
    },
    {
      label: "Assistance Level",
      value: getAssistanceSentence(residentName, entry.assistanceLevel)
    }
  ];

  return (
    <article className={`family-log-card${isFeatured ? " family-log-card--featured" : ""}`}>
      <div className="family-log-card-topline">
        <p className="family-log-date">{formatLogDate(entry.date)}</p>
        {entry.caregiver ? <p className="family-log-staff">Updated by {entry.caregiver}</p> : null}
      </div>

      <p className="family-log-summary">{getSummarySentence(entry, residentName)}</p>

      <div className="family-log-detail-grid">
        {detailItems.map((item) => (
          <div key={item.label} className="family-log-detail">
            <span>{item.label}</span>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="family-log-notes">
        <h3>Notes & Summary</h3>
        <p>{entry.notes || "No additional notes were shared for this update."}</p>
      </div>
    </article>
  );
}

function FamilyLogsControls({ updateCount }) {
  return (
    <div className="family-logs-controls" aria-label="Daily log display controls">
      <div className="family-logs-control-group" aria-label="Filter daily updates">
        <button className="family-logs-control family-logs-control--active" type="button">
          All updates
        </button>
        <button className="family-logs-control" type="button">
          Notes
        </button>
        <button className="family-logs-control" type="button">
          Care changes
        </button>
      </div>
      <div className="family-logs-sort">
        <span>{updateCount} updates</span>
        <span>Newest first</span>
      </div>
    </div>
  );
}

export default function FamilyDailyLogsPage() {
  const { resident } = familyData;
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      const bethEntries = loadDailyLogEntries()
        .filter((entry) => entry.residentId === resident.id)
        .sort((firstEntry, secondEntry) => getTimestamp(secondEntry.date) - getTimestamp(firstEntry.date));

      setEntries(bethEntries);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [resident.id]);

  const latestEntry = entries[0];
  const pastEntries = useMemo(() => entries.slice(1), [entries]);

  return (
    <FamilyAppShell>
      <section className="family-logs-header">
        <div>
          <p className="eyebrow">Daily Logs</p>
          <h1 className="page-title page-title--compact">Past Updates</h1>
          <p className="family-logs-resident">
            {resident.name} · {resident.room}
          </p>
        </div>
      </section>

      {status === "loading" ? (
        <section className="family-log-state">Loading Beth’s daily updates...</section>
      ) : null}

      {status === "error" ? (
        <section className="family-log-state">Daily updates are unavailable right now.</section>
      ) : null}

      {status === "ready" && !entries.length ? (
        <section className="family-log-state">No daily updates have been shared yet.</section>
      ) : null}

      {status === "ready" && latestEntry ? (
        <section className="family-logs-stack" aria-label="Beth Adams daily updates">
          <FamilyLogsControls updateCount={entries.length} />

          <div className="family-logs-section-heading">
            <p className="family-card-label">Latest Summary</p>
          </div>
          <FamilyUpdateCard entry={latestEntry} residentName={resident.name} isFeatured />

          {pastEntries.length ? (
            <>
              <div className="family-logs-section-heading">
                <p className="family-card-label">Previous Updates</p>
              </div>
              {pastEntries.map((entry) => (
                <FamilyUpdateCard
                  key={`${entry.residentId}-${entry.date}`}
                  entry={entry}
                  residentName={resident.name}
                />
              ))}
            </>
          ) : null}
        </section>
      ) : null}
    </FamilyAppShell>
  );
}
