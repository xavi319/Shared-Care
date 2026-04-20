import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { StatCard } from "../components/dashboard/StatCard";
import { ChartIcon, ChevronRightIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  checklistStorageKey,
  dashboardData,
  getResidentDetailBySlug,
  getResidentSlug,
  loadDailyLogEntries,
  messagesData,
  residentsPageData,
  schedulingPageData
} from "../data/mockData";
import { db } from "../lib/firebase";

const fallbackResidents = getUniqueById([...residentsPageData.residents, ...dashboardData.residents]);

const checklistTaskTemplates = [
  { id: "vitals", label: "Check vitals", time: "9:00 AM" },
  { id: "medications", label: "Administer medications", time: "10:00 AM" },
  { id: "hygiene", label: "Hygiene care", time: "11:00 AM" },
  { id: "feeding", label: "Feeding", time: "12:00 PM" }
];

function getGreetingForTime(date, userName) {
  const hour = date.getHours();
  let greetingPrefix = "Good evening";

  if (hour >= 5 && hour < 12) {
    greetingPrefix = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greetingPrefix = "Good afternoon";
  }

  return `${greetingPrefix}, ${userName}`;
}

function getGeneratedChecklistItems(residents, completionById = {}) {
  return residents.flatMap((resident) =>
    checklistTaskTemplates.map((template) => {
      const id = `${resident.id}-${template.id}`;

      return {
        id,
        residentId: resident.id,
        time: template.time,
        residentName: resident.name,
        room: resident.room,
        label: template.label,
        completed: Boolean(completionById[id])
      };
    })
  );
}

function mergeChecklistItemsForResidents(residents, currentItems) {
  const completionById = Object.fromEntries(
    currentItems.map((item) => [item.id, Boolean(item.completed)])
  );
  const temporaryItems = currentItems.filter((item) => item.isTemporary);

  return [...getGeneratedChecklistItems(residents, completionById), ...temporaryItems];
}

const emptyResidentForm = {
  firstName: "",
  lastName: "",
  image: "",
  roomNumber: "",
  residentId: "",
  age: "",
  dob: "",
  admissionDate: "",
  diagnoses: "",
  medications: ""
};

function loadChecklistItems(residents) {
  const storedValue = window.sessionStorage.getItem(checklistStorageKey);

  if (!storedValue) {
    return getGeneratedChecklistItems(residents);
  }

  try {
    const storedItems = JSON.parse(storedValue);

    if (!Array.isArray(storedItems)) {
      return getGeneratedChecklistItems(residents);
    }

    const completionById = Object.fromEntries(
      storedItems.map((item) => [item.id, Boolean(item.completed)])
    );

    return getGeneratedChecklistItems(residents, completionById);
  } catch {
    return getGeneratedChecklistItems(residents);
  }
}

function getUniqueById(items) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function getDateKey(value) {
  if (!value) {
    return "";
  }

  if (typeof value?.toDate === "function") {
    return getDateKey(value.toDate());
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10);
  }

  return date.toISOString().split("T")[0];
}

function getTodayKey(useMockScheduleDate) {
  return getDateKey(useMockScheduleDate ? schedulingPageData.initialDate : new Date());
}

function getVisitDate(visit) {
  return visit.date ?? visit.scheduledDate ?? visit.visitDate ?? visit.startDate ?? visit.startsAt;
}

function getUnreadMessagesCount(messages) {
  return messages.reduce((total, message) => {
    if (typeof message.unreadCount === "number") {
      return total + message.unreadCount;
    }

    if (typeof message.unread === "number") {
      return total + message.unread;
    }

    return total + (message.unread === true || message.isUnread === true || message.active === true ? 1 : 0);
  }, 0);
}

function getDashboardCounts({ residents, dailyLogs, visits, messages }, sourcesFromFirestore) {
  const todayKey = getTodayKey(!sourcesFromFirestore.visits);

  return {
    "pending-daily-logs": dailyLogs.filter((log) => log.status === "pending").length,
    residents: residents.length,
    "todays-visits": visits.filter((visit) => getDateKey(getVisitDate(visit)) === todayKey).length,
    messages: getUnreadMessagesCount(messages)
  };
}

