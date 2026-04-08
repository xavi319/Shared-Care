import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { StatCard } from "../components/dashboard/StatCard";
import { ChartIcon, ChevronRightIcon } from "../components/layout/icons";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  checklistStorageKey,
  dashboardData,
  getResidentDetailBySlug,
  getResidentSlug,
  initialChecklistItems
} from "../data/mockData";

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

function loadChecklistItems() {
  const storedValue = window.sessionStorage.getItem(checklistStorageKey);

  if (!storedValue) {
    return initialChecklistItems;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return initialChecklistItems;
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");
  const [greeting, setGreeting] = useState("");
  const [checklistItems, setChecklistItems] = useState(initialChecklistItems);

  useEffect(() => {
    setChecklistItems(loadChecklistItems());
    setGreeting(getGreetingForTime(new Date(), dashboardData.userName));

    const intervalId = window.setInterval(() => {
      setGreeting(getGreetingForTime(new Date(), dashboardData.userName));
    }, 60000);

    return () => window.clearInterval(intervalId);
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
      room: "Room 252",
      completed: false,
      isTemporary: true
    };

    setChecklistItems((currentItems) => [...currentItems, nextTask]);
    setStatusMessage("Added a temporary local task for this session.");
  }

  return (
    <StaffAppShell onStubNavigate={handleStubNavigate}>
      <p className="eyebrow">{dashboardData.subtitle}</p>
      <h1 className="page-title">{greeting}</h1>
      <p className="status-message" aria-live="polite">
        {statusMessage}
      </p>

      <section className="stats-grid" aria-label="Dashboard stats">
        {dashboardData.stats.map((item) => (
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
            <div className="resident-count-badge">
              <span id="resident-count-value">{dashboardData.residents.length}</span>
            </div>
          </div>

          <ul className="resident-list">
            {dashboardData.residents.map((resident) => (
              <li key={resident.id} className="resident-row-item">
                <button
                  className="resident-row"
                  type="button"
                  onClick={() => handleResidentOpen(resident.detailPath)}
                  aria-label={`Open resident profile for ${resident.name}`}
                >
                  <div className="resident-avatar">
                    <img src={resident.image} alt={resident.name} />
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

          <ul className="task-list">
            {checklistItems.map((item) => (
              <li key={item.id} className={`task-item${item.completed ? " is-complete" : ""}`}>
                <button
                  className="task-toggle"
                  type="button"
                  onClick={() => handleToggleTask(item.id)}
                  aria-pressed={item.completed}
                  aria-label={`${item.completed ? "Mark as incomplete" : "Mark as complete"}: ${item.label}`}
                >
                  <span className={`task-circle${item.completed ? " is-checked" : ""}`}>
                    {item.completed ? "✓" : ""}
                  </span>
                </button>
                <div>
                  <p className="task-time">{item.time}</p>
                  <p className="task-desc">{item.label}</p>
                </div>
                <span className="room-pill">{item.room}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </StaffAppShell>
  );
}
