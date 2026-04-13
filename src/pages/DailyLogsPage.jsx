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

function getVisibleRows(rows, filters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return rows
    .filter((row) => {
      const matchesQuery =
        !normalizedQuery || row.resident.name.toLowerCase().includes(normalizedQuery);
      const matchesMood = filters.mood === "all" || row.mood === filters.mood;
      const matchesCaregiver =
        filters.caregiver === "all" || row.caregiver === filters.caregiver;

      return matchesQuery && matchesMood && matchesCaregiver;
    })
    .sort((firstRow, secondRow) => {
      const timeDifference = getTimestamp(secondRow.date) - getTimestamp(firstRow.date);
      return filters.sortOrder === "newest" ? timeDifference : -timeDifference;
    });
}

function ViewAction({ row }) {
  const content = (
    <>
      <span className="daily-logs-action-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <span>View</span>
    </>
  );

  if (row.detailHref) {
    return (
      <Link className={`daily-logs-action daily-logs-action--${row.actionTone}`} to={row.detailHref}>
        {content}
      </Link>
    );
  }

  return (
    <span className={`daily-logs-action daily-logs-action--${row.actionTone}`} aria-disabled="true">
      {content}
    </span>
  );
}

export default function DailyLogsPage() {
  const location = useLocation();
  const [entries, setEntries] = useState(() => loadDailyLogEntries());
  const [query, setQuery] = useState("");
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

  const moodOptions = Array.from(new Set(allRows.map((row) => row.mood).filter(Boolean)));
  const caregiverOptions = Array.from(new Set(allRows.map((row) => row.caregiver)));
  const visibleRows = getVisibleRows(allRows, {
    query,
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
        </div>
        <div className="daily-logs-summary-card" aria-label={`${allRows.length} total logs`}>
          <span className="daily-logs-summary-value">{allRows.length}</span>
          <span className="daily-logs-summary-label">Total Logs</span>
        </div>
      </section>

      <section className="daily-logs-controls-panel" aria-label="Daily log controls">
        <div className="daily-logs-controls-row">
          <div className="daily-logs-search-shell">
            <label className="daily-logs-control-label" htmlFor="daily-logs-search">
              Search Resident
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
          <p className="daily-logs-results-copy">
            Showing {visibleRows.length} of {allRows.length} logs
          </p>
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
                <th scope="col">Patient</th>
                <th scope="col">Room</th>
                <th scope="col">Caregiver</th>
                <th scope="col">Mood</th>
                <th scope="col">Last Updated</th>
                <th scope="col">View</th>
                <th scope="col">Clear</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length ? visibleRows.map((row) => (
                <tr key={`${row.resident.id}-${row.date}`}>
                  <td data-label="Patient">
                    <div className="daily-logs-patient-cell">
                      {row.detailHref ? (
                        <Link className="daily-logs-patient-link" to={row.detailHref}>
                          {row.resident.name}
                        </Link>
                      ) : (
                        <span className="daily-logs-patient-name">{row.resident.name}</span>
                      )}
                    </div>
                  </td>
                  <td data-label="Room">{row.resident.room.replace("Room ", "")}</td>
                  <td data-label="Caregiver">{row.caregiver}</td>
                  <td data-label="Mood">
                    {row.mood ? (
                      <span className={`daily-logs-mood-pill daily-logs-mood-pill--${row.moodTone}`}>
                        {row.mood}
                      </span>
                    ) : null}
                  </td>
                  <td data-label="Date">{row.date || "—"}</td>
                  <td data-label="View">
                    <ViewAction row={row} />
                  </td>
                  <td data-label="Clear">
                    <button
                      className="daily-logs-clear-action"
                      type="button"
                      onClick={() => handleClearLog(row)}
                    >
                      Clear
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td className="daily-logs-empty-state" colSpan="7">
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
