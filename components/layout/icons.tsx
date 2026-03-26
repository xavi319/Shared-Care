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

import type { NavIconKey, StatIconKey } from "@/lib/types";

interface IconProps {
  className?: string;
}

function withDefaultClassName(className?: string) {
  return className ? `sharedcare-icon ${className}` : "sharedcare-icon";
}

export function InboxIcon({ className }: IconProps) {
  return <EnvelopeIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function SearchIcon({ className }: IconProps) {
  return <MagnifyingGlassIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronRightIcon({ className }: IconProps) {
  return <HeroChevronRightIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChevronLeftIcon({ className }: IconProps) {
  return <HeroChevronLeftIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function ChartIcon({ className }: IconProps) {
  return <HeroChartBarIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function SortIcon({ className }: IconProps) {
  return <HeroArrowsUpDownIcon className={withDefaultClassName(className)} aria-hidden="true" />;
}

export function NavIcon({ icon, className }: { icon: NavIconKey; className?: string }) {
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
  }
}

export function StatIcon({ icon, className }: { icon: StatIconKey; className?: string }) {
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
  }
}
