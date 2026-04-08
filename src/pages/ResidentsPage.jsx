import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SearchIcon, SortIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import { getResidentDetailBySlug, getResidentSlug, residentsPageData } from "../data/mockData";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getVisibleResidents(query, sortAscending) {
  const normalizedQuery = query.trim().toLowerCase();

  return residentsPageData.residents
    .filter((resident) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        resident.name.toLowerCase().includes(normalizedQuery) ||
        resident.room.toLowerCase().includes(normalizedQuery)
      );
    })
    .sort((firstResident, secondResident) => {
      const comparison = firstResident.name.localeCompare(secondResident.name);
      return sortAscending ? comparison : -comparison;
    });
}

export default function ResidentsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const residents = getVisibleResidents(query, sortAscending);

  function handleStubNavigate(navId) {
    setStatusMessage(`Stub navigation only for ${navId}. This route now lives in the React app shell.`);
  }

  function handleResidentOpen(resident) {
    const residentSlug = getResidentSlug(resident.detailPath, resident.slug);

    if (residentSlug && getResidentDetailBySlug(residentSlug)) {
      navigate(`/residents/${residentSlug}`);
      return;
    }

    setStatusMessage(`TODO: wire resident detail route ${resident.detailPath}`);
  }

  return (
    <StaffAppShell onStubNavigate={handleStubNavigate}>
      <section className="hero">
        <div>
          <p className="eyebrow">{residentsPageData.subtitle}</p>
          <h1 className="page-title page-title--compact">{residentsPageData.title}</h1>
        </div>

        <div className="search-shell">
          <input
            className="search-input"
            type="search"
            placeholder={residentsPageData.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search residents"
          />
          <SearchIcon className="search-icon" />
        </div>
      </section>

      <div className="toolbar">
        <button
          className="sort-button"
          type="button"
          onClick={() => setSortAscending((currentValue) => !currentValue)}
          aria-pressed={!sortAscending}
        >
          <span className="sort-label">{sortAscending ? "Sort A-Z" : "Sort Z-A"}</span>
          <SortIcon />
        </button>
        <p className="status-message status-message--toolbar" aria-live="polite">
          {statusMessage}
        </p>
      </div>

      <section className="directory-panel">
        <ul className="directory-list">
          {residents.length ? (
            residents.map((resident) => {
              const initials = getInitials(resident.name);

              return (
                <li key={resident.id} className="resident-directory-row">
                  <button
                    className="resident-directory-button"
                    type="button"
                    onClick={() => handleResidentOpen(resident)}
                    aria-label={`View details for ${resident.name}`}
                  >
                    <div className="directory-identity">
                      <div
                        className="directory-avatar"
                        style={{ "--avatar-accent": resident.accent ?? "#aaccee" }}
                      >
                        {resident.image ? <img src={resident.image} alt={resident.name} /> : <span>{initials}</span>}
                      </div>
                      <div className="directory-name-block">
                        <p className="directory-name">{resident.name}</p>
                        <p className="directory-room">{resident.room}</p>
                      </div>
                    </div>

                    <div className="directory-update">
                      <p className="directory-update-label">{resident.lastUpdateLabel ?? "Daily Log last updated"}</p>
                      <p className="directory-update-time">{resident.lastUpdate}</p>
                    </div>

                    <span className="directory-link">View Details &gt;</span>
                  </button>
                </li>
              );
            })
          ) : (
            <li className="directory-empty">No residents match your search yet.</li>
          )}
        </ul>
      </section>
    </StaffAppShell>
  );
}
