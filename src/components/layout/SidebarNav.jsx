import { NavLink } from "react-router-dom";

import { NavIcon } from "./icons";

function getNavLinkClassName(isActive) {
  return `nav-link${isActive ? " is-active" : ""}`;
}

export function SidebarNav({ items, onStubNavigate }) {
  return (
    <nav className="nav" aria-label="Primary">
      {items.map((item) => {
        const content = (
          <>
            <span className="nav-link-icon" aria-hidden="true">
              <NavIcon icon={item.icon} />
            </span>
            <span className="nav-link-label">{item.label}</span>
            {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
              <span
                className="nav-link-badge"
                aria-label={`${item.badgeCount} ${item.badgeLabel ?? "notifications"}`}
              >
                {item.badgeCount}
              </span>
            ) : null}
          </>
        );

        if (item.href) {
          return (
            <NavLink
              key={item.id}
              className={({ isActive }) => getNavLinkClassName(isActive)}
              end={item.href === "/"}
              to={item.href}
            >
              {content}
            </NavLink>
          );
        }

        return (
          <button
            key={item.id}
            className="nav-link nav-link-button"
            type="button"
            onClick={() => onStubNavigate?.(item.id)}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
