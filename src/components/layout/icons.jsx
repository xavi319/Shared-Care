import {
  ArrowsUpDownIcon as HeroArrowsUpDownIcon,
  CalendarDaysIcon,
  ChartBarIcon as HeroChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon as HeroChevronLeftIcon,
  ChevronDownIcon as HeroChevronDownIcon,
  ChevronRightIcon as HeroChevronRightIcon,
  CheckCircleIcon,
  ClockIcon as HeroClockIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  InboxStackIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserGroupIcon,
  VideoCameraIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

function withDefaultClassName(className) {
  return className ? `sharedcare-icon ${className}` : "sharedcare-icon";
}

export function InboxIcon({ className }) {
  return <InboxStackIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function SearchIcon({ className }) {
  return <MagnifyingGlassIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronRightIcon({ className }) {
  return <HeroChevronRightIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronDownIcon({ className }) {
  return <HeroChevronDownIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronLeftIcon({ className }) {
  return <HeroChevronLeftIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function CalendarIcon({ className }) {
  return <CalendarDaysIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function CheckIcon({ className }) {
  return <CheckCircleIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ClockIcon({ className }) {
  return <HeroClockIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function DocumentIcon({ className }) {
  return <DocumentTextIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function GiftVisitIcon({ className }) {
  return <GiftIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function InfoIcon({ className }) {
  return <InformationCircleIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ShieldIcon({ className }) {
  return <ShieldCheckIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function UserIcon({ className }) {
  return <UserCircleIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function UserGroupVisitIcon({ className }) {
  return <UserGroupIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function VideoVisitIcon({ className }) {
  return <VideoCameraIcon className={withDefaultClassName(className)} aria-hidden="true" />;
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
    case "logs":
      return <ClipboardDocumentListIcon className={iconClassName} aria-hidden="true" />;
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
