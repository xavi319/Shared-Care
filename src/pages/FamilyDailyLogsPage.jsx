import { useEffect, useMemo, useState } from "react";
import {
  FaCircleExclamation,
  FaChevronDown,
  FaChevronRight,
  FaHandHoldingHeart,
  FaPeopleGroup,
  FaRegCircleCheck,
  FaRegCircleUser,
  FaRegClock,
  FaRegFaceSmile,
  FaRegNoteSticky,
  FaUtensils
} from "react-icons/fa6";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import {
  currentDemoStaffName,
  loadDailyLogEntries
} from "../data/mockData";
import { db } from "../lib/firebase";
import {
  getSubmittedDailyLogsForResident,
  listenToDailyLogsForResident
} from "../services/dailyLogService";
import {
  getFallbackFamilyResident,
  listenToResidentsForFamily,
  toFamilyResident
} from "../services/residentService";

const familyUserId = "family_robert_adams";

const moodEmojiByValue = {
  Good: "😊",
  Neutral: "😐",
  Irritable: "😣",
  Withdrawn: "😔",
  Confused: "😕"
};

function getLogTimestamp(entry) {
  return entry.createdAt ?? entry.date;
}

function getResidentFirstName(name) {
  return name.split(" ")[0] || name;
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

function formatPreviousLogDate(value) {
  if (!value) {
    return "Date not shared";
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    })
  };
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

