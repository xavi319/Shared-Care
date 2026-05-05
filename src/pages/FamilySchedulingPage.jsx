import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { ChevronLeftIcon } from "../components/layout/icons";
import { familyData } from "../data/mockData";
import { db } from "../lib/firebase";
import {
  createVisitRequest,
  listenToFamilyVisitRequests
} from "../services/visitRequestService";

const familyUserId = "family_robert_adams";

const statusLabelByValue = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined"
};

function getVisitRequestStatusLabel(status) {
  return statusLabelByValue[status] ?? "Pending";
}

export default function FamilySchedulingPage() {
  const navigate = useNavigate();
  const { resident, visitor } = familyData;
  const [statusMessage, setStatusMessage] = useState("");
  const [requestsStatus, setRequestsStatus] = useState("loading");
  const [visitRequests, setVisitRequests] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    resident: `${resident.name} - ${resident.room}`,
    visitorName: visitor.name,
    date: "",
    time: "",
    notes: ""
  });

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
      [field]: value
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      date: formState.date.trim() ? "" : "Enter a visit date.",
      time: formState.time.trim() ? "" : "Enter a visit time."
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      setStatusMessage("Add a date and time before submitting.");
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
        notes: formState.notes
      });
      setFormState((currentState) => ({
        ...currentState,
        date: "",
        time: "",
        notes: ""
      }));
      setStatusMessage("Visit request submitted.");
    } catch {
      setStatusMessage("Could not submit visit request. Check your Firebase connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const requestCountLabel = useMemo(() => {
    if (requestsStatus !== "ready") {
      return "";
    }

    return `${visitRequests.length} submitted request${visitRequests.length === 1 ? "" : "s"}`;
  }, [requestsStatus, visitRequests.length]);

  return (
    <FamilyAppShell>
      <section className="family-scheduling-header">
        <div>
          <p className="eyebrow">Scheduling</p>
          <h1 className="page-title page-title--compact">Family Visit Scheduler</h1>
        </div>
        <button
          className="family-scheduling-back"
          type="button"
          onClick={() => navigate("/family")}
          aria-label="Back to family dashboard"
        >
          <ChevronLeftIcon />
        </button>
      </section>

      <section className="family-visit-panel" aria-labelledby="family-visit-title">
        <div className="family-visit-panel-header">
          <h2 id="family-visit-title">Request a New Visit</h2>
        </div>

        <form className="family-visit-form" onSubmit={handleSubmit}>
          <div className="family-visit-fields">
            <div className="family-visit-column">
              <label className="family-visit-field">
                <span>Resident</span>
                <input
                  type="text"
                  value={formState.resident}
                  onChange={(event) => updateField("resident", event.target.value)}
                />
              </label>

              <label className="family-visit-field">
                <span>Visitor Name (Your Name)</span>
                <input
                  type="text"
                  value={formState.visitorName}
                  onChange={(event) => updateField("visitorName", event.target.value)}
                />
              </label>

              <div className="family-visit-inline-fields">
                <label className="family-visit-field">
                  <span>Date</span>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={formState.date}
                    onChange={(event) => updateField("date", event.target.value)}
                    aria-invalid={errors.date ? "true" : "false"}
                  />
                  {errors.date ? <span className="family-visit-field-error">{errors.date}</span> : null}
                </label>

                <label className="family-visit-field">
                  <span>Time</span>
                  <input
                    type="text"
                    placeholder="--:-- --"
                    value={formState.time}
                    onChange={(event) => updateField("time", event.target.value)}
                    aria-invalid={errors.time ? "true" : "false"}
                  />
                  {errors.time ? <span className="family-visit-field-error">{errors.time}</span> : null}
                </label>
              </div>
            </div>

            <div className="family-visit-column">
              <label className="family-visit-field family-visit-field--notes">
                <span>Notes</span>
                <textarea
                  value={formState.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  aria-label="Visit request notes"
                />
              </label>

              <button className="family-visit-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>

          <p className="status-message family-visit-status" aria-live="polite">
            {statusMessage}
          </p>
        </form>

        <section className="family-visit-requests" aria-labelledby="family-visit-requests-title">
          <div className="family-visit-requests-header">
            <h3 id="family-visit-requests-title">Submitted Requests</h3>
            {requestCountLabel ? <p>{requestCountLabel}</p> : null}
          </div>

          {requestsStatus === "loading" ? (
            <p className="family-visit-requests-state">Loading visit requests...</p>
          ) : null}

          {requestsStatus === "error" ? (
            <p className="family-visit-requests-state">
              Visit requests are unavailable right now.
            </p>
          ) : null}

          {requestsStatus === "ready" && !visitRequests.length ? (
            <p className="family-visit-requests-state">No visit requests submitted yet.</p>
          ) : null}

          {requestsStatus === "ready" && visitRequests.length ? (
            <ul className="family-visit-requests-list">
              {visitRequests.map((request) => (
                <li key={request.id} className="family-visit-request-card">
                  <div>
                    <p className="family-visit-request-date">{request.requestedDate}</p>
                    <p className="family-visit-request-time">{request.requestedTime}</p>
                    {request.notes ? (
                      <p className="family-visit-request-notes">{request.notes}</p>
                    ) : null}
                  </div>
                  <span className={`family-visit-request-status family-visit-request-status--${request.status}`}>
                    {getVisitRequestStatusLabel(request.status)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </section>
    </FamilyAppShell>
  );
}
