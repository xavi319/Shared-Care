import { useState } from "react";
import {
  FaBed,
  FaChevronLeft,
  FaFloppyDisk,
  FaHandHoldingHeart,
  FaPeopleGroup,
  FaRegClipboard,
  FaRegFaceSmile,
  FaShieldHalved,
  FaUtensils
} from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";

import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  currentDemoStaffName,
  dailyLogFormOptions,
  getDailyLogEntryByResidentId,
  getCanonicalDailyLogResidentId,
  getDailyLogRequiredDate,
  updateDailyLogEntry,
  dashboardData,
  residentsPageData
} from "../data/mockData";
import { db } from "../lib/firebase";
import { saveDailyLogToFirestore } from "../services/dailyLogService";
import NotFoundPage from "./NotFoundPage";

const residentsById = new Map(
  [...dashboardData.residents, ...residentsPageData.residents].flatMap((resident) => [
    [resident.id, resident],
    [getCanonicalDailyLogResidentId(resident.id), resident]
  ])
);

function getTimestampLabel(dateKey = getDailyLogRequiredDate()) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${dateKey} ${hours}:${minutes}`;
}

const fieldConfig = {
  mood: {
    title: "Mood",
    icon: FaRegFaceSmile,
    tone: "blue"
  },
  meals: {
    title: "Meals",
    icon: FaUtensils,
    tone: "green"
  },
  activityEngagement: {
    title: "Activity & Engagement",
    icon: FaPeopleGroup,
    tone: "purple"
  },
  assistanceLevel: {
    title: "Assistance Level",
    icon: FaHandHoldingHeart,
    tone: "orange"
  },
  safety: {
    title: "Safety",
    icon: FaShieldHalved,
    tone: "red"
  }
};

const overviewFields = ["mood", "meals", "activityEngagement", "assistanceLevel", "safety"];

function normalizeOptionValue(value, options) {
  if (!value) {
    return "";
  }

  const matchingOption = options.find((option) => option.toLowerCase() === value.toLowerCase());

  return matchingOption ?? value;
}

function OptionGroup({ config, name, options, value, onChange, wide = false }) {
  const fieldId = `daily-log-${name}`;
  const Icon = config.icon;

  return (
    <fieldset className={`daily-log-form-section daily-log-form-section--${config.tone}${wide ? " daily-log-form-section--wide" : ""}`}>
      <legend className="daily-log-form-title" id={`${fieldId}-legend`}>
        <Icon className="daily-log-section-icon" aria-hidden="true" />
        <span>{config.title}</span>
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

function QuickOverview({ formState }) {
  return (
    <section className="daily-log-overview" aria-labelledby="daily-log-overview-title">
      <h3 className="daily-log-overview-title" id="daily-log-overview-title">
        Quick overview
      </h3>
      <div className="daily-log-overview-list">
        {overviewFields.map((fieldName) => {
          const config = fieldConfig[fieldName];
          const Icon = config.icon;
          const value = formState[fieldName] || "Not selected";

          return (
            <div className={`daily-log-overview-row daily-log-overview-row--${config.tone}`} key={fieldName}>
              <span className="daily-log-overview-label">
                <Icon className="daily-log-overview-icon" aria-hidden="true" />
                <span>{config.title}</span>
              </span>
              <span className="daily-log-overview-value">{value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DailyLogSubmissionPage() {
  const navigate = useNavigate();
  const { residentId } = useParams();
  const requiredDate = getDailyLogRequiredDate();

  const resident = residentsById.get(residentId ?? "");
  const existingEntry = residentId ? getDailyLogEntryByResidentId(residentId, requiredDate) : null;
  const currentEntry = existingEntry ?? {
    date: requiredDate,
    mood: "",
    meals: "",
    activityEngagement: "",
    assistanceLevel: "",
    safety: "",
    notes: ""
  };
  const [formState, setFormState] = useState(() => ({
    mood: currentEntry.mood ?? "",
    meals: currentEntry.meals ?? "",
    activityEngagement: currentEntry.activityEngagement ?? "",
    assistanceLevel: currentEntry.assistanceLevel ?? "",
    safety: normalizeOptionValue(currentEntry.safety ?? "", dailyLogFormOptions.safety),
    notes: currentEntry.notes ?? ""
  }));
  const [errors, setErrors] = useState({});
  const isEditingExistingReport = existingEntry?.reportStatus === "submitted";

  if (!resident) {
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

  async function handleSubmit(event) {
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

    const createdAt = getTimestampLabel(requiredDate);
    const summary = formState.notes.trim();

    const savedEntry = updateDailyLogEntry(resident.id, {
      staffName: currentDemoStaffName,
      caregiverName: currentDemoStaffName,
      caregiver: currentDemoStaffName,
      residentId: getCanonicalDailyLogResidentId(resident.id),
      residentName: resident.name,
      residentRoom: resident.room,
      createdAt,
      mood: formState.mood,
      meals: formState.meals,
      activityEngagement: formState.activityEngagement,
      assistanceLevel: formState.assistanceLevel,
      safety: formState.safety,
      summary,
      notes: summary,
      visibleToFamily: true,
      actionTone: "default",
      reportStatus: "submitted",
      status: "completed",
      date: createdAt
    });

    try {
      await saveDailyLogToFirestore(db, savedEntry);
    } catch {
      // Keep the local demo flow working even if Firestore is unavailable.
    }

    navigate("/daily-logs", {
      state: {
        statusMessage: `Daily log ${isEditingExistingReport ? "updated" : "submitted"} for ${resident.name}.`
      }
    });
  }

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
        </div>

        <div className="daily-log-submit-header-actions">
          <div className="daily-log-room-card">
            <FaBed aria-hidden="true" />
            <span>Room {resident.room.replace("Room ", "")}</span>
          </div>
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/daily-logs")}
            aria-label="Back to daily logs"
          >
            <FaChevronLeft aria-hidden="true" />
          </button>
        </div>
      </div>

      <form className="daily-log-submit-layout" onSubmit={handleSubmit}>
        <section className="daily-log-submit-main">
          <div className="daily-log-submit-grid">
            <div className={`daily-log-form-group${errors.mood ? " has-error" : ""}`}>
              <OptionGroup
                config={fieldConfig.mood}
                name="mood"
                options={dailyLogFormOptions.mood}
                value={formState.mood}
                onChange={(value) => updateField("mood", value)}
              />
              {errors.mood ? <p className="daily-log-field-error">{errors.mood}</p> : null}
            </div>

            <div className={`daily-log-form-group${errors.meals ? " has-error" : ""}`}>
              <OptionGroup
                config={fieldConfig.meals}
                name="meals"
                options={dailyLogFormOptions.meals}
                value={formState.meals}
                onChange={(value) => updateField("meals", value)}
              />
              {errors.meals ? <p className="daily-log-field-error">{errors.meals}</p> : null}
            </div>

            <div className={`daily-log-form-group${errors.activityEngagement ? " has-error" : ""}`}>
              <OptionGroup
                config={fieldConfig.activityEngagement}
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
                config={fieldConfig.assistanceLevel}
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
              config={fieldConfig.safety}
              name="safety"
              options={dailyLogFormOptions.safety}
              value={formState.safety}
              onChange={(value) => updateField("safety", value)}
              wide
            />
          </div>
        </section>

        <aside className="daily-log-submit-sidebar">
          <h2 className="daily-log-sidebar-title">
            <FaRegClipboard className="daily-log-section-icon" aria-hidden="true" />
            <span>Notes & Summary</span>
          </h2>
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
          <QuickOverview formState={formState} />
          <button className="daily-log-submit-button" type="submit">
            <FaFloppyDisk aria-hidden="true" />
            Update daily log
          </button>
          <button className="daily-log-cancel-button" type="button" onClick={() => navigate("/daily-logs")}>
            Cancel
          </button>
        </aside>
      </form>
    </StaffAppShell>
  );
}
