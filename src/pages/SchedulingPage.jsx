import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { StaffAppShell } from "../components/layout/StaffAppShell";
import { currentDemoStaffName, schedulingPageData } from "../data/mockData";
import { db } from "../lib/firebase";
import {
  listenToPendingVisitRequests,
  updateVisitRequestStatus
} from "../services/visitRequestService";

const HOUR_HEIGHT = 80; // px per hour in the calendar grid
const DAY_START_HOUR = 8; // first hour shown
const DAY_END_HOUR = DAY_START_HOUR + schedulingPageData.hoursShown;
const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
const clampledNowMins = Math.min(Math.max(nowMins, DAY_START_HOUR * 60), DAY_END_HOUR * 60);
const nowTop = ((clampledNowMins - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT;

function timeToMinutes(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toDateString(date) {
  return date.toISOString().split("T")[0];
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function CalendarEvent({ event }) {
  const startMins = timeToMinutes(event.startTime);
  const endMins = timeToMinutes(event.endTime);
  const dayStartMins = DAY_START_HOUR * 60;

  const topPx = ((startMins - dayStartMins) / 60) * HOUR_HEIGHT;
  const heightPx = Math.max(((endMins - startMins) / 60) * HOUR_HEIGHT, 48);

  return (
    <div
      className="cal-event"
      style={{ top: topPx, height: heightPx }}
      aria-label={`${event.title}, ${event.startTime} to ${event.endTime}`}
    >
      <div className="cal-event-top">
        <span className="cal-event-title">{event.title}</span>
        <span className="cal-event-room-pill">{event.room}</span>
      </div>
      <span className="cal-event-subtitle">{event.subtitle}</span>
      <span className="cal-event-time">
        {event.startTime} - {event.endTime}
      </span>
    </div>
  );
}

function PendingCard({ appointment, isUpdating, onAccept, onDecline }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="pending-card">
      <div className="pending-card-body">
        <p className="pending-card-name">{appointment.name}</p>
        {expanded ? (
          <p className="pending-card-relation">
            {appointment.relation}<br />
            <strong>{appointment.room}</strong>
          </p>
        ) : null}
        <div className="pending-card-meta">
          <span className="pending-card-date">{appointment.date}</span>
          <span className="pending-card-time">{appointment.time}</span>
        </div>
        {expanded && appointment.notes ? (
          <div className="pending-card-notes">
            <p className="pending-card-notes-label">Notes:</p>
            <p className="pending-card-notes-text">{appointment.notes}</p>
          </div>
        ) : null}
        <button
          className="pending-card-details"
          type="button"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Hide Details" : "See Details"}
        </button>
      </div>
      <div className="pending-card-actions">
        <button
          className="pending-action-button pending-action-button--accept"
          type="button"
          onClick={() => onAccept(appointment.id)}
          disabled={isUpdating}
        >
          Accept
        </button>
        <button
          className="pending-action-button pending-action-button--decline"
          type="button"
          onClick={() => onDecline(appointment.id)}
          disabled={isUpdating}
        >
          Decline
        </button>
      </div>
    </article>
  );
}

export default function SchedulingPage() {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(schedulingPageData.initialDate);
  const [pendingList, setPendingList] = useState([]);
  const [pendingStatus, setPendingStatus] = useState("loading");
  const [updatingRequestIds, setUpdatingRequestIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [events] = useState(schedulingPageData.events);

  useEffect(() => {
    if (!db) {
      setPendingStatus("error");
      return undefined;
    }

    setPendingStatus("loading");

    return listenToPendingVisitRequests(
      db,
      (requests) => {
        setPendingList(requests);
        setPendingStatus("ready");
      },
      () => {
        setPendingStatus("error");
      }
    );
  }, []);

  const hours = Array.from(
    { length: schedulingPageData.hoursShown },
    (_, i) => DAY_START_HOUR + i
  );

  const pendingAppointments = useMemo(
    () =>
      pendingList.map((request) => ({
        id: request.id,
        name: request.visitorName || request.familyName,
        relation: request.residentName,
        room: request.residentRoom,
        date: request.requestedDate,
        time: request.requestedTime,
        notes: request.notes
      })),
    [pendingList]
  );

  function formatHourLabel(hour) {
    if (hour === 12) return "12:00pm";
    if (hour > 12) return `${hour - 12}:00 pm`;
    return `${hour}:00 am`;
  }

  function handlePrevDay() {
    setCurrentDate((d) => addDays(d, -1));
  }

  function handleNextDay() {
    setCurrentDate((d) => addDays(d, 1));
  }

  function setRequestUpdating(id, isUpdating) {
    setUpdatingRequestIds((currentIds) =>
      isUpdating ? [...currentIds, id] : currentIds.filter((currentId) => currentId !== id)
    );
  }

  async function handleAccept(id) {
    if (!db) {
      setStatusMessage("Visit requests are unavailable because Firebase is not configured.");
      return;
    }

    try {
      setRequestUpdating(id, true);
      await updateVisitRequestStatus(db, id, "approved", currentDemoStaffName);
      setStatusMessage("Appointment accepted.");
    } catch {
      setStatusMessage("Could not accept appointment. Check your Firebase connection.");
    } finally {
      setRequestUpdating(id, false);
    }
  }

  async function handleDecline(id) {
    if (!db) {
      setStatusMessage("Visit requests are unavailable because Firebase is not configured.");
      return;
    }

    try {
      setRequestUpdating(id, true);
      await updateVisitRequestStatus(db, id, "declined", currentDemoStaffName);
      setStatusMessage("Appointment declined.");
    } catch {
      setStatusMessage("Could not decline appointment. Check your Firebase connection.");
    } finally {
      setRequestUpdating(id, false);
    }
  }

   const visibleEvents = events.filter(
    (e) => e.date === toDateString(currentDate)
  );

  const totalGridHeight = schedulingPageData.hoursShown * HOUR_HEIGHT;

  return (
    <StaffAppShell onStubNavigate={() => {}}>
      <div className="visits-page-header">
        <div>
          <p className="eyebrow">Appointments</p>
          <h1 className="page-title">Today's Visits</h1>
        </div>
        <button
          className="back-button"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>

      <p className="status-message" aria-live="polite">
        {statusMessage}
      </p>

      <div className="visits-layout">
        {/* ── Calendar panel ── */}
        <section className="cal-panel" aria-label="Daily schedule">
          {/* Date nav header */}
          <div className="cal-header">
            <button
              className="cal-nav-button"
              type="button"
              onClick={handlePrevDay}
              aria-label="Previous day"
            >
              <ChevronLeftIcon />
            </button>
            <span className="cal-header-date">{formatDate(currentDate)}</span>
            <button
              className="cal-nav-button"
              type="button"
              onClick={handleNextDay}
              aria-label="Next day"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Time grid */}
          <div className="cal-grid-wrapper">
            <div className="cal-grid" style={{ height: totalGridHeight}}>
              {/* Hour rows */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="cal-hour-row"
                  style={{ top: (hour - DAY_START_HOUR) * HOUR_HEIGHT, height: HOUR_HEIGHT }}
                >
                  <span className="cal-hour-label">{formatHourLabel(hour)}</span>
                  <div className="cal-hour-line" />
                </div>
              ))}

              {/* Current time indicator */}
              <div
                className="cal-now-line"
                style={{ top: nowTop}}
                aria-hidden="true"
              />

              {/* Events */}
              <div className="cal-events-column">
                {visibleEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Pending appointments panel ── */}
        <aside className="pending-panel" aria-label="Pending appointments">
          <h2 className="pending-panel-title">Pending Appointments</h2>

          {pendingStatus === "loading" ? (
            <p className="pending-panel-empty">Loading pending appointments...</p>
          ) : null}

          {pendingStatus === "error" ? (
            <p className="pending-panel-empty">
              Pending appointments are unavailable right now.
            </p>
          ) : null}

          {pendingStatus === "ready" && pendingAppointments.length === 0 ? (
            <p className="pending-panel-empty">No pending appointments.</p>
          ) : null}

          {pendingStatus === "ready" && pendingAppointments.length ? (
            <ul className="pending-list">
              {pendingAppointments.map((appt) => (
                <li key={appt.id}>
                  <PendingCard
                    appointment={appt}
                    isUpdating={updatingRequestIds.includes(appt.id)}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </aside>
      </div>
    </StaffAppShell>
  );
}