function getInitialDashboardSources() {
  return {
    residents: fallbackResidents,
    dailyLogs: loadDailyLogEntries(),
    visits: schedulingPageData.events,
    messages: messagesData.contacts
  };
}

function getChecklistGroups(items, residents) {
  const itemsByResidentId = new Map();

  items.forEach((item) => {
    const residentId = item.residentId ?? "other";
    const currentItems = itemsByResidentId.get(residentId) ?? [];
    itemsByResidentId.set(residentId, [...currentItems, item]);
  });

  const residentGroups = residents.map((resident) => ({
    id: resident.id,
    name: resident.name,
    room: resident.room,
    items: itemsByResidentId.get(resident.id) ?? []
  }));
  const otherItems = itemsByResidentId.get("other") ?? [];

  return otherItems.length
    ? [...residentGroups, { id: "other", name: "Other tasks", room: "", items: otherItems }]
    : residentGroups;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeRoom(value) {
  const trimmedValue = value.trim();
  return trimmedValue.toLowerCase().startsWith("room") ? trimmedValue : `Room ${trimmedValue}`;
}

function parseList(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function createResidentFromForm(formState) {
  const name = `${formState.firstName.trim()} ${formState.lastName.trim()}`.trim();
  const residentSlug = slugify(name || formState.residentId || `resident-${Date.now()}`);

  return {
    id: residentSlug,
    slug: residentSlug,
    name,
    room: normalizeRoom(formState.roomNumber),
    lastUpdate: "New resident",
    lastUpdateLabel: "Daily Log last updated",
    image: formState.image,
    detailPath: `/residents/${residentSlug}`,
    residentId: formState.residentId.trim(),
    age: formState.age.trim(),
    dob: formState.dob,
    admissionDate: formState.admissionDate,
    diagnoses: parseList(formState.diagnoses),
    medications: parseList(formState.medications)
  };
}

function AddResidentModal({ onClose, onSubmit }) {
  const [formState, setFormState] = useState(emptyResidentForm);

  function updateField(field, value) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      updateField("image", "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateField("image", String(reader.result));
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(createResidentFromForm(formState));
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="resident-modal" role="dialog" aria-modal="true" aria-labelledby="add-resident-title">
        <div className="resident-modal-header">
          <div>
            <p className="panel-eyebrow">Assigned</p>
            <h2 className="resident-modal-title" id="add-resident-title">Add Resident</h2>
          </div>
          <button className="resident-modal-close" type="button" onClick={onClose} aria-label="Close add resident form">
            ×
          </button>
        </div>

        <form className="resident-modal-form" onSubmit={handleSubmit}>
          <div className="resident-modal-grid">
            <label className="resident-modal-field">
              <span>First Name</span>
              <input
                type="text"
                value={formState.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                required
              />
            </label>

            <label className="resident-modal-field">
              <span>Last Name</span>
              <input
                type="text"
                value={formState.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                required
              />
            </label>

            <label className="resident-modal-field">
              <span>Profile Picture</span>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            <label className="resident-modal-field">
              <span>Room Number</span>
              <input
                type="text"
                value={formState.roomNumber}
                onChange={(event) => updateField("roomNumber", event.target.value)}
                required
              />
            </label>

            <label className="resident-modal-field">
              <span>Resident ID</span>
              <input
                type="text"
                value={formState.residentId}
                onChange={(event) => updateField("residentId", event.target.value)}
                required
              />
            </label>

            <label className="resident-modal-field">
              <span>Age</span>
              <input
                type="number"
                min="0"
                value={formState.age}
                onChange={(event) => updateField("age", event.target.value)}
              />
            </label>

            <label className="resident-modal-field">
              <span>Date of Birth</span>
              <input
                type="date"
                value={formState.dob}
                onChange={(event) => updateField("dob", event.target.value)}
              />
            </label>

            <label className="resident-modal-field">
              <span>Admission Date</span>
              <input
                type="date"
                value={formState.admissionDate}
                onChange={(event) => updateField("admissionDate", event.target.value)}
              />
            </label>

            <label className="resident-modal-field resident-modal-field--wide">
              <span>Diagnoses</span>
              <textarea
                value={formState.diagnoses}
                onChange={(event) => updateField("diagnoses", event.target.value)}
                placeholder="Separate items with commas or new lines"
              />
            </label>

            <label className="resident-modal-field resident-modal-field--wide">
              <span>Medications</span>
              <textarea
                value={formState.medications}
                onChange={(event) => updateField("medications", event.target.value)}
                placeholder="Separate items with commas or new lines"
              />
            </label>
          </div>

          <div className="resident-modal-actions">
            <button className="resident-modal-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="resident-modal-primary" type="submit">
              Add Resident
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");
  const [greeting, setGreeting] = useState("");
  const [assignedResidents, setAssignedResidents] = useState(dashboardData.residents);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);
  const [checklistItems, setChecklistItems] = useState(() => loadChecklistItems(dashboardData.residents));
  const [dashboardSources, setDashboardSources] = useState(() => getInitialDashboardSources());
  const [sourcesFromFirestore, setSourcesFromFirestore] = useState({});

  useEffect(() => {
    setGreeting(getGreetingForTime(new Date(), dashboardData.userName));

    const intervalId = window.setInterval(() => {
      setGreeting(getGreetingForTime(new Date(), dashboardData.userName));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setChecklistItems((currentItems) => {
      return mergeChecklistItemsForResidents(assignedResidents, currentItems);
    });
  }, [assignedResidents]);

  useEffect(() => {
    function refreshLocalSources() {
      setDashboardSources((currentSources) => ({
        ...currentSources,
        dailyLogs: loadDailyLogEntries()
      }));
    }

    window.addEventListener("focus", refreshLocalSources);

    return () => window.removeEventListener("focus", refreshLocalSources);
  }, []);

  useEffect(() => {
    if (!db) {
      return undefined;
    }

    const collections = ["residents", "dailyLogs", "visits", "messages"];
    const unsubscribers = collections.map((collectionName) =>
      onSnapshot(
        collection(db, collectionName),
        (snapshot) => {
          if (snapshot.empty) {
            return;
          }

          setDashboardSources((currentSources) => ({
            ...currentSources,
            [collectionName]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          }));
          setSourcesFromFirestore((currentSources) => ({
            ...currentSources,
            [collectionName]: true
          }));
        },
        () => {
          // Keep the existing app data as the fallback if a Firestore collection is unavailable.
        }
      )
    );

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem(checklistStorageKey, JSON.stringify(checklistItems));
  }, [checklistItems]);

  function handleStubNavigate(navId) {
    setStatusMessage(`Stub navigation only for ${navId}. This item is still mock-only in the React app.`);
  }

  function handleResidentOpen(detailPath) {
    const residentSlug = getResidentSlug(detailPath);

    if (residentSlug && getResidentDetailBySlug(residentSlug)) {
      navigate(detailPath);
      return;
    }

    setStatusMessage(`TODO: wire resident detail route ${detailPath}`);
  }

  function handleToggleTask(taskId) {
    setChecklistItems((currentItems) =>
      currentItems.map((item) =>
        item.id === taskId ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function handleAddTask() {
    const nextTaskNumber = checklistItems.length + 1;
    const nextTask = {
      id: `temporary-task-${Date.now()}`,
      time: "11:30 AM",
      label: `Temporary Task ${nextTaskNumber}`,
      residentName: "Temporary task",
      room: "Room 252",
      completed: false,
      isTemporary: true
    };

    setChecklistItems((currentItems) => [...currentItems, nextTask]);
    setStatusMessage("Added a temporary local task for this session.");
  }

  function handleAddResident(resident) {
    setAssignedResidents((currentResidents) => [...currentResidents, resident]);
    setDashboardSources((currentSources) => ({
      ...currentSources,
      residents: [...currentSources.residents, resident]
    }));
    setIsAddResidentModalOpen(false);
    setStatusMessage(`Added ${resident.name} to assigned residents.`);
  }

  const dashboardCounts = getDashboardCounts(dashboardSources, sourcesFromFirestore);
  const dashboardStats = dashboardData.stats.map((item) => ({
    ...item,
    value: dashboardCounts[item.id] ?? 0
  }));
  const checklistGroups = getChecklistGroups(checklistItems, assignedResidents);

  return (
    <StaffAppShell onStubNavigate={handleStubNavigate}>
      <p className="eyebrow">{dashboardData.subtitle}</p>
      <h1 className="page-title">{greeting}</h1>
      <p className="status-message" aria-live="polite">
        {statusMessage}
      </p>

      <section className="stats-grid" aria-label="Dashboard stats">
        {dashboardStats.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </section>

      <section className="dashboard-panels">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-eyebrow">Assigned</p>
              <h2 className="panel-title">Residents</h2>
            </div>
            <div className="resident-header-actions">
              <button
                className="resident-add-button"
                type="button"
                onClick={() => setIsAddResidentModalOpen(true)}
                aria-label="Add resident"
              >
                +
              </button>
              <div className="resident-count-badge">
                <span id="resident-count-value">{assignedResidents.length}</span>
              </div>
            </div>
          </div>

          <ul className="resident-list">
            {assignedResidents.map((resident) => (
              <li key={resident.id} className="resident-row-item">
                <button
                  className="resident-row"
                  type="button"
                  onClick={() => handleResidentOpen(resident.detailPath)}
                  aria-label={`Open resident profile for ${resident.name}`}
                >
                  <div className="resident-avatar">
                    {resident.image ? <img src={resident.image} alt={resident.name} /> : <span>{getInitials(resident.name)}</span>}
                  </div>
                  <div>
                    <p className="resident-name">{resident.name}</p>
                    <p className="resident-room">{resident.room}</p>
                  </div>
                  <div className="resident-update">
                    <strong>Last Update</strong>
                    {resident.lastUpdate}
                  </div>
                  <ChartIcon />
                  <ChevronRightIcon />
                </button>
              </li>
            ))}
          </ul>

          <button className="view-all-button" type="button" onClick={() => navigate("/residents")}>
            View All
          </button>
        </article>

        <article className="panel panel--accent">
          <div className="panel-header panel-header--accent">
            <div>
              <p className="panel-eyebrow panel-eyebrow--light">To Do</p>
              <h2 className="panel-title panel-title--light">Daily Checklist</h2>
            </div>
            <button className="add-task-button" type="button" onClick={handleAddTask}>
              + Add Task
            </button>
          </div>

          <div className="tasks-meta">
            <p>{dashboardData.checklistDate}</p>
          </div>

          <div className="task-list">
            {checklistGroups.map((group) => (
              <section key={group.id} className="task-group" aria-label={`${group.name} checklist`}>
                <div className="task-group-header">
                  <p className="task-group-name">{group.name}</p>
                  {group.room ? <span className="room-pill">{group.room}</span> : null}
                </div>
                <ul className="task-group-list">
                  {group.items.map((item) => (
                    <li key={item.id} className={`task-item${item.completed ? " is-complete" : ""}`}>
                      <button
                        className="task-toggle"
                        type="button"
                        onClick={() => handleToggleTask(item.id)}
                        aria-pressed={item.completed}
                        aria-label={`${item.completed ? "Mark as incomplete" : "Mark as complete"}: ${item.label} for ${group.name}`}
                      >
                        <span className={`task-circle${item.completed ? " is-checked" : ""}`}>
                          {item.completed ? "✓" : ""}
                        </span>
                      </button>
                      <div>
                        <p className="task-time">{item.time}</p>
                        <p className="task-desc">{item.label}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </section>

      {isAddResidentModalOpen ? (
        <AddResidentModal
          onClose={() => setIsAddResidentModalOpen(false)}
          onSubmit={handleAddResident}
        />
      ) : null}
    </StaffAppShell>
  );
}
