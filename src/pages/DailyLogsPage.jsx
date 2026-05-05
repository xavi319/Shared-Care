import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { SearchIcon, SortIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  dailyLogsPageData,
  dashboardData,
  getCanonicalDailyLogResidentId,
  getDailyLogDateKey,
  getDailyLogRequiredDate,
  loadDailyLogEntries,
  residentsPageData,
  updateDailyLogEntry
} from "../data/mockData";

const residents = Array.from(
  new Map(
    [...dashboardData.residents, ...residentsPageData.residents].map((resident) => [
      getCanonicalDailyLogResidentId(resident.id),
      resident
    ])
  ).values()
);
const residentsById = new Map([
  ...residents.map((resident) => [resident.id, resident]),
  ...residents.map((resident) => [getCanonicalDailyLogResidentId(resident.id), resident])
]);

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
    label: "Submitted",
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

const statusSortRank = {
  missing: 0,
  pending: 1,
  completed: 2
};

const rowStatusPreferenceRank = {
  missing: 3,
  pending: 2,
  completed: 1
};

function getRowStatus(entry) {
  if (entry.reportStatus === "missing" || !entry.mood) {
    return "missing";
  }

  return entry.status === "completed" ? "completed" : "pending";
}

function getCreatedAtTime(entry) {
  const value = entry.createdAt ?? entry.date;
  const date = value ? new Date(String(value).replace(" ", "T")) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : Number.NEGATIVE_INFINITY;
}

