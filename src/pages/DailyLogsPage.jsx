import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { SearchIcon, SortIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  dailyLogsPageData,
  dashboardData,
  loadDailyLogEntries,
  residentsPageData,
  updateDailyLogEntry
} from "../data/mockData";

const residentsById = new Map(
  [...dashboardData.residents, ...residentsPageData.residents].map((resident) => [resident.id, resident])
);

const moodToneByValue = {
  Good: "good",
  Calm: "good",
  Neutral: "neutral",
  Withdrawn: "caution",
  Confused: "caution",
  Irritable: "alert"
};

const statusMetaByValue = {
  completed: {
    label: "Completed",
    tone: "completed"
  },
  pending: {
    label: "Pending",
    tone: "pending"
  },
  missing: {
    label: "Needs log",
    tone: "attention"
  }
};

function getRowStatus(entry) {
  if (entry.reportStatus === "missing" || !entry.mood) {
    return "missing";
  }

  return entry.status === "completed" ? "completed" : "pending";
}

function getLogRows(entries) {
  return entries
    .map((entry) => {
      const resident = residentsById.get(entry.residentId);

      if (!resident) {
        return null;
      }

      return {
        ...entry,
        resident,
        detailHref: `/daily-logs/${entry.residentId}/submit`,
        moodTone: entry.mood ? (moodToneByValue[entry.mood] ?? "neutral") : "",
        rowStatus: getRowStatus(entry),
        actionTone: entry.actionTone ?? "default"
      };
    })
    .filter(Boolean);
}

function getTimestamp(value) {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  return new Date(value.replace(" ", "T")).getTime();
}

function formatLogDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value.replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

function getVisibleRows(rows, filters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return rows
    .filter((row) => {
      const matchesQuery =
        !normalizedQuery || row.resident.name.toLowerCase().includes(normalizedQuery);
      const matchesMood = filters.mood === "all" || row.mood === filters.mood;
      const matchesCaregiver =
        filters.caregiver === "all" || row.caregiver === filters.caregiver;
      const matchesStatus = filters.status === "all" || row.rowStatus === filters.status;

      return matchesQuery && matchesMood && matchesCaregiver && matchesStatus;
    })
    .sort((firstRow, secondRow) => {
      const timeDifference = getTimestamp(secondRow.date) - getTimestamp(firstRow.date);
      return filters.sortOrder === "newest" ? timeDifference : -timeDifference;
    });
}

function StatusChip({ status }) {
  const statusMeta = statusMetaByValue[status] ?? statusMetaByValue.pending;

  return (
    <span className={`daily-logs-status-chip daily-logs-status-chip--${statusMeta.tone}`}>
      {statusMeta.label}
    </span>
  );
}

function ViewAction({ row }) {
  if (row.detailHref) {
    return (
      <Link className={`daily-logs-action daily-logs-action--${row.actionTone}`} to={row.detailHref}>
        View
      </Link>
    );
  }

  return (
    <span className={`daily-logs-action daily-logs-action--${row.actionTone}`} aria-disabled="true">
      View
    </span>
  );
}

