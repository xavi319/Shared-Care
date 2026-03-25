// @ts-check

import { dashboardData } from "./dashboard-data.js";

/** @typedef {import("./dashboard-types").ChecklistItem} ChecklistItem */
/** @typedef {import("./dashboard-types").NavItem} NavItem */
/** @typedef {import("./dashboard-types").Resident} Resident */
/** @typedef {import("./dashboard-types").StatItem} StatItem */

const CHECKLIST_STORAGE_KEY = "sharedcare-dashboard-checklist";

const state = {
  activeNavId: getInitialNavId(),
  checklistItems: loadChecklistItems()
};

const elements = {
  time: document.getElementById("current-time"),
  greeting: document.getElementById("dashboard-greeting"),
  nav: document.getElementById("sidebar-nav"),
  stats: document.getElementById("stats-grid"),
  residentCount: document.getElementById("resident-count-value"),
  residentList: document.getElementById("resident-list"),
  checklistDate: document.getElementById("tasks-date"),
  taskList: document.getElementById("task-list"),
  addTaskButton: document.getElementById("add-task-button"),
  viewAllButton: document.getElementById("view-all-button"),
  status: document.getElementById("app-status")
};

init();

function init() {
  renderTimeUi();
  setInterval(renderTimeUi, 60000);

  if (elements.checklistDate) {
    elements.checklistDate.textContent = dashboardData.checklistDate;
  }

  renderNavigation();
  renderStats();
  renderResidents();
  renderChecklist();

  elements.nav?.addEventListener("click", handleNavClick);
  elements.residentList?.addEventListener("click", handleResidentClick);
  elements.residentList?.addEventListener("keydown", handleResidentKeydown);
  elements.taskList?.addEventListener("click", handleTaskListClick);
  elements.addTaskButton?.addEventListener("click", handleAddTask);
  elements.viewAllButton?.addEventListener("click", handleViewAllClick);
}

function renderTimeUi() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  if (elements.time) {
    elements.time.textContent = formatter.format(now);
  }

  if (elements.greeting) {
    elements.greeting.textContent = getGreetingForTime(now, dashboardData.userName || "Sarah");
  }
}

/**
 * @param {Date} date
 * @param {string} userName
 */
function getGreetingForTime(date, userName) {
  const hour = date.getHours();
  let greetingPrefix = "Good evening";

  if (hour >= 5 && hour < 12) {
    greetingPrefix = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    greetingPrefix = "Good afternoon";
  }

  return greetingPrefix + ", " + userName;
}

function renderNavigation() {
  if (!elements.nav) {
    return;
  }

  elements.nav.innerHTML = dashboardData.navItems.map(function renderNavItem(item) {
    const isActive = item.id === state.activeNavId;
    return [
      '<a class="nav-link' + (isActive ? " is-active" : "") + '"',
      ' href="' + item.href + '"',
      ' data-nav-id="' + item.id + '"',
      isActive ? ' aria-current="page"' : "",
      ">",
      getNavIconMarkup(item.icon),
      "<span>" + escapeHtml(item.label) + "</span>",
      "</a>"
    ].join("");
  }).join("");
}

function renderStats() {
  if (!elements.stats) {
    return;
  }

  elements.stats.innerHTML = dashboardData.stats.map(function renderStatCard(item) {
    return [
      '<article class="stat-card stat-card--' + escapeHtml(item.icon) + '">',
      getStatIconMarkup(item.icon),
      '<p class="stat-value"><strong>' + escapeHtml(String(item.value)) + "</strong></p>",
      '<p class="stat-label">' + escapeHtml(item.label) + "</p>",
      "</article>"
    ].join("");
  }).join("");
}

function renderResidents() {
  if (!elements.residentList || !elements.residentCount) {
    return;
  }

  elements.residentCount.textContent = String(dashboardData.residents.length);
  elements.residentList.innerHTML = dashboardData.residents.map(function renderResidentRow(resident) {
    return [
      '<li class="resident-row-item">',
      '<button class="resident-row" type="button" data-resident-id="' + resident.id + '" data-detail-path="' + resident.detailPath + '" aria-label="Open resident profile for ' + escapeHtml(resident.name) + '">',
      '<div class="resident-avatar">',
      '<img src="' + resident.image + '" alt="' + escapeHtml(resident.name) + '" />',
      "</div>",
      "<div>",
      '<p class="resident-name">' + escapeHtml(resident.name) + "</p>",
      '<p class="resident-room">' + escapeHtml(resident.room) + "</p>",
      "</div>",
      '<div class="resident-update"><strong>Last Update</strong>' + escapeHtml(resident.lastUpdate) + "</div>",
      getResidentChartIconMarkup(),
      getChevronMarkup(),
      "</button>",
      "</li>"
    ].join("");
  }).join("");
}

