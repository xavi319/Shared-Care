import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentIcon,
  GiftVisitIcon,
  InfoIcon,
  ShieldIcon,
  UserGroupVisitIcon,
  UserIcon,
  VideoVisitIcon
} from "../components/layout/icons";
import { familyData } from "../data/mockData";
import { db } from "../lib/firebase";
import {
  getFallbackFamilyResident,
  listenToResidentsForFamily,
  toFamilyResident
} from "../services/residentService";
import {
  cancelVisitRequest,
  createVisitRequest,
  listenToFamilyVisitRequests
} from "../services/visitRequestService";

const familyUserId = "family_robert_adams";
const maxNoteLength = 250;

const statusLabelByValue = {
  pending: "Pending Approval",
  approved: "Approved",
  declined: "Declined"
};

const visitTypes = [
  {
    value: "in-person",
    title: "In-Person Visit",
    description: "At the facility",
    icon: UserGroupVisitIcon
  },
  {
    value: "video",
    title: "Video Visit",
    description: "Virtual visit",
    icon: VideoVisitIcon
  },
  {
    value: "special-occasion",
    title: "Special Occasion",
    description: "Birthday, holiday, etc.",
    icon: GiftVisitIcon
  }
];

const timeOptions = [
  "9:00 AM - 10:00 AM",
  "10:30 AM - 11:30 AM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:30 PM - 4:30 PM",
  "6:00 PM - 7:00 PM"
];

const guidelines = [
  {
    title: "Visiting Hours",
    copy: "8:00 AM - 8:00 PM, daily",
    icon: ClockIcon
  },
  {
    title: "Max Visitors",
    copy: "Up to 4 visitors at a time",
    icon: UserGroupVisitIcon
  },
  {
    title: "Health & Safety",
    copy: "Please do not visit if you are sick.",
    icon: ShieldIcon
  },
  {
    title: "Need to Reschedule?",
    copy: "You can cancel or reschedule anytime from your dashboard.",
    icon: InfoIcon
  }
];

function getVisitRequestStatusLabel(status) {
  return statusLabelByValue[status] ?? "Pending Approval";
}

