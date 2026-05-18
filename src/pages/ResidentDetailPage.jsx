import { useState } from "react";
import {
  FaChevronRight,
  FaClipboardList,
  FaClock,
  FaEnvelope,
  FaFileMedical,
  FaHeartPulse,
  FaHandsHolding,
  FaLocationDot,
  FaPersonWalking,
  FaPhone,
  FaPills,
  FaRegCalendarDays,
  FaRegFaceSmile,
  FaRegMessage,
  FaRegNoteSticky,
  FaRegUser,
  FaShieldHalved,
  FaUtensils
} from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { StaffAppShell } from "../components/layout/StaffAppShell";
import { getResidentDetailBySlug, loadDailyLogEntries, messagesData } from "../data/mockData";
import NotFoundPage from "./NotFoundPage";

const familyContactImagesById = new Map(
  messagesData.contacts.map((contact) => [contact.id, contact.image])
);

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getDateValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate();
  }

  const normalizedValue = String(value).replace(" ", "T");
  const date = new Date(normalizedValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatTime(value) {
  const date = getDateValue(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getLatestDailyLog(residentId) {
  return loadDailyLogEntries()
    .filter((entry) => entry.residentId === residentId)
    .sort((firstEntry, secondEntry) => {
      const firstDate = getDateValue(firstEntry.createdAt ?? firstEntry.date)?.getTime() ?? 0;
      const secondDate = getDateValue(secondEntry.createdAt ?? secondEntry.date)?.getTime() ?? 0;
      return secondDate - firstDate;
    })[0];
}

function getCareValue(value, fallback = "Not recorded") {
  return value?.trim?.() ? value : fallback;
}

function getActivityLabel(value) {
  if (!value) {
    return "Not recorded";
  }

  return value.replace("Moderately Engaged", "Participated").replace("Fully Engaged", "Fully participated");
}

function getSafetyLabel(value) {
  return value?.trim?.() ? value : "No concerns";
}

function isFinalizedDailyLog(entry) {
  return entry?.reportStatus === "submitted" || entry?.status === "completed";
}

function getPrimaryContactDetails(relative) {
  const normalizedName = relative.name.toLowerCase().replace(/[^a-z]+/g, ".");
  const trimmedName = normalizedName.replace(/^\.+|\.+$/g, "");

  return {
    phone: relative.phone ?? "(206) 555-0187",
    email: relative.email ?? `${trimmedName}@email.com`
  };
}

function DetailSectionTitle({ icon: Icon, children }) {
  return (
    <h3 className="detail-card-title">
      <Icon aria-hidden="true" />
      {children}
    </h3>
  );
}

export default function ResidentDetailPage() {
  const navigate = useNavigate();
  const { residentId } = useParams();
  const resident = getResidentDetailBySlug(residentId ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const primaryRelativeImage = resident?.primaryRelative.contactId
    ? familyContactImagesById.get(resident.primaryRelative.contactId)
    : resident?.primaryRelative.image;
  const latestDailyLog = resident ? getLatestDailyLog(resident.resident.slug) : null;
  const latestDailyLogTime = formatTime(latestDailyLog?.createdAt ?? latestDailyLog?.date) || resident?.resident.lastUpdate;
  const latestDailyLogStaff = latestDailyLog?.staffName ?? latestDailyLog?.caregiverName ?? latestDailyLog?.caregiver ?? "Sarah Allen";
  const isLatestDailyLogFinal = isFinalizedDailyLog(latestDailyLog);
  const latestDailyLogStateLabel = isLatestDailyLogFinal ? "Finalized" : "Pending final submission";
  const latestDailyLogMeta = isLatestDailyLogFinal
    ? `Finalized ${latestDailyLogTime} by ${latestDailyLogStaff}`
    : `Draft saved ${latestDailyLogTime} by ${latestDailyLogStaff}`;
  const primaryContactDetails = resident ? getPrimaryContactDetails(resident.primaryRelative) : null;

  if (!resident) {
    return (
      <NotFoundPage
        title="Resident Not Found"
        description="That resident detail view has not been mocked in SharedCare yet."
        actionLabel="Back to residents"
        actionTo="/residents"
      />
    );
  }

  function handleStubNavigate(navId) {
    setStatusMessage(`Stub navigation only for ${navId}. This mock route stays inside the shared React shell.`);
  }

  function handleAction(label) {
    setStatusMessage(`TODO: wire ${label} for ${resident.resident.name}.`);
  }

  return (
    <StaffAppShell onStubNavigate={handleStubNavigate}>
      <section className="detail-panel">
        <div className="detail-header">
          <span>Resident</span>
          <button className="detail-back-link" type="button" onClick={() => navigate("/residents")}>
            Back to residents
          </button>
        </div>

        <div className="detail-body">
          <p className="status-message detail-status-message" aria-live="polite">
            {statusMessage}
          </p>

          <div className="detail-summary">
            <div
              className={`detail-avatar detail-avatar--${resident.resident.slug}`}
              style={{ "--avatar-accent": resident.resident.accent ?? "#d6c1a5" }}
            >
              {resident.resident.image ? (
                <img src={resident.resident.image} alt={resident.resident.name} />
              ) : (
                <span>{getInitials(resident.resident.name)}</span>
              )}
            </div>

            <div className="detail-profile-copy">
              <h2 className="detail-name">{resident.resident.name}</h2>
              <div className="detail-resident-meta">
                <span>
                  <FaLocationDot aria-hidden="true" />
                  {resident.resident.room}
                </span>
                <span aria-hidden="true">•</span>
                <span className="resident-status-pill">Active Resident</span>
              </div>
              <p className="detail-update-line">
                <FaClock aria-hidden="true" />
                {isLatestDailyLogFinal ? "Daily log finalized:" : "Daily log draft saved:"} <strong>{latestDailyLogTime}</strong>
              </p>
              <p className="detail-updated-by">
                {isLatestDailyLogFinal ? "Finalized" : "Pending final submission"} by{" "}
                <button type="button" onClick={() => handleAction("caregiver profile")}>{latestDailyLogStaff}</button>
              </p>

              <div className="detail-primary-inline">
                <p>Primary Contact</p>
                <div className="relative-card-body">
                  <div className="relative-avatar" aria-hidden="true">
                    {primaryRelativeImage ? (
                      <img src={primaryRelativeImage} alt="" />
                    ) : (
                      getInitials(resident.primaryRelative.name)
                    )}
                  </div>
                  <div>
                    <p className="relative-name">
                      {resident.primaryRelative.name} <span>({resident.primaryRelative.relation})</span>
                    </p>
                    <p className="relative-meta">
                      <FaPhone aria-hidden="true" />
                      {primaryContactDetails.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              {[
                { label: "Daily Log Summaries", tone: "neutral", icon: FaClipboardList },
                { label: "Message Family", tone: "message", icon: FaRegMessage },
                { label: "Schedule Visit", tone: "schedule", icon: FaRegCalendarDays },
                { label: "Medical Charts", tone: "dark", icon: FaFileMedical }
              ].map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    className={`detail-action-card detail-action-card--${action.tone}`}
                    type="button"
                    onClick={() => handleAction(action.label)}
                  >
                    <ActionIcon aria-hidden="true" />
                    <span className="detail-action-label">{action.label}</span>
                    <FaChevronRight className="detail-action-arrow" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="detail-grid">
            <article className="detail-card detail-card--daily-log">
              <div className="detail-card-heading-row">
                <DetailSectionTitle icon={FaRegCalendarDays}>Latest Daily Log</DetailSectionTitle>
                <div className="daily-log-card-meta">
                  <span className={`daily-log-state-pill${isLatestDailyLogFinal ? " is-final" : " is-draft"}`}>
                    {latestDailyLogStateLabel}
                  </span>
                  <p>{latestDailyLogMeta}</p>
                </div>
              </div>
              <div className="daily-log-snapshot-grid">
                {[
                  {
                    label: "Mood",
                    value: getCareValue(latestDailyLog?.mood ?? latestDailyLog?.status),
                    icon: FaRegFaceSmile,
                    tone: "mood"
                  },
                  {
                    label: "Meals",
                    value: getCareValue(latestDailyLog?.meals),
                    icon: FaUtensils,
                    tone: "meals"
                  },
                  {
                    label: "Activity",
                    value: getActivityLabel(latestDailyLog?.activityEngagement),
                    icon: FaPersonWalking,
                    tone: "activity"
                  },
                  {
                    label: "Assistance",
                    value: getCareValue(latestDailyLog?.assistanceLevel),
                    icon: FaHandsHolding,
                    tone: "assistance"
                  },
                  {
                    label: "Safety",
                    value: getSafetyLabel(latestDailyLog?.safety),
                    icon: FaShieldHalved,
                    tone: "safety"
                  }
                ].map((item) => {
                  const ItemIcon = item.icon;

                  return (
                    <div key={item.label} className={`daily-log-snapshot-item daily-log-snapshot-item--${item.tone}`}>
                      <ItemIcon aria-hidden="true" />
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </div>
                  );
                })}
              </div>
              <div className="daily-log-summary-row">
                <div className="daily-log-summary-title">
                  <FaRegNoteSticky aria-hidden="true" />
                  <strong>Summary</strong>
                </div>
                <p>{latestDailyLog?.summary ?? latestDailyLog?.notes ?? "No summary recorded."}</p>
              </div>
            </article>

            <article className="detail-card detail-card--identity">
              <DetailSectionTitle icon={FaRegUser}>Identity</DetailSectionTitle>
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
                <div className="detail-meta-row">
                  <dt>Language</dt>
                  <dd>English</dd>
                </div>
                <div className="detail-meta-row">
                  <dt>Preferred Name</dt>
                  <dd>{resident.resident.name.split(" ")[0]}</dd>
                </div>
              </dl>
            </article>

            <article className="detail-card detail-card--relative">
              <DetailSectionTitle icon={FaRegUser}>Primary Contact</DetailSectionTitle>
              <div className="relative-card-body">
                <div className="relative-avatar" aria-hidden="true">
                  {primaryRelativeImage ? (
                    <img src={primaryRelativeImage} alt="" />
                  ) : (
                    getInitials(resident.primaryRelative.name)
                  )}
                </div>
                <div>
                  <p className="relative-name">
                    {resident.primaryRelative.name} <span>({resident.primaryRelative.relation})</span>
                  </p>
                  <p className="relative-meta">
                    <FaPhone aria-hidden="true" />
                    {primaryContactDetails.phone}
                  </p>
                  <p className="relative-meta">
                    <FaEnvelope aria-hidden="true" />
                    {primaryContactDetails.email}
                  </p>
                </div>
              </div>
              <span className="primary-contact-pill">Primary</span>
            </article>

            <article className="detail-card detail-card--medications">
              <DetailSectionTitle icon={FaPills}>Medications</DetailSectionTitle>
              <ul className="detail-list">
                {resident.medications.map((medication) => (
                  <li key={medication}>{medication}</li>
                ))}
              </ul>
              <button className="detail-card-link" type="button" onClick={() => handleAction("all medications")}>
                View all medications
                <FaChevronRight aria-hidden="true" />
              </button>
            </article>

            <article className="detail-card detail-card--personal">
              <DetailSectionTitle icon={FaRegNoteSticky}>Personal Notes</DetailSectionTitle>
              <ul className="detail-list">
                {resident.personalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </article>

            <article className="detail-card detail-card--diagnoses">
              <DetailSectionTitle icon={FaHeartPulse}>Diagnoses</DetailSectionTitle>
              <ul className="detail-list">
                {resident.diagnoses.map((diagnosis) => (
                  <li key={diagnosis}>{diagnosis}</li>
                ))}
              </ul>
              <button className="detail-card-link" type="button" onClick={() => handleAction("all diagnoses")}>
                View all diagnoses
                <FaChevronRight aria-hidden="true" />
              </button>
            </article>
          </div>
        </div>
      </section>
    </StaffAppShell>
  );
}
