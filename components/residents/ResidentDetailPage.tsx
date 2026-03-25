"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ChevronLeftIcon, SearchIcon, SortIcon } from "@/components/layout/icons";
import { StaffAppShell } from "@/components/layout/StaffAppShell";
import type { ResidentDetailData } from "@/lib/types";

interface ResidentDetailPageProps {
  resident: ResidentDetailData;
}

export function ResidentDetailPage({ resident }: ResidentDetailPageProps) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");

  function handleStubNavigate(navId: string) {
    setStatusMessage(`Stub navigation only for ${navId}. This mock route stays in the shared app shell.`);
  }

  function handleAction(label: string) {
    setStatusMessage(`TODO: wire ${label} for ${resident.resident.name}.`);
  }

  return (
    <StaffAppShell onStubNavigate={handleStubNavigate}>
      <section className="hero">
        <div>
          <p className="eyebrow">{resident.subtitle}</p>
          <h1 className="page-title page-title--compact">{resident.title}</h1>
        </div>

        <div className="search-shell">
          <input
            className="search-input"
            type="search"
            value={resident.searchValue}
            readOnly
            aria-label="Selected resident"
          />
          <SearchIcon className="search-icon" />
        </div>
      </section>

      <div className="toolbar">
        <button className="sort-button" type="button" onClick={() => setStatusMessage("Sort controls are stubbed on the detail page for now.")}>
          <span className="sort-label">Sort A-Z</span>
          <SortIcon />
        </button>

        <div className="toolbar-right">
          <p className="status-message status-message--toolbar" aria-live="polite">
            {statusMessage}
          </p>
          <button className="back-button" type="button" onClick={() => router.push("/residents")} aria-label="Back to residents">
            <ChevronLeftIcon />
          </button>
        </div>
      </div>

      <section className="detail-panel">
        <div className="detail-header">Resident</div>

        <div className="detail-body">
          <div className="detail-summary">
            <div className="detail-avatar">
              <img src={resident.resident.image ?? "/images/lilian-mendoza.jpg"} alt={resident.resident.name} />
            </div>

            <div>
              <h2 className="detail-name">{resident.resident.name}</h2>
              <p className="detail-room">{resident.resident.room}</p>
              <p className="detail-update-label">{resident.resident.lastUpdateLabel}</p>
              <p className="detail-update-time">{resident.resident.lastUpdate}</p>
            </div>

            <div className="detail-actions">
              {resident.actions.map((action) => (
                <button
                  key={action.label}
                  className={`detail-action-card detail-action-card--${action.tone}`}
                  type="button"
                  onClick={() => handleAction(action.label)}
                >
                  <span className="detail-action-label">{action.label}</span>
                  <span className="detail-action-arrow" aria-hidden="true">
                    &gt;
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-grid">
            <article className="detail-card detail-card--identity">
              <h3 className="detail-card-title">Identity</h3>
              <dl className="detail-meta">
                <div className="detail-meta-row">
                  <dt>Resident ID</dt>
                  <dd>{resident.residentId}</dd>
                </div>
                <div className="detail-meta-row">
                  <dt>Age</dt>
                  <dd>{resident.age}</dd>
                </div>
                <div className="detail-meta-row">
                  <dt>Date of Birth</dt>
                  <dd>{resident.dob}</dd>
                </div>
                <div className="detail-meta-row">
                  <dt>Admission Date</dt>
                  <dd>{resident.admissionDate}</dd>
                </div>
              </dl>
            </article>

            <article className="detail-card detail-card--diagnoses">
              <h3 className="detail-card-title">Diagnoses</h3>
              <ul className="detail-list">
                {resident.diagnoses.map((diagnosis) => (
                  <li key={diagnosis}>{diagnosis}</li>
                ))}
              </ul>
            </article>

            <article className="detail-card detail-card--medications">
              <h3 className="detail-card-title">Medications</h3>
              <ul className="detail-list">
                {resident.medications.map((medication) => (
                  <li key={medication}>{medication}</li>
                ))}
              </ul>
            </article>

            <article className="detail-card detail-card--personal">
              <h3 className="detail-card-title">Personal Notes</h3>
              <ul className="detail-list">
                {resident.personalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </StaffAppShell>
  );
}
