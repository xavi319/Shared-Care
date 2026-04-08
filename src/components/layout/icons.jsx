import {
  ArrowsUpDownIcon as HeroArrowsUpDownIcon,
  CalendarDaysIcon,
  ChartBarIcon as HeroChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon as HeroChevronLeftIcon,
  ChevronRightIcon as HeroChevronRightIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  HeartIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

function withDefaultClassName(className) {
  return className ? `sharedcare-icon ${className}` : "sharedcare-icon";
}

export function InboxIcon({ className }) {
  return <EnvelopeIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function SearchIcon({ className }) {
  return <MagnifyingGlassIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronRightIcon({ className }) {
  return <HeroChevronRightIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronLeftIcon({ className }) {
  return <HeroChevronLeftIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChartIcon({ className }) {
  return <HeroChartBarIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function SortIcon({ className }) {
  return <HeroArrowsUpDownIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function NavIcon({ icon, className }) {
  const iconClassName = withDefaultClassName(className);

  switch (icon) {
    case "home":
      return <HomeIcon className={iconClassName} aria-hidden="true" />;
    case "calendar":
      return <CalendarDaysIcon className={iconClassName} aria-hidden="true" />;
    case "residents":
      return <UsersIcon className={iconClassName} aria-hidden="true" />;
    case "messages":
      return <ChatBubbleLeftRightIcon className={iconClassName} aria-hidden="true" />;
    default:
      return null;
  }
}

export function StatIcon({ icon, className }) {
  const iconClassName = withDefaultClassName(className);

  switch (icon) {
    case "logs":
      return <ClipboardDocumentListIcon className={iconClassName} aria-hidden="true" />;
    case "residents":
      return <UsersIcon className={iconClassName} aria-hidden="true" />;
    case "visits":
      return <HeartIcon className={iconClassName} aria-hidden="true" />;
    case "messages":
      return <ChatBubbleLeftRightIcon className={iconClassName} aria-hidden="true" />;
    default:
      return null;
  }
}
