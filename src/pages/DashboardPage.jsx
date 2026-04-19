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
  initialChecklistItems,
  loadDailyLogEntries,
  messagesData,
  residentsPageData,
  schedulingPageData
} from "../data/mockData";
import { db } from "../lib/firebase";

const fallbackResidents = getUniqueById([...residentsPageData.residents, ...dashboardData.residents]);

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

export default function DashboardPage() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");
  const [greeting, setGreeting] = useState("");
  const [checklistItems, setChecklistItems] = useState(initialChecklistItems);
  const [dashboardSources, setDashboardSources] = useState(() => getInitialDashboardSources());
  const [sourcesFromFirestore, setSourcesFromFirestore] = useState({});

  useEffect(() => {
    setChecklistItems(loadChecklistItems());
    setGreeting(getGreetingForTime(new Date(), dashboardData.userName));

    const intervalId = window.setInterval(() => {
      setGreeting(getGreetingForTime(new Date(), dashboardData.userName));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

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
      room: "Room 252",
      completed: false,
      isTemporary: true
    };

    setChecklistItems((currentItems) => [...currentItems, nextTask]);
    setStatusMessage("Added a temporary local task for this session.");
  }

  const dashboardCounts = getDashboardCounts(dashboardSources, sourcesFromFirestore);
  const dashboardStats = dashboardData.stats.map((item) => ({
    ...item,
    value: dashboardCounts[item.id] ?? 0
  }));

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
