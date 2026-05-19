import {
  ArrowUpDown,
  CalendarDays,
  CalendarHeart,
  ChartBar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  ClipboardList,
  FileText,
  Gift,
  Heart,
  Home,
  Inbox,
  Info,
  MessageCircle,
  Search,
  ShieldCheck,
  UserCircle,
  UsersRound,
  Video
} from "lucide-react";

function withDefaultClassName(className) {
  return className ? `sharedcare-icon ${className}` : "sharedcare-icon";
}

function LucideIcon({ icon: Icon, className }) {
  return <Icon className={withDefaultClassName(className)} strokeWidth={2.25} aria-hidden="true" />;
}

export function InboxIcon({ className }) {
  return <LucideIcon icon={Inbox} className={className} />;
}

export function SearchIcon({ className }) {
  return <LucideIcon icon={Search} className={className} />;
}

export function ChevronRightIcon({ className }) {
  return <LucideIcon icon={ChevronRight} className={className} />;
}

export function ChevronDownIcon({ className }) {
  return <LucideIcon icon={ChevronDown} className={className} />;
}

export function ChevronLeftIcon({ className }) {
  return <LucideIcon icon={ChevronLeft} className={className} />;
}

export function CalendarIcon({ className }) {
  return <LucideIcon icon={CalendarDays} className={className} />;
}

export function CheckIcon({ className }) {
  return <LucideIcon icon={CircleCheck} className={className} />;
}

export function ClockIcon({ className }) {
  return <LucideIcon icon={Clock} className={className} />;
}

export function DocumentIcon({ className }) {
  return <LucideIcon icon={FileText} className={className} />;
}

export function GiftVisitIcon({ className }) {
  return <LucideIcon icon={Gift} className={className} />;
}

export function InfoIcon({ className }) {
  return <LucideIcon icon={Info} className={className} />;
}

export function ShieldIcon({ className }) {
  return <LucideIcon icon={ShieldCheck} className={className} />;
}

export function UserIcon({ className }) {
  return <LucideIcon icon={UserCircle} className={className} />;
}

export function UserGroupVisitIcon({ className }) {
  return <LucideIcon icon={UsersRound} className={className} />;
}

export function VideoVisitIcon({ className }) {
  return <LucideIcon icon={Video} className={className} />;
}

export function ChartIcon({ className }) {
  return <LucideIcon icon={ChartBar} className={className} />;
}

export function SortIcon({ className }) {
  return <LucideIcon icon={ArrowUpDown} className={className} />;
}

export function NavIcon({ icon, className }) {
  const iconClassName = withDefaultClassName(className);

  switch (icon) {
    case "home":
      return <Home className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "calendar":
      return <CalendarDays className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "logs":
      return <ClipboardList className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "residents":
      return <UsersRound className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "messages":
      return <MessageCircle className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    default:
      return null;
  }
}

export function StatIcon({ icon, className }) {
  const iconClassName = withDefaultClassName(className);

  switch (icon) {
    case "logs":
      return <ClipboardList className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "residents":
      return <UsersRound className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "visits":
      return <CalendarHeart className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    case "messages":
      return <MessageCircle className={iconClassName} strokeWidth={2.25} aria-hidden="true" />;
    default:
      return null;
  }
}
