import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeftIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  dailyLogFormOptions,
  getDailyLogEntryByResidentId,
  updateDailyLogEntry,
  dashboardData,
  residentsPageData
} from "../data/mockData";
import NotFoundPage from "./NotFoundPage";

const residentsById = new Map(
  [...dashboardData.residents, ...residentsPageData.residents].map((resident) => [resident.id, resident])
);

function formatEntryDate(value) {
  const date = value ? new Date(value.replace(" ", "T")) : new Date();

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

function getTimestampLabel() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function OptionGroup({ title, name, options, value, onChange }) {
  const fieldId = `daily-log-${name}`;

  return (
    <fieldset className="daily-log-form-section">
      <legend className="daily-log-form-title" id={`${fieldId}-legend`}>
        {title}
      </legend>
      <div className="daily-log-option-list" role="radiogroup" aria-labelledby={`${fieldId}-legend`}>
        {options.map((option) => {
          const checked = value === option;
          const optionId = `${fieldId}-${option.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

          return (
            <label key={option} className={`daily-log-option${checked ? " is-selected" : ""}`}>
              <input
                id={optionId}
                className="daily-log-option-input"
                type="radio"
                name={name}
                value={option}
                checked={checked}
                onChange={() => onChange(option)}
              />
              <span className="daily-log-option-indicator" aria-hidden="true" />
              <span className="daily-log-option-label">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DailyLogSubmissionPage() {
  const navigate = useNavigate();
  const { residentId } = useParams();

  const resident = residentsById.get(residentId ?? "");
  const existingEntry = residentId ? getDailyLogEntryByResidentId(residentId) : null;
  const [formState, setFormState] = useState(() => ({
    mood: existingEntry?.mood ?? "",
    meals: existingEntry?.meals ?? "",
    activityEngagement: existingEntry?.activityEngagement ?? "",
    assistanceLevel: existingEntry?.assistanceLevel ?? "",
    safety: existingEntry?.safety ?? "",
    notes: existingEntry?.notes ?? ""
  }));
  const [errors, setErrors] = useState({});
  const isEditingExistingReport = existingEntry?.reportStatus === "submitted";

  if (!resident || !existingEntry) {
    return (
      <NotFoundPage
        title="Daily Log Not Found"
        description="That daily log submission flow has not been mocked in SharedCare yet."
        actionLabel="Back to daily logs"
        actionTo="/daily-logs"
      />
    );
  }

  function updateField(field, value) {
    setFormState((currentState) => ({ ...currentState, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      mood: formState.mood ? "" : "Select a mood before submitting.",
      meals: formState.meals ? "" : "Select a meals response before submitting.",
      activityEngagement: formState.activityEngagement
        ? ""
        : "Select an activity and engagement response before submitting.",
      assistanceLevel: formState.assistanceLevel
        ? ""
        : "Select an assistance level before submitting."
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    updateDailyLogEntry(resident.id, {
      mood: formState.mood,
      meals: formState.meals,
      activityEngagement: formState.activityEngagement,
      assistanceLevel: formState.assistanceLevel,
      safety: formState.safety,
      notes: formState.notes.trim(),
      actionTone: "default",
      reportStatus: "submitted",
      status: "completed",
      date: getTimestampLabel()
    });

    navigate("/daily-logs", {
      state: {
        statusMessage: `Daily log ${isEditingExistingReport ? "updated" : "submitted"} for ${resident.name}.`
      }
    });
  }

  const pendingContext = !isEditingExistingReport
    ? "This resident still has a daily log pending submission."
    : "Review the current selections and update this resident's daily log as needed.";
  const notesHelpText = "Summarize the resident's day, key observations, and any follow-up needed.";
  const notesError = errors.notes;

  return (
    <StaffAppShell onStubNavigate={() => {}}>
      <div className="daily-log-submit-header">
        <div className="daily-log-submit-title-block">
          <p className="eyebrow">Residents</p>
          <h1 className="page-title">
            {isEditingExistingReport ? "Edit Daily Log" : "Daily Logs"} - {resident.name}
          </h1>
          <p className="daily-log-submit-date">{formatEntryDate(existingEntry.date)}</p>
          <p className="daily-log-submit-context">{pendingContext}</p>
        </div>

        <div className="daily-log-submit-header-actions">
          <div className="daily-log-room-card">Room {resident.room.replace("Room ", "")}</div>
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/daily-logs")}
            aria-label="Back to daily logs"
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>

      <form className="daily-log-submit-layout" onSubmit={handleSubmit}>
        <section className="daily-log-submit-main">
          <div className="daily-log-submit-grid">
            <div className={`daily-log-form-group${errors.mood ? " has-error" : ""}`}>
              <OptionGroup
                title="Mood"
                name="mood"
                options={dailyLogFormOptions.mood}
                value={formState.mood}
                onChange={(value) => updateField("mood", value)}
              />
              {errors.mood ? <p className="daily-log-field-error">{errors.mood}</p> : null}
            </div>

            <div className={`daily-log-form-group${errors.meals ? " has-error" : ""}`}>
              <OptionGroup
                title="Meals"
                name="meals"
                options={dailyLogFormOptions.meals}
                value={formState.meals}
                onChange={(value) => updateField("meals", value)}
              />
              {errors.meals ? <p className="daily-log-field-error">{errors.meals}</p> : null}
            </div>

            <div className={`daily-log-form-group${errors.activityEngagement ? " has-error" : ""}`}>
              <OptionGroup
                title="Activity & Engagement"
                name="activityEngagement"
                options={dailyLogFormOptions.activityEngagement}
                value={formState.activityEngagement}
                onChange={(value) => updateField("activityEngagement", value)}
              />
              {errors.activityEngagement ? (
                <p className="daily-log-field-error">{errors.activityEngagement}</p>
              ) : null}
            </div>

            <div className={`daily-log-form-group${errors.assistanceLevel ? " has-error" : ""}`}>
              <OptionGroup
                title="Assistance Level"
                name="assistanceLevel"
                options={dailyLogFormOptions.assistanceLevel}
                value={formState.assistanceLevel}
                onChange={(value) => updateField("assistanceLevel", value)}
              />
              {errors.assistanceLevel ? (
                <p className="daily-log-field-error">{errors.assistanceLevel}</p>
              ) : null}
            </div>

            <OptionGroup
              title="Safety"
              name="safety"
              options={dailyLogFormOptions.safety}
              value={formState.safety}
              onChange={(value) => updateField("safety", value)}
            />
          </div>
        </section>

        <aside className="daily-log-submit-sidebar">
          <h2 className="daily-log-sidebar-title">Notes & Summary</h2>
          <label className="daily-log-notes-label" htmlFor="daily-log-notes">
            Shift summary
          </label>
          <p className="daily-log-notes-help">{notesHelpText}</p>
          <textarea
            id="daily-log-notes"
            className="daily-log-notes-input"
            value={formState.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder={`Add a summary for ${resident.name}'s day, notable observations, and any follow-up details.`}
            aria-describedby="daily-log-notes-help"
            aria-invalid={notesError ? "true" : "false"}
          />
          <p className="daily-log-notes-help" id="daily-log-notes-help">
            This note appears alongside the resident's completed daily log entry.
          </p>
          <button className="daily-log-submit-button" type="submit">
            {isEditingExistingReport ? "Update daily log" : "Submit daily log"}
          </button>
        </aside>
      </form>
    </StaffAppShell>
  );
}
