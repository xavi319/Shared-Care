export type NavItemId = "dashboard" | "scheduling" | "residents" | "messages";

export type NavIconKey = "home" | "calendar" | "residents" | "messages";

export type StatIconKey = "logs" | "residents" | "visits" | "messages";

export interface NavItem {
  id: NavItemId;
  label: string;
  href?: string;
  icon: NavIconKey;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  icon: StatIconKey;
}

export interface Resident {
  id: string;
  slug?: string;
  name: string;
  room: string;
  lastUpdate: string;
  image?: string;
  detailPath: string;
  lastUpdateLabel?: string;
  accent?: string;
}

export interface ChecklistItem {
  id: string;
  time: string;
  label: string;
  room: string;
  completed: boolean;
  isTemporary?: boolean;
}

export interface DashboardData {
  userName: string;
  subtitle: string;
  checklistDate: string;
  navItems: NavItem[];
  stats: StatItem[];
  residents: Resident[];
  checklistItems: ChecklistItem[];
}

export interface ResidentsPageData {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  residents: Resident[];
}

export interface ResidentDetailAction {
  label: string;
  tone: "neutral" | "dark";
}

export interface ResidentDetailData {
  title: string;
  subtitle: string;
  searchValue: string;
  resident: Resident;
  residentId: string;
  age: string;
  dob: string;
  admissionDate: string;
  diagnoses: string[];
  medications: string[];
  personalNotes: string[];
  actions: ResidentDetailAction[];
}
