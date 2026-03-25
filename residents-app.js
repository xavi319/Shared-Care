// @ts-check

import { dashboardData, residentsPageData } from "./dashboard-data.js";

const state = {
  activeNavId: "residents",
  sortAscending: true,
  query: ""
};

const elements = {
  time: document.getElementById("current-time"),
  nav: document.getElementById("sidebar-nav"),
  title: document.getElementById("residents-title"),
  subtitle: document.getElementById("residents-subtitle"),
  searchInput: document.getElementById("resident-search-input"),
  sortButton: document.getElementById("sort-button"),
  list: document.getElementById("residents-list"),
  status: document.getElementById("residents-status")
};

init();

function init() {
  renderClock();
  setInterval(renderClock, 60000);
  renderNavigation();
  renderStaticText();
  renderResidentsList();

  elements.nav?.addEventListener("click", handleNavClick);
  elements.searchInput?.addEventListener("input", handleSearchInput);
  elements.sortButton?.addEventListener("click", handleSortToggle);
  elements.list?.addEventListener("click", handleResidentAction);
}

function renderClock() {
  if (!elements.time) {
    return;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });

  elements.time.textContent = formatter.format(new Date());
}

function renderStaticText() {
  if (elements.title) {
    elements.title.textContent = residentsPageData.title;
  }

  if (elements.subtitle) {
    elements.subtitle.textContent = residentsPageData.subtitle;
  }

  if (elements.searchInput) {
    elements.searchInput.placeholder = residentsPageData.searchPlaceholder;
  }
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

function renderResidentsList() {
  if (!elements.list) {
    return;
  }

  const residents = getFilteredResidents();

  elements.list.innerHTML = residents.map(function renderResident(resident) {
    const initials = getInitials(resident.name);
    const avatar = resident.image
      ? '<img src="' + resident.image + '" alt="' + escapeHtml(resident.name) + '" />'
      : '<span>' + escapeHtml(initials) + "</span>";

    return [
      '<li class="resident-directory-row">',
      '<button class="resident-directory-button" type="button" data-detail-path="' + resident.detailPath + '" aria-label="View details for ' + escapeHtml(resident.name) + '">',
      '<div class="directory-identity">',
      '<div class="directory-avatar" style="--avatar-accent: ' + escapeHtml(resident.accent || "#aaccee") + ';">',
      avatar,
      "</div>",
      '<div class="directory-name-block">',
      '<p class="directory-name">' + escapeHtml(resident.name) + "</p>",
      '<p class="directory-room">' + escapeHtml(resident.room) + "</p>",
      "</div>",
      "</div>",
      '<div class="directory-update">',
      '<p class="directory-update-label">' + escapeHtml(resident.lastUpdateLabel || "Daily Log last updated") + "</p>",
      '<p class="directory-update-time">' + escapeHtml(resident.lastUpdate) + "</p>",
      "</div>",
      '<span class="directory-link">View Details &gt;</span>',
      "</button>",
      "</li>"
    ].join("");
  }).join("");

  if (!residents.length) {
    elements.list.innerHTML = '<li class="directory-empty">No residents match your search yet.</li>';
  }
}

function getFilteredResidents() {
  const normalizedQuery = state.query.trim().toLowerCase();
  const filtered = residentsPageData.residents.filter(function filterResident(resident) {
    if (!normalizedQuery) {
      return true;
    }

    return resident.name.toLowerCase().includes(normalizedQuery) || resident.room.toLowerCase().includes(normalizedQuery);
  });

  return filtered.sort(function sortResidents(a, b) {
    const comparison = a.name.localeCompare(b.name);
    return state.sortAscending ? comparison : -comparison;
  });
}

/**
 * @param {MouseEvent} event
 */
function handleNavClick(event) {
  const navLink = event.target instanceof Element ? event.target.closest("[data-nav-id]") : null;
  if (!navLink) {
    return;
  }

  const href = navLink.getAttribute("href");
  if (href && href.endsWith(".html")) {
    return;
  }

  event.preventDefault();
  const navId = navLink.getAttribute("data-nav-id") || "dashboard";
  showStatus("Stub navigation only for " + navId + ". This mock page stays in place until more routes are added.");
}

/**
 * @param {Event} event
 */
function handleSearchInput(event) {
  const input = /** @type {HTMLInputElement | null} */ (event.target instanceof HTMLInputElement ? event.target : null);
  if (!input) {
    return;
  }

  state.query = input.value;
  renderResidentsList();
}

function handleSortToggle() {
  state.sortAscending = !state.sortAscending;

  if (elements.sortButton) {
    elements.sortButton.setAttribute("aria-pressed", String(!state.sortAscending));
    elements.sortButton.querySelector(".sort-label").textContent = state.sortAscending ? "Sort A-Z" : "Sort Z-A";
  }

  renderResidentsList();
}

/**
 * @param {MouseEvent} event
 */
function handleResidentAction(event) {
  const residentButton = event.target instanceof Element ? event.target.closest("[data-detail-path]") : null;
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
 * @param {string} message
 */
function showStatus(message) {
  if (!elements.status) {
    return;
  }

  elements.status.hidden = false;
  elements.status.textContent = message;
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
 * @param {string} name
 */
function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(function mapPart(part) {
      return part.charAt(0).toUpperCase();
    })
    .join("");
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
