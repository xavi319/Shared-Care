"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavIcon } from "@/components/layout/icons";
import type { NavItem } from "@/lib/types";

interface SidebarNavProps {
  items: NavItem[];
  onStubNavigate?: (navId: string) => void;
}

function isActivePath(pathname: string, href?: string) {
  if (!href) {
    return false;
  }

  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav({ items, onStubNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="nav" aria-label="Primary">
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        const content = (
          <>
            <span className="nav-link-icon" aria-hidden="true">
              <NavIcon icon={item.icon} />
            </span>
            <span className="nav-link-label">{item.label}</span>
            {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
              <span className="nav-link-badge" aria-label={`${item.badgeCount} unread`}>
                {item.badgeCount}
              </span>
            ) : null}
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.id}
              className={`nav-link${active ? " is-active" : ""}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            className={`nav-link nav-link-button${active ? " is-active" : ""}`}
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