function renderChecklist() {
  if (!elements.taskList) {
    return;
  }

  elements.taskList.innerHTML = state.checklistItems.map(function renderChecklistItem(item) {
    return [
      '<li class="task-item' + (item.completed ? " is-complete" : "") + '">',
      '<button class="task-toggle" type="button" data-task-id="' + item.id + '" aria-pressed="' + String(item.completed) + '" aria-label="' + (item.completed ? "Mark as incomplete: " : "Mark as complete: ") + escapeHtml(item.label) + '">',
      '<span class="task-circle' + (item.completed ? " is-checked" : "") + '">' + (item.completed ? "✓" : "") + "</span>",
      "</button>",
      "<div>",
      '<p class="task-time">' + escapeHtml(item.time) + "</p>",
      '<p class="task-desc">' + escapeHtml(item.label) + "</p>",
      "</div>",
      '<span class="room-pill">' + escapeHtml(item.room) + "</span>",
      "</li>"
    ].join("");
  }).join("");
}

/**
 * @param {MouseEvent} event
 */
function handleNavClick(event) {
  const navLink = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest("[data-nav-id]") : null);
  if (!navLink) {
    return;
  }

  const navId = navLink.getAttribute("data-nav-id");
  const href = navLink.getAttribute("href");
  if (!navId) {
    return;
  }

  state.activeNavId = navId;
  renderNavigation();

  if (href && href.endsWith(".html")) {
    return;
  }

  event.preventDefault();
  showStatus("Stub navigation only for " + navId + ". The dashboard layout remains in place until routing is added.");
}

/**
 * @param {MouseEvent} event
 */
function handleResidentClick(event) {
  const residentButton = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest("[data-resident-id]") : null);
  if (!residentButton) {
    return;
  }

  const detailPath = residentButton.getAttribute("data-detail-path");
  if (!detailPath) {
    return;
  }

  showStatus("TODO: wire resident detail route " + detailPath);
}

/**
 * @param {KeyboardEvent} event
 */
function handleResidentKeydown(event) {
  const residentButton = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest("[data-resident-id]") : null);
  if (!residentButton) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    residentButton.click();
  }
}

/**
 * @param {MouseEvent} event
 */
function handleTaskListClick(event) {
  const toggle = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest("[data-task-id]") : null);
  if (!toggle) {
    return;
  }

  const taskId = toggle.getAttribute("data-task-id");
  if (!taskId) {
    return;
  }

  state.checklistItems = state.checklistItems.map(function updateTask(item) {
    if (item.id !== taskId) {
      return item;
    }

    return {
      ...item,
      completed: !item.completed
    };
  });

  persistChecklistItems();
  renderChecklist();
}

function handleAddTask() {
  const taskLabel = window.prompt("Add a temporary checklist task", "Call Beth's daughter");
  if (!taskLabel) {
    showStatus("Add Task cancelled.");
    return;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  const temporaryTask = {
    id: "temp-" + Date.now(),
    time: formatter.format(new Date()),
    label: taskLabel.trim(),
    room: "Room 123",
    completed: false,
    isTemporary: true
  };

  state.checklistItems = [temporaryTask].concat(state.checklistItems);
  persistChecklistItems();
  renderChecklist();
  showStatus("Temporary local task added.");
}

function handleViewAllClick() {
  window.location.href = "./residents.html";
}

function persistChecklistItems() {
  window.sessionStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state.checklistItems));
}

/**
 * @returns {ChecklistItem[]}
 */
function loadChecklistItems() {
  const stored = window.sessionStorage.getItem(CHECKLIST_STORAGE_KEY);
  if (!stored) {
    return dashboardData.checklistItems.map(copyChecklistItem);
  }

  try {
    const parsed = /** @type {ChecklistItem[]} */ (JSON.parse(stored));
    return parsed.map(copyChecklistItem);
  } catch (error) {
    console.warn("Failed to parse checklist session state.", error);
    return dashboardData.checklistItems.map(copyChecklistItem);
  }
}