function getFormattedVisitDate(value) {
  if (!value) {
    return "Date pending";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

export default function FamilySchedulingPage() {
  const navigate = useNavigate();
  const { visitor } = familyData;
  const [resident, setResident] = useState(() => getFallbackFamilyResident(familyUserId));
  const [statusMessage, setStatusMessage] = useState("");
  const [requestsStatus, setRequestsStatus] = useState("loading");
  const [visitRequests, setVisitRequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancellingRequestIds, setCancellingRequestIds] = useState([]);
  const [formState, setFormState] = useState({
    visitorName: visitor.name,
    date: "",
    time: timeOptions[3],
    visitType: visitTypes[0].value,
    notes: ""
  });

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
      setRequestsStatus("error");
      return undefined;
    }

    setRequestsStatus("loading");

    return listenToFamilyVisitRequests(
      db,
      familyUserId,
      (requests) => {
        setVisitRequests(requests);
        setRequestsStatus("ready");
      },
      () => {
        setRequestsStatus("error");
      }
    );
  }, []);

  function updateField(field, value) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: field === "notes" ? value.slice(0, maxNoteLength) : value
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  }

  function setRequestCancelling(id, isCancelling) {
    setCancellingRequestIds((currentIds) =>
      isCancelling ? [...currentIds, id] : currentIds.filter((currentId) => currentId !== id)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      visitorName: formState.visitorName.trim() ? "" : "Enter your name.",
      date: formState.date.trim() ? "" : "Enter a visit date.",
      time: formState.time.trim() ? "" : "Choose a visit time."
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      setStatusMessage("Add the required visit details before submitting.");
      return;
    }

    if (!db) {
      setStatusMessage("Visit requests are unavailable because Firebase is not configured.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createVisitRequest(db, {
        residentId: resident.id,
        residentName: resident.name,
        residentRoom: resident.room,
        familyUserId,
        familyName: visitor.name,
        visitorName: formState.visitorName.trim() || visitor.name,
        requestedDate: formState.date.trim(),
        requestedTime: formState.time.trim(),
        visitType: formState.visitType,
        notes: formState.notes
      });
      setFormState((currentState) => ({
        ...currentState,
        date: "",
        notes: ""
      }));
      setStatusMessage("Visit request submitted.");
    } catch {
      setStatusMessage("Could not submit visit request. Check your Firebase connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancelRequest(requestId) {
    if (!db) {
      setStatusMessage("Visit requests are unavailable because Firebase is not configured.");
      return;
    }

    try {
      setRequestCancelling(requestId, true);
      await cancelVisitRequest(db, requestId);
      setStatusMessage("Visit request cancelled.");
    } catch {
      setStatusMessage("Could not cancel visit request. Check your Firebase connection.");
    } finally {
      setRequestCancelling(requestId, false);
    }
  }

  const requestCountLabel = useMemo(() => {
    if (requestsStatus !== "ready") {
      return "";
    }

    return `${visitRequests.length} request${visitRequests.length === 1 ? "" : "s"}`;
  }, [requestsStatus, visitRequests.length]);

  return (
    <FamilyAppShell>
      <section className="family-scheduling-header">
        <button
          className="family-scheduling-back"
          type="button"
          onClick={() => navigate("/family")}
        >
          <ChevronLeftIcon />
          <span>Back to Dashboard</span>
        </button>
        <div className="family-scheduling-title-group">
          <h1 className="page-title page-title--compact">Request a New Visit</h1>
          <p>Schedule a visit with your loved one.</p>
        </div>
      </section>

      <section className="family-visit-shell" aria-labelledby="family-visit-title">
        <form className="family-visit-form" onSubmit={handleSubmit}>
          <label className="family-visit-field family-visit-field--resident">
            <span>Select Resident</span>
            <span className="family-resident-select" aria-label={`${resident.name}, ${resident.room}`}>
              <span className="family-resident-select-main">
                <span className="family-resident-avatar family-resident-avatar--small">
                  {resident.image ? <img src={resident.image} alt="" /> : resident.name.charAt(0)}
                </span>
                <span>
                  <strong>{resident.name}</strong>
                  <small>{resident.room}</small>
                </span>
              </span>
              <ChevronDownIcon />
            </span>
          </label>

          <label className="family-visit-field">
            <span>Visitor Name</span>
            <span className="family-visit-input-wrap">
              <UserIcon />
              <input
                type="text"
                value={formState.visitorName}
                onChange={(event) => updateField("visitorName", event.target.value)}
                aria-invalid={errors.visitorName ? "true" : "false"}
              />
            </span>
            {errors.visitorName ? <span className="family-visit-field-error">{errors.visitorName}</span> : null}
          </label>

          <div className="family-visit-inline-fields">
            <label className="family-visit-field">
              <span>Visit Date</span>
              <span className="family-visit-input-wrap">
                <CalendarIcon />
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) => updateField("date", event.target.value)}
                  aria-invalid={errors.date ? "true" : "false"}
                />
              </span>
              {errors.date ? <span className="family-visit-field-error">{errors.date}</span> : null}
            </label>

            <label className="family-visit-field">
              <span>Visit Time</span>
              <span className="family-visit-input-wrap family-visit-input-wrap--select">
                <ClockIcon />
                <select
                  value={formState.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  aria-invalid={errors.time ? "true" : "false"}
                >
                  {timeOptions.map((timeOption) => (
                    <option key={timeOption} value={timeOption}>
                      {timeOption}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon />
              </span>
              {errors.time ? <span className="family-visit-field-error">{errors.time}</span> : null}
            </label>
          </div>

          <fieldset className="family-visit-type-group">
            <legend>Visit Type</legend>
            <div className="family-visit-type-options">
              {visitTypes.map((visitType) => {
                const VisitIcon = visitType.icon;
                const isSelected = formState.visitType === visitType.value;

                return (
                  <label
                    key={visitType.value}
                    className={`family-visit-type-card${isSelected ? " is-selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="visitType"
                      value={visitType.value}
                      checked={isSelected}
                      onChange={(event) => updateField("visitType", event.target.value)}
                    />
                    <span className="family-visit-type-icon">
                      <VisitIcon />
                    </span>
                    <span>
                      <strong>{visitType.title}</strong>
                      <small>{visitType.description}</small>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="family-visit-field">
            <span>Add a Note (Optional)</span>
            <span className="family-visit-notes-wrap">
              <textarea
                value={formState.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Example: Celebrating Beth's birthday!"
                aria-label="Visit request notes"
              />
              <small>{formState.notes.length}/{maxNoteLength}</small>
            </span>
          </label>

          <div className="family-visit-note">
            <InfoIcon />
            <p>
              <strong>Note:</strong> Visit requests are subject to availability and facility guidelines.
            </p>
          </div>

          <button className="family-visit-submit" type="submit" disabled={isSubmitting}>
            <CalendarIcon />
            {isSubmitting ? "Submitting..." : "Submit Visit Request"}
          </button>

          <p className="status-message family-visit-status" aria-live="polite">
            {statusMessage}
          </p>
        </form>

        <aside className="family-visit-info-panel" aria-label="Resident and visiting information">
          <section className="family-about-card" aria-labelledby="family-about-title">
            <h2 id="family-about-title">About Beth</h2>
            <div className="family-about-resident">
              <span className="family-resident-avatar">
                {resident.image ? <img src={resident.image} alt="" /> : resident.name.charAt(0)}
              </span>
              <div>
                <p>{resident.name}</p>
                <span>{resident.room}</span>
                {resident.detailPath ? (
                  <Link className="family-profile-link" to={resident.detailPath}>
                    View Profile
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="family-welcome-callout">
              <CheckIcon />
              <div>
                <p>Visits are welcome!</p>
                <span>Beth enjoys visits from family and looks forward to seeing you.</span>
              </div>
            </div>
          </section>

          <section className="family-guidelines-card" aria-labelledby="family-guidelines-title">
            <h2 id="family-guidelines-title">Visit Guidelines</h2>
            <ul className="family-guidelines-list">
              {guidelines.map((guideline) => {
                const GuidelineIcon = guideline.icon;

                return (
                  <li key={guideline.title}>
                    <span className="family-guideline-icon">
                      <GuidelineIcon />
                    </span>
                    <span>
                      <strong>{guideline.title}</strong>
                      <small>{guideline.copy}</small>
                    </span>
                  </li>
                );
              })}
            </ul>
            <button className="family-policy-button" type="button">
              <DocumentIcon />
              <span>View Full Visiting Policy</span>
              <ChevronRightIcon />
            </button>
          </section>
        </aside>
      </section>

      <section className="family-visit-requests" aria-labelledby="family-visit-requests-title">
        <div className="family-visit-requests-header">
          <h2 id="family-visit-requests-title">Your Submitted Requests</h2>
          {requestCountLabel ? <p>{requestCountLabel}</p> : null}
        </div>

        {requestsStatus === "loading" ? (
          <div className="family-visit-requests-state">
            <p>Loading visit requests...</p>
          </div>
        ) : null}

        {requestsStatus === "error" ? (
          <div className="family-visit-requests-state">
            <p>Visit requests are unavailable right now.</p>
            <span>Check your Firebase connection and try again.</span>
          </div>
        ) : null}

        {requestsStatus === "ready" && !visitRequests.length ? (
          <div className="family-visit-requests-state family-visit-requests-state--empty">
            <CalendarIcon />
            <p>No visit requests yet</p>
            <span>Submitted visit requests will appear here.</span>
          </div>
        ) : null}

        {requestsStatus === "ready" && visitRequests.length ? (
          <ul className="family-visit-requests-list">
            {visitRequests.map((request) => (
              <li key={request.id} className="family-visit-request-card">
                <div className="family-visit-request-date-block">
                  <span className="family-request-icon">
                    <CalendarIcon />
                  </span>
                  <div>
                    <p className="family-visit-request-date">
                      {getFormattedVisitDate(request.requestedDate)}
                    </p>
                    <p className="family-visit-request-time">{request.requestedTime}</p>
                  </div>
                </div>
                <div className="family-visit-request-resident">
                  <p>{request.residentName || resident.name}</p>
                  <span>{request.residentRoom || resident.room}</span>
                </div>
                <span className={`family-visit-request-status family-visit-request-status--${request.status}`}>
                  {getVisitRequestStatusLabel(request.status)}
                </span>
                {request.status === "pending" ? (
                  <button
                    className="family-cancel-request-button"
                    type="button"
                    onClick={() => handleCancelRequest(request.id)}
                    disabled={cancellingRequestIds.includes(request.id)}
                  >
                    {cancellingRequestIds.includes(request.id) ? "Cancelling..." : "Cancel Request"}
                  </button>
                ) : null}
                <ChevronDownIcon className="family-request-chevron" />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </FamilyAppShell>
  );
}
