import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../components/auth/AuthProvider";
import { ChevronLeftIcon, ChevronRightIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import { schedulingPageData } from "../data/mockData";
import { db } from "../lib/firebase";
import {
  listenToApprovedVisitRequestsForDate,
  listenToPendingVisitRequests,
  updateVisitRequestStatus
} from "../services/visitRequestService";

const HOUR_HEIGHT = 80; // px per hour in the calendar grid
const DAY_START_HOUR = 8; // first hour shown
const HOURS_SHOWN = 10;
const DAY_END_HOUR = DAY_START_HOUR + HOURS_SHOWN;
const defaultVisitDurationMinutes = 60;

function getLocalToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function timeToMinutes(timeStr = "") {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return DAY_START_HOUR * 60;
  }
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getVisitTimeRange(requestedTime = "") {
  const [startTime, endTime] = requestedTime.split(/\s+-\s+/);
  const startMins = timeToMinutes(startTime);
  const fallbackStartTime = minutesToTime(startMins);
  const fallbackEndTime = minutesToTime(startMins + defaultVisitDurationMinutes);

  return {
    startTime: startTime || fallbackStartTime,
    endTime: endTime || fallbackEndTime
  };
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrentTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false
  });
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function CalendarEmptyState() {
  return (
    <div className="cal-empty-state">
      <p>No visits scheduled.</p>
      <span>Approved visit requests will appear here.</span>
    </div>
  );
}

function isRemovedVisitRequest(request) {
  const visitorName = request.visitorName || request.familyName || "";

  return (
    request.requestedDate === "2026-05-21" &&
    request.requestedTime === "3:30 PM - 4:30 PM" &&
    visitorName === "Robert Adams"
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
  const { currentUser } = useAuth();
  const [todayDate, setTodayDate] = useState(getLocalToday);
  const [currentDate, setCurrentDate] = useState(getLocalToday);
  const [now, setNow] = useState(() => new Date());
  const [scheduledVisits, setScheduledVisits] = useState([]);
  const [scheduledVisitsStatus, setScheduledVisitsStatus] = useState("loading");
  const [pendingList, setPendingList] = useState([]);
  const [pendingStatus, setPendingStatus] = useState("loading");
  const [updatingRequestIds, setUpdatingRequestIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const selectedDateKey = toDateString(currentDate);
  const todayDateKey = toDateString(todayDate);
  const reviewerName = currentUser?.displayName || currentUser?.email || "Staff";
  const mockApprovedVisits = useMemo(
    () =>
      schedulingPageData.mockVisitRequests.filter(
        (request) => request.status === "approved" && request.requestedDate === selectedDateKey
      ),
    [selectedDateKey]
  );
  const mockPendingVisits = useMemo(
    () =>
      schedulingPageData.mockVisitRequests.filter((request) => request.status === "pending"),
    []
  );

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextNow = new Date();
      const nextTodayDate = getLocalToday();

      setNow(nextNow);
      setTodayDate((previousTodayDate) => {
        if (toDateString(previousTodayDate) !== toDateString(nextTodayDate)) {
          setCurrentDate((selectedDate) =>
            toDateString(selectedDate) === toDateString(previousTodayDate)
              ? nextTodayDate
              : selectedDate
          );
        }

        return nextTodayDate;
      });
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!db) {
      setScheduledVisits([]);
      setScheduledVisitsStatus("error");
      return undefined;
    }

    setScheduledVisitsStatus("loading");

    return listenToApprovedVisitRequestsForDate(
      db,
      selectedDateKey,
      (requests) => {
        setScheduledVisits(requests);
        setScheduledVisitsStatus("ready");
      },
      () => {
        setScheduledVisits([]);
        setScheduledVisitsStatus("error");
      }
    );
  }, [selectedDateKey]);

  const hours = Array.from({ length: HOURS_SHOWN }, (_, i) => DAY_START_HOUR + i);

  const pendingAppointments = useMemo(
    () =>
      [...mockPendingVisits, ...pendingList].filter((request) => !isRemovedVisitRequest(request)).map((request) => ({
        id: request.id,
        name: request.visitorName || request.familyName,
        relation: request.residentName,
        room: request.residentRoom,
        date: request.requestedDate,
        time: request.requestedTime,
        notes: request.notes
      })),
    [mockPendingVisits, pendingList]
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
      await updateVisitRequestStatus(db, id, "approved", reviewerName);
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
      await updateVisitRequestStatus(db, id, "declined", reviewerName);
      setStatusMessage("Appointment declined.");
    } catch {
      setStatusMessage("Could not decline appointment. Check your Firebase connection.");
    } finally {
      setRequestUpdating(id, false);
    }
  }

  const visibleEvents = useMemo(
    () =>
      scheduledVisits
        .filter((request) => !isRemovedVisitRequest(request))
        .concat(mockApprovedVisits)
        .map((request) => {
          const { startTime, endTime } = getVisitTimeRange(request.requestedTime);

          return {
            id: request.id,
            title: `${request.visitorName || request.familyName || "Visitor"} Visiting`,
            subtitle: request.residentName || "Resident visit",
            room: request.residentRoom || "",
            startTime,
            endTime
          };
        })
        .sort((firstEvent, secondEvent) =>
          timeToMinutes(firstEvent.startTime) - timeToMinutes(secondEvent.startTime)
        ),
    [mockApprovedVisits, scheduledVisits]
  );

  const nowMins = now.getHours() * 60 + now.getMinutes();
  const showCurrentTimeLine =
    selectedDateKey === todayDateKey &&
    nowMins >= DAY_START_HOUR * 60 &&
    nowMins <= DAY_END_HOUR * 60;
  const nowTop = ((nowMins - DAY_START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const totalGridHeight = HOURS_SHOWN * HOUR_HEIGHT;

  return (
    <StaffAppShell onStubNavigate={() => {}}>
      <div className="visits-page-header">
        <div>
          <p className="eyebrow">Appointments</p>
          <h1 className="page-title">Today's Visits</h1>
        </div>
      </div>

      {statusMessage ? (
        <p className="status-message" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}

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

              {showCurrentTimeLine ? (
                <div
                  className="cal-now-line"
                  style={{ top: nowTop}}
                  aria-hidden="true"
                >
                  <span className="cal-now-time-label">{formatCurrentTime(now)}</span>
                </div>
              ) : null}

              {/* Events */}
              <div className="cal-events-column">
                {visibleEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} />
                ))}
              </div>

              {scheduledVisitsStatus === "ready" && visibleEvents.length === 0 ? (
                <CalendarEmptyState />
              ) : null}
            </div>
          </div>
        </section>

        {/* ── Pending appointments panel ── */}
        <aside className="pending-panel" aria-label="Pending appointments">
          <h2 className="pending-panel-title">Pending Appointments</h2>

          {pendingStatus === "loading" && pendingAppointments.length === 0 ? (
            <p className="pending-panel-empty">Loading pending appointments...</p>
          ) : null}

          {pendingStatus === "error" && pendingAppointments.length === 0 ? (
            <p className="pending-panel-empty">
              Pending appointments are unavailable right now.
            </p>
          ) : null}

          {pendingStatus === "ready" && pendingAppointments.length === 0 ? (
            <p className="pending-panel-empty">No pending appointments.</p>
          ) : null}

          {pendingAppointments.length ? (
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