/**
 * @param {ChecklistItem} item
 * @returns {ChecklistItem}
 */
function copyChecklistItem(item) {
  return {
    id: item.id,
    time: item.time,
    label: item.label,
    room: item.room,
    completed: item.completed,
    isTemporary: item.isTemporary
  };
}

function getInitialNavId() {
  return "dashboard";
}

/**
 * @param {string} message
 */
function showStatus(message) {
  if (elements.status) {
    elements.status.hidden = false;
    elements.status.textContent = message;
  }
}

/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * @param {string} icon
 */
function getNavIconMarkup(icon) {
  switch (icon) {
    case "home":
      return [
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
        '<path d="M4 10.5L12 4L20 10.5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V10.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    case "calendar":
      return [
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
        '<path d="M7 4.5V7.5M17 4.5V7.5M4 9.5H20M6 20H18C19.1046 20 20 19.1046 20 18V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    case "residents":
      return [
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
        '<circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8"></circle>',
        '<path d="M5.5 20C5.5 16.9624 8.18629 14.5 11.5 14.5H12.5C15.8137 14.5 18.5 16.9624 18.5 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>',
        "</svg>"
      ].join("");
    case "messages":
      return [
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">',
        '<path d="M7 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H10L6 20V8C6 7.44772 6.44772 7 7 7Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    default:
      return "";
  }
}

/**
 * @param {StatItem["icon"]} icon
 */
function getStatIconMarkup(icon) {
  switch (icon) {
    case "logs":
      return [
        '<svg class="card-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">',
        '<path d="M18 4.5V18H31.5" stroke="var(--logs)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>',
        '<path d="M30 19.5C29.1256 25.1834 24.211 29 18.1875 29C11.5431 29 6.15625 23.6132 6.15625 16.9688C6.15625 10.9453 9.97282 6.03068 15.6562 5.15625" stroke="var(--logs)" stroke-width="2.2" stroke-linecap="round"></path>',
        "</svg>"
      ].join("");
    case "residents":
      return [
        '<svg class="card-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">',
        '<circle cx="18" cy="11" r="5.2" stroke="var(--residents)" stroke-width="2.1"></circle>',
        '<path d="M10.5 27V24.8C10.5 22.0386 12.7386 19.8 15.5 19.8H20.5C23.2614 19.8 25.5 22.0386 25.5 24.8V27" stroke="var(--residents)" stroke-width="2.1" stroke-linecap="round"></path>',
        "</svg>"
      ].join("");
    case "visits":
      return [
        '<svg class="card-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">',
        '<path d="M11 7V10M25 7V10M8 13H28M10 29H26C27.1046 29 28 28.1046 28 27V10C28 8.89543 27.1046 8 26 8H10C8.89543 8 8 8.89543 8 10V27C8 28.1046 8.89543 29 10 29Z" stroke="var(--visits)" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    case "messages":
      return [
        '<svg class="card-icon" viewBox="0 0 36 36" fill="none" aria-hidden="true">',
        '<path d="M10 9.5H26C27.1046 9.5 28 10.3954 28 11.5V22C28 23.1046 27.1046 24 26 24H13L9 27.5V11.5C9 10.3954 9.89543 9.5 11 9.5" stroke="var(--messages)" stroke-width="2.1" stroke-linejoin="round"></path>',
        "</svg>"
      ].join("");
    default:
      return "";
  }
}

function getResidentChartIconMarkup() {
  return [
    '<svg class="chart-icon" viewBox="0 0 42 42" fill="none" aria-hidden="true">',
    '<path d="M21 6V21H36" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>',
    '<path d="M35 23C33.9824 29.6157 28.262 34 21.25 34C13.518 34 7.25 27.732 7.25 20C7.25 12.988 11.6343 7.26764 18.25 6.25" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>',
    '<path d="M26.5 13.5H31.5V18.5" stroke="#8a4d08" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>',
    "</svg>"
  ].join("");
}

function getChevronMarkup() {
  return [
    '<svg class="chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">',
    '<path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>',
    "</svg>"
  ].join("");
}
