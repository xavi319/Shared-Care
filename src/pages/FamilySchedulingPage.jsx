import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { ChevronLeftIcon } from "../components/layout/icons";
import { familyData } from "../data/mockData";

export default function FamilySchedulingPage() {
  const navigate = useNavigate();
  const { resident, visitor } = familyData;
  const [statusMessage, setStatusMessage] = useState("");
  const [formState, setFormState] = useState({
    resident: `${resident.name} - ${resident.room}`,
    visitorName: visitor.name,
    date: "",
    time: "",
    notes: ""
  });

  function updateField(field, value) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setStatusMessage("Visit request submitted for staff review.");
  }

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
                  />
                </label>

                <label className="family-visit-field">
                  <span>Time</span>
                  <input
                    type="text"
                    placeholder="--:-- --"
                    value={formState.time}
                    onChange={(event) => updateField("time", event.target.value)}
                  />
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

              <button className="family-visit-submit" type="submit">
                Submit Request
              </button>
            </div>
          </div>

          <p className="status-message family-visit-status" aria-live="polite">
            {statusMessage}
          </p>
        </form>
      </section>
    </FamilyAppShell>
  );
}
