import type { NavIconKey, StatIconKey } from "@/lib/types";

interface IconProps {
  className?: string;
}

export function InboxIcon({ className }: IconProps) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5C4 5.67157 4.67157 5 5.5 5H18.5C19.3284 5 20 5.67157 20 6.5V17.5C20 18.3284 19.3284 19 18.5 19H5.5C4.67157 19 4 18.3284 4 17.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M6 8L12 13L18 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18.5H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 15V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 15V7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 15V12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function SortIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M6 4V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6L6 4L8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 16V4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 14L14 16L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavIcon({ icon, className }: { icon: NavIconKey; className?: string }) {
  switch (icon) {
    case "home":
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 10.5L12 4L20 10.5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V10.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 4.5V7.5M17 4.5V7.5M4 9.5H20M6 20H18C19.1046 20 20 19.1046 20 18V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "residents":
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5.5 20C5.5 16.9624 8.18629 14.5 11.5 14.5H12.5C15.8137 14.5 18.5 16.9624 18.5 20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "messages":
      return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H10L6 20V8C6 7.44772 6.44772 7 7 7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function StatIcon({ icon, className }: { icon: StatIconKey; className?: string }) {
  switch (icon) {
    case "logs":
      return (
        <svg className={className} width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 6H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 12H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M8 18H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 6H5.01M5 12H5.01M5 18H5.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "residents":
      return <NavIcon icon="residents" className={className} />;
    case "visits":
      return (
        <svg className={className} width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 19L5.5 12.4C3.83333 10.6 3.83333 7.8 5.5 6C7.16667 4.2 9.83333 4.2 11.5 6L12 6.6L12.5 6C14.1667 4.2 16.8333 4.2 18.5 6C20.1667 7.8 20.1667 10.6 18.5 12.4L12 19Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "messages":
      return <NavIcon icon="messages" className={className} />;
  }
}