function getMoodSummary(mood) {
  const moodTextByValue = {
    Good: "Good",
    Neutral: "Steady",
    Irritable: "Irritable",
    Withdrawn: "Withdrawn",
    Confused: "Confused"
  };

  return moodTextByValue[mood] ?? mood ?? "Not shared";
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

function getMealSummary(meals) {
  const mealTextByValue = {
    "Ate well": "Ate well",
    "Ate moderately": "Ate moderately",
    "Ate poorly": "Ate lightly",
    "Refused meals": "Refused meals"
  };

  return mealTextByValue[meals] ?? meals ?? "Not shared";
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

function getActivitySummary(activityEngagement) {
  const activityTextByValue = {
    "Fully Engaged": "Fully engaged",
    "Moderately Engaged": "Participated",
    Disinterested: "Less engaged",
    "Did Not Engage": "Did not join"
  };

  return activityTextByValue[activityEngagement] ?? activityEngagement ?? "Not shared";
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

function getAssistanceSummary(assistanceLevel) {
  const assistanceTextByValue = {
    Independent: "Independent",
    "Partial Assist": "Some help",
    "Full Assist": "Full support",
    "Declined Assistance": "Declined help"
  };

  return assistanceTextByValue[assistanceLevel] ?? assistanceLevel ?? "Not shared";
}

function getSummarySentence(entry, residentName) {
  if (entry.summary) {
    return entry.summary;
  }

  if (entry.notes) {
    return entry.notes;
  }

  return [
    getMoodSentence(residentName, entry.mood),
    getMealSentence(residentName, entry.meals),
    getActivitySentence(residentName, entry.activityEngagement)
  ].join(" ");
}

function getOverallSummary(entry, residentName) {
  const summary = getSummarySentence(entry, residentName);
  const firstSentence = summary.split(".")[0].trim();

  if (!firstSentence) {
    return "Update shared";
  }

  const withoutResidentName = firstSentence
    .replace(new RegExp(`^${residentName}\\s+`, "i"), "")
    .replace(/^had\s+/i, "")
    .replace(/^was\s+/i, "");

  return withoutResidentName.length > 24
    ? `${withoutResidentName.slice(0, 24).trim()}...`
    : withoutResidentName;
}

function isNegativeMood(mood) {
  return ["Irritable", "Withdrawn", "Confused"].includes(mood);
}

function getMoodTone(mood) {
  return isNegativeMood(mood) ? "concern" : "mood";
}

function getOverallTone(entry) {
  return isNegativeMood(entry.mood) ? "concern" : "overall";
}

function getOverallIcon(entry) {
  return isNegativeMood(entry.mood) ? FaCircleExclamation : FaRegCircleCheck;
}

function SummaryMetric({ icon: Icon, label, value, tone }) {
  return (
    <article className="family-log-metric">
      <span className={`family-log-metric-icon family-log-metric-icon--${tone}`}>
        <Icon aria-hidden="true" />
      </span>
      <div>
        <h2>{label}</h2>
        <p>{value}</p>
      </div>
    </article>
  );
}

function FamilyUpdateCard({ entry, residentName }) {
  const staffName = entry.staffName ?? entry.caregiverName ?? entry.caregiver ?? currentDemoStaffName;
  const summary = getSummarySentence(entry, residentName);
  const notesText = entry.notes && entry.notes !== summary ? entry.notes : "";
  const detailItems = [
    {
      label: "Mood",
      value: getMoodSentence(residentName, entry.mood),
      icon: FaRegFaceSmile,
      tone: getMoodTone(entry.mood)
    },
    {
      label: "Meals",
      value: getMealSentence(residentName, entry.meals),
      icon: FaUtensils,
      tone: "meals"
    },
    {
      label: "Activity & Engagement",
      value: getActivitySentence(residentName, entry.activityEngagement),
      icon: FaPeopleGroup,
      tone: "activity"
    },
    {
      label: "Assistance Level",
      value: getAssistanceSentence(residentName, entry.assistanceLevel),
      icon: FaHandHoldingHeart,
      tone: "assistance"
    }
  ];

  return (
    <article className="family-log-card family-log-card--featured">
      <div className="family-log-card-topline">
        <p className="family-log-date">
          <FaRegClock aria-hidden="true" />
          {formatLogDate(getLogTimestamp(entry))}
        </p>
        <p className="family-log-staff">
          <FaRegCircleUser aria-hidden="true" />
          Updated by {staffName}
        </p>
      </div>

      <p className="family-log-summary">{summary}</p>

      <div className="family-log-detail-grid">
        {detailItems.map((item) => (
          <div key={item.label} className="family-log-detail">
            <span className={`family-log-detail-icon family-log-detail-icon--${item.tone}`}>
              <item.icon aria-hidden="true" />
            </span>
            <div>
              <span>{item.label}</span>
              <p>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {notesText ? (
        <div className="family-log-notes">
          <FaRegNoteSticky aria-hidden="true" />
          <div>
            <h3>Notes</h3>
            <p>{notesText}</p>
          </div>
        </div>
      ) : null}
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
        <FaChevronDown aria-hidden="true" />
      </div>
    </div>
  );
}

function PreviousUpdateItem({ entry, residentName, isExpanded, onToggle }) {
  const formattedDate = formatPreviousLogDate(getLogTimestamp(entry));
  const summary = getSummarySentence(entry, residentName);
  const expandedDetails = [
    ["Mood", getMoodSummary(entry.mood)],
    ["Meals", getMealSummary(entry.meals)],
    ["Activity", getActivitySummary(entry.activityEngagement)],
    ["Assistance", getAssistanceSummary(entry.assistanceLevel)]
  ];

  return (
    <li className="family-log-timeline-item">
      <span className="family-log-timeline-dot" aria-hidden="true" />
      <button
        className="family-log-previous-card"
        type="button"
        aria-expanded={isExpanded}
        onClick={onToggle}
      >
        <span className="family-log-previous-date">
          {typeof formattedDate === "string" ? formattedDate : (
            <>
              {formattedDate.date}
              <small>{formattedDate.time}</small>
            </>
          )}
        </span>
        <span className="family-log-previous-summary">{summary}</span>
        <FaChevronRight aria-hidden="true" />
      </button>
      {isExpanded ? (
        <div className="family-log-previous-details">
          {expandedDetails.map(([label, value]) => (
            <p key={label}>
              <span>{label}</span>
              {value}
            </p>
          ))}
        </div>
      ) : null}
    </li>
  );
}

export default function FamilyDailyLogsPage() {
  const [resident, setResident] = useState(() => getFallbackFamilyResident(familyUserId));
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");
  const [expandedLogId, setExpandedLogId] = useState("");

  useEffect(() => {
    if (!db) {
      setResident(getFallbackFamilyResident(familyUserId));
      return undefined;
    }

    return listenToResidentsForFamily(
      db,
      familyUserId,
      (residents) => {
        setResident(residents[0] ? toFamilyResident(residents[0]) : getFallbackFamilyResident(familyUserId));
      },
      () => setResident(getFallbackFamilyResident(familyUserId))
    );
  }, []);

  useEffect(() => {
    if (!db) {
      const fallbackEntries = getSubmittedDailyLogsForResident(loadDailyLogEntries(), resident.id);
      setEntries(fallbackEntries);
      setStatus("ready");
      return undefined;
    }

    setStatus("loading");

    return listenToDailyLogsForResident(
      db,
      resident.id,
      (logs) => {
        setEntries(logs);
        setStatus("ready");
      },
      () => setStatus("error")
    );
  }, [resident.id]);

  const latestLog = entries[0];
  const previousLogs = useMemo(() => entries.slice(1), [entries]);
  const lastUpdated = latestLog ? formatLogDate(getLogTimestamp(latestLog)) : "";
  const summaryMetrics = latestLog
    ? [
        {
          label: "Overall",
          value: getOverallSummary(latestLog, resident.name),
          icon: getOverallIcon(latestLog),
          tone: getOverallTone(latestLog)
        },
        {
          label: "Mood",
          value: getMoodSummary(latestLog.mood),
          icon: FaRegFaceSmile,
          tone: getMoodTone(latestLog.mood)
        },
        {
          label: "Meals",
          value: getMealSummary(latestLog.meals),
          icon: FaUtensils,
          tone: "meals"
        },
        {
          label: "Activity",
          value: getActivitySummary(latestLog.activityEngagement),
          icon: FaPeopleGroup,
          tone: "activity"
        },
        {
          label: "Assistance",
          value: getAssistanceSummary(latestLog.assistanceLevel),
          icon: FaHandHoldingHeart,
          tone: "assistance"
        }
      ]
    : [];

  return (
    <FamilyAppShell>
      <section className="family-logs-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="page-title page-title--compact">{getResidentFirstName(resident.name)}&apos;s Daily Overview</h1>
          <p className="family-logs-resident">
            {resident.name} · {resident.room}
          </p>
          {lastUpdated ? (
            <p className="family-logs-last-updated">Last updated {lastUpdated}</p>
          ) : null}
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

      {status === "ready" && latestLog ? (
        <section className="family-logs-stack" aria-label="Beth Adams daily updates">
          <section className="family-log-summary-row" aria-label="Latest daily log status summary">
            {summaryMetrics.map((metric) => (
              <SummaryMetric key={metric.label} {...metric} />
            ))}
          </section>

          <FamilyLogsControls updateCount={entries.length} />

          <div className="family-logs-section-heading">
            <p className="family-card-label">Latest update</p>
          </div>
          <FamilyUpdateCard entry={latestLog} residentName={resident.name} />

          {previousLogs.length ? (
            <>
              <div className="family-logs-section-heading">
                <p className="family-card-label">Previous updates</p>
              </div>
              <ol className="family-log-timeline">
                {previousLogs.map((entry) => (
                  <PreviousUpdateItem
                    key={entry.id}
                    entry={entry}
                    residentName={resident.name}
                    isExpanded={expandedLogId === entry.id}
                    onToggle={() =>
                      setExpandedLogId((currentId) => (currentId === entry.id ? "" : entry.id))
                    }
                  />
                ))}
              </ol>
            </>
          ) : null}
        </section>
      ) : null}
    </FamilyAppShell>
  );
}
