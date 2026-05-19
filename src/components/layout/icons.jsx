import {
  ArrowUpDown,
  CalendarDays,
  CalendarHeart,
  ChartBar,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  ClipboardList,
  FileText,
  Gift,
  HandHeart,
  Heart,
  Home,
  Inbox,
  Info,
  MessageCircle,
  Paperclip,
  PencilLine,
  Search,
  Send,
  ShieldCheck,
  Smile,
  StickyNote,
  UserCircle,
  UserRound,
  Users,
  UsersRound,
  Utensils,
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

export function CheckMarkIcon({ className }) {
  return <LucideIcon icon={Check} className={className} />;
}

export function CheckDoubleIcon({ className }) {
  return <LucideIcon icon={CheckCheck} className={className} />;
}

export function AlertIcon({ className }) {
  return <LucideIcon icon={CircleAlert} className={className} />;
}

export function ClockIcon({ className }) {
  return <LucideIcon icon={Clock} className={className} />;
}

export function DocumentIcon({ className }) {
  return <LucideIcon icon={FileText} className={className} />;
}

export function NoteIcon({ className }) {
  return <LucideIcon icon={StickyNote} className={className} />;
}

export function SmileIcon({ className }) {
  return <LucideIcon icon={Smile} className={className} />;
}

export function UtensilsIcon({ className }) {
  return <LucideIcon icon={Utensils} className={className} />;
}

export function GiftVisitIcon({ className }) {
  return <LucideIcon icon={Gift} className={className} />;
}

export function HandHeartIcon({ className }) {
  return <LucideIcon icon={HandHeart} className={className} />;
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

export function UserRoundIcon({ className }) {
  return <LucideIcon icon={UserRound} className={className} />;
}

export function UsersIcon({ className }) {
  return <LucideIcon icon={Users} className={className} />;
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

export function ComposeIcon({ className }) {
  return <LucideIcon icon={PencilLine} className={className} />;
}

export function AttachIcon({ className }) {
  return <LucideIcon icon={Paperclip} className={className} />;
}

export function SendIcon({ className }) {
  return <LucideIcon icon={Send} className={className} />;
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