export default function DailyLogsPage() {
  const location = useLocation();
  const [entries, setEntries] = useState(() => loadDailyLogEntries());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [caregiverFilter, setCaregiverFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setEntries(loadDailyLogEntries());
  }, [location.key]);

  useEffect(() => {
    if (location.state?.statusMessage) {
      setStatusMessage(location.state.statusMessage);
    }
  }, [location.state]);

  function handleClearLog(row) {
    updateDailyLogEntry(row.residentId, {
      mood: "",
      date: "",
      status: "pending",
      actionTone: "attention",
      reportStatus: "missing",
      meals: "",
      activityEngagement: "",
      assistanceLevel: "",
      safety: "",
      notes: ""
    });

    setEntries(loadDailyLogEntries());
    setStatusMessage(`Cleared daily log for ${row.resident.name}.`);
  }

  const allRows = getLogRows(entries);
  const pendingCount = allRows.filter((row) => row.rowStatus === "pending").length;
  const completedCount = allRows.filter((row) => row.rowStatus === "completed").length;
  const attentionCount = allRows.filter((row) => row.rowStatus === "missing").length;

  const moodOptions = Array.from(new Set(allRows.map((row) => row.mood).filter(Boolean)));
  const caregiverOptions = Array.from(new Set(allRows.map((row) => row.caregiver)));
  const visibleRows = getVisibleRows(allRows, {
    query,
    status: statusFilter,
    mood: moodFilter,
    caregiver: caregiverFilter,
    sortOrder
  });

  return (
    <StaffAppShell onStubNavigate={() => {}}>
      <section className="daily-logs-page-header">
        <div className="daily-logs-page-title-group">
          <p className="eyebrow">{dailyLogsPageData.subtitle}</p>
          <h1 className="page-title">{dailyLogsPageData.title}</h1>
          <p className="daily-logs-page-copy">
            Review resident updates, resolve missing logs, and keep family-facing summaries current.
          </p>
        </div>
        <div className="daily-logs-summary-grid" aria-label="Daily log summary">
          <div className="daily-logs-summary-card daily-logs-summary-card--attention">
            <span className="daily-logs-summary-value">{attentionCount}</span>
            <span className="daily-logs-summary-label">Needs log</span>
          </div>
          <div className="daily-logs-summary-card">
            <span className="daily-logs-summary-value">{pendingCount}</span>
            <span className="daily-logs-summary-label">Pending</span>
          </div>
          <div className="daily-logs-summary-card daily-logs-summary-card--complete">
            <span className="daily-logs-summary-value">{completedCount}</span>
            <span className="daily-logs-summary-label">Complete</span>
          </div>
        </div>
      </section>

      <section className="daily-logs-controls-panel" aria-label="Daily log controls">
        <div className="daily-logs-controls-heading">
          <div>
            <h2 className="daily-logs-section-title">Daily log queue</h2>
            <p className="daily-logs-section-copy">Filter by resident status, mood, or caregiver.</p>
          </div>
          <p className="daily-logs-results-copy">
            Showing {visibleRows.length} of {allRows.length} logs
          </p>
        </div>

        <div className="daily-logs-controls-row">
          <div className="daily-logs-search-shell">
            <label className="daily-logs-control-label" htmlFor="daily-logs-search">
              Search resident
            </label>
            <div className="daily-logs-search-input-shell">
              <input
                id="daily-logs-search"
                className="daily-logs-search-input"
                type="search"
                placeholder="Search by resident name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <SearchIcon className="daily-logs-search-icon" />
            </div>
          </div>

          <label className="daily-logs-filter-group">
            <span className="daily-logs-control-label">Status</span>
            <select
              className="daily-logs-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="missing">Needs log</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="daily-logs-filter-group">
            <span className="daily-logs-control-label">Mood</span>
            <select
              className="daily-logs-select"
              value={moodFilter}
              onChange={(event) => setMoodFilter(event.target.value)}
            >
              <option value="all">All moods</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>

          <label className="daily-logs-filter-group">
            <span className="daily-logs-control-label">Caregiver</span>
            <select
              className="daily-logs-select"
              value={caregiverFilter}
              onChange={(event) => setCaregiverFilter(event.target.value)}
            >
              <option value="all">All caregivers</option>
              {caregiverOptions.map((caregiver) => (
                <option key={caregiver} value={caregiver}>
                  {caregiver}
                </option>
              ))}
            </select>
          </label>

          <label className="daily-logs-filter-group daily-logs-filter-group--sort">
            <span className="daily-logs-control-label">Sort</span>
            <div className="daily-logs-sort-shell">
              <select
                className="daily-logs-select"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="newest">Most recent first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <SortIcon className="daily-logs-sort-icon" />
            </div>
          </label>
        </div>

        <div className="daily-logs-context-row">
          <p className="status-message status-message--toolbar" aria-live="polite">
            {statusMessage}
          </p>
        </div>
      </section>

      <section className="daily-logs-panel" aria-label="Daily logs table">
        <div className="daily-logs-table-wrap">
          <table className="daily-logs-table">
            <caption className="daily-logs-table-caption">
              Resident daily logs sorted by {sortOrder === "newest" ? "most recent" : "oldest"} update
            </caption>
            <thead>
              <tr>
                <th scope="col">Resident</th>
                <th scope="col">Status</th>
                <th scope="col">Mood</th>
                <th scope="col">Caregiver</th>
                <th scope="col">Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length ? visibleRows.map((row) => (
                <tr key={`${row.resident.id}-${row.date}-${row.rowStatus}`}>
                  <td data-label="Resident">
                    <div className="daily-logs-patient-cell">
                      {row.detailHref ? (
                        <Link className="daily-logs-patient-link" to={row.detailHref}>
                          {row.resident.name}
                        </Link>
                      ) : (
                        <span className="daily-logs-patient-name">{row.resident.name}</span>
                      )}
                      <span className="daily-logs-patient-room">{row.resident.room}</span>
                    </div>
                  </td>
                  <td data-label="Status">
                    <StatusChip status={row.rowStatus} />
                  </td>
                  <td data-label="Mood">
                    {row.mood ? (
                      <span className={`daily-logs-mood-pill daily-logs-mood-pill--${row.moodTone}`}>
                        {row.mood}
                      </span>
                    ) : (
                      <span className="daily-logs-empty-value">Not started</span>
                    )}
                  </td>
                  <td data-label="Caregiver">{row.caregiver}</td>
                  <td data-label="Updated">{formatLogDate(row.date)}</td>
                  <td data-label="Actions">
                    <div className="daily-logs-actions-cell">
                      <ViewAction row={row} />
                      <button
                        className="daily-logs-clear-action"
                        type="button"
                        onClick={() => handleClearLog(row)}
                      >
                        Clear
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="daily-logs-empty-state" colSpan="6">
                    No daily logs match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </StaffAppShell>
  );
}