function formatLogDate(value = getDailyLogRequiredDate()) {
  if (!value) {
    return "—";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    const [year, month, day] = String(value).split("-");
    return `${month}/${day}/${year}`;
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

function getPreferredQueueEntry(currentEntry, nextEntry) {
  if (!currentEntry) {
    return nextEntry;
  }

  const currentQueueUpdate = currentEntry.queueUpdatedAt ?? 0;
  const nextQueueUpdate = nextEntry.queueUpdatedAt ?? 0;

  if (currentQueueUpdate !== nextQueueUpdate) {
    return nextQueueUpdate > currentQueueUpdate ? nextEntry : currentEntry;
  }

  const statusDifference =
    rowStatusPreferenceRank[getRowStatus(nextEntry)] - rowStatusPreferenceRank[getRowStatus(currentEntry)];

  if (statusDifference !== 0) {
    return statusDifference > 0 ? nextEntry : currentEntry;
  }

  return getCreatedAtTime(nextEntry) >= getCreatedAtTime(currentEntry) ? nextEntry : currentEntry;
}

function getAssignedStaffName(entries, residentId) {
  const latestEntry = entries
    .filter((entry) => getCanonicalDailyLogResidentId(entry.residentId) === getCanonicalDailyLogResidentId(residentId))
    .sort((firstEntry, secondEntry) => getCreatedAtTime(secondEntry) - getCreatedAtTime(firstEntry))[0];

  return latestEntry?.staffName ?? latestEntry?.caregiverName ?? latestEntry?.caregiver ?? "Unassigned";
}

function getLogRows(entries, requiredDate) {
  return residents.map((resident) => {
    const canonicalResidentId = getCanonicalDailyLogResidentId(resident.id);
    const currentEntry = entries
      .filter((entry) => getCanonicalDailyLogResidentId(entry.residentId) === canonicalResidentId)
      .filter((entry) => getDailyLogDateKey(entry.createdAt ?? entry.date) === requiredDate)
      .reduce((preferredEntry, entry) => getPreferredQueueEntry(preferredEntry, entry), null);
    const entry = currentEntry ?? {
      id: `daily-log-${canonicalResidentId}-${requiredDate}-required`,
      residentId: canonicalResidentId,
      staffName: getAssignedStaffName(entries, canonicalResidentId),
      date: requiredDate,
      createdAt: requiredDate,
      mood: "",
      status: "pending",
      reportStatus: "missing",
      actionTone: "attention"
    };

    return {
      ...entry,
      staffName: entry.staffName ?? entry.caregiverName ?? entry.caregiver ?? "Unassigned",
      resident,
      detailHref: `/daily-logs/${resident.id}/submit`,
      moodTone: entry.mood ? (moodToneByValue[entry.mood] ?? "neutral") : "",
      rowStatus: getRowStatus(entry),
      actionTone: entry.actionTone ?? "default",
      dueDate: requiredDate
    };
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
        filters.caregiver === "all" || row.staffName === filters.caregiver;
      const matchesStatus = filters.status === "all" || row.rowStatus === filters.status;

      return matchesQuery && matchesMood && matchesCaregiver && matchesStatus;
    })
    .sort((firstRow, secondRow) => {
      if (filters.sortOrder === "resident") {
        return firstRow.resident.name.localeCompare(secondRow.resident.name);
      }

      if (filters.sortOrder === "caregiver") {
        return firstRow.staffName.localeCompare(secondRow.staffName);
      }

      const statusDifference =
        statusSortRank[firstRow.rowStatus] - statusSortRank[secondRow.rowStatus];

      return statusDifference || firstRow.resident.name.localeCompare(secondRow.resident.name);
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
  const requiredDate = getDailyLogRequiredDate();
  const [entries, setEntries] = useState(() => loadDailyLogEntries());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("all");
  const [caregiverFilter, setCaregiverFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("status");
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
    if (row.rowStatus === "missing") {
      setStatusMessage(`${row.resident.name} already needs a daily log for ${formatLogDate(requiredDate)}.`);
      return;
    }

    const shouldReset = window.confirm(
      `Reset today's submitted daily log for ${row.resident.name}?`
    );

    if (!shouldReset) {
      return;
    }

    updateDailyLogEntry(row.residentId, {
      mood: "",
      date: requiredDate,
      createdAt: requiredDate,
      status: "pending",
      actionTone: "attention",
      reportStatus: "missing",
      meals: "",
      activityEngagement: "",
      assistanceLevel: "",
      safety: "",
      notes: "",
      summary: "",
      visibleToFamily: false
    });

    setEntries(loadDailyLogEntries());
    setStatusMessage(`Reset today's daily log for ${row.resident.name}.`);
  }

  const allRows = getLogRows(entries, requiredDate);
  const pendingCount = allRows.filter((row) => row.rowStatus === "pending").length;
  const completedCount = allRows.filter((row) => row.rowStatus === "completed").length;
  const attentionCount = allRows.filter((row) => row.rowStatus === "missing").length;

  const moodOptions = Array.from(new Set(allRows.map((row) => row.mood).filter(Boolean)));
  const caregiverOptions = Array.from(new Set(allRows.map((row) => row.staffName).filter(Boolean)));
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
        </div>
        <div className="daily-logs-summary-grid" aria-label="Daily log summary">
          <div className="daily-logs-summary-card daily-logs-summary-card--attention">
            <span className="daily-logs-summary-label">Needs log</span>
            <span className="daily-logs-summary-value">{attentionCount}</span>
          </div>
          <div className="daily-logs-summary-card">
            <span className="daily-logs-summary-label">Pending</span>
            <span className="daily-logs-summary-value">{pendingCount}</span>
          </div>
          <div className="daily-logs-summary-card daily-logs-summary-card--complete">
            <span className="daily-logs-summary-label">Complete</span>
            <span className="daily-logs-summary-value">{completedCount}</span>
          </div>
        </div>
      </section>

      <section className="daily-logs-controls-panel" aria-label="Daily log controls">
        <div className="daily-logs-controls-heading">
          <div>
            <h2 className="daily-logs-section-title">Daily log queue</h2>
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
              <option value="completed">Submitted</option>
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
                <option value="status">Needs log first</option>
                <option value="resident">Resident A-Z</option>
                <option value="caregiver">Caregiver A-Z</option>
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
              Required daily log submissions for {formatLogDate(requiredDate)}
            </caption>
            <thead>
              <tr>
                <th scope="col">Resident</th>
                <th scope="col">Status</th>
                <th scope="col">Mood</th>
                <th scope="col">Caregiver</th>
                <th scope="col">Due</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length ? visibleRows.map((row) => (
                <tr key={row.id}>
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
                  <td data-label="Caregiver">{row.staffName}</td>
                  <td data-label="Due">{formatLogDate(row.dueDate)}</td>
                  <td data-label="Actions">
                    <div className="daily-logs-actions-cell">
                      <ViewAction row={row} />
                      <button
                        className="daily-logs-clear-action"
                        type="button"
                        disabled={row.rowStatus === "missing"}
                        onClick={() => handleClearLog(row)}
                      >
                        Reset
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
