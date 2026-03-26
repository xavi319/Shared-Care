import type {
  ChecklistItem,
  DashboardData,
  ResidentDetailData,
  ResidentsPageData
} from "@/lib/types";

export const dashboardData: DashboardData = {
  userName: "Sarah",
  subtitle: "Dashboard",
  checklistDate: "February 15, 2026",
  navItems: [
    { id: "dashboard", label: "Dashboard", href: "/", icon: "home" },
    { id: "scheduling", label: "Scheduling", icon: "calendar" },
    { id: "residents", label: "Residents", href: "/residents", icon: "residents" },
    { id: "messages", label: "Messages", icon: "messages", badgeCount: 2 }
  ],
  stats: [
    { id: "pending-daily-logs", label: "Pending Daily Logs", value: 5, icon: "logs" },
    { id: "residents", label: "Residents", value: 32, icon: "residents", href: "/residents" },
    { id: "todays-visits", label: "Today's Visits", value: 3, icon: "visits" },
    { id: "messages", label: "Messages", value: 1, icon: "messages" }
  ],
  residents: [
    {
      id: "beth-adams",
      name: "Beth Adams",
      room: "Room 123",
      lastUpdate: "10:05 AM",
      image: "/images/beth-adams.jpg",
      detailPath: "/residents/beth-adams",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#86d4eb"
    },
    {
      id: "ronald-perry",
      name: "Ronald Perry",
      room: "Room 278",
      lastUpdate: "10:05 AM",
      image: "/images/ronald-perry.jpg",
      detailPath: "/residents/ronald-perry",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#c8954b"
    },
    {
      id: "harold-bennet",
      name: "Harold Bennet",
      room: "Room 123",
      lastUpdate: "10:05 AM",
      image: "/images/harold-bennet.jpg",
      detailPath: "/residents/harold-bennet",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#b9c3cf"
    }
  ],
  checklistItems: [
    { id: "task-1", time: "9:00 AM", label: "Check Beth A. Vitals", room: "Room 123", completed: false },
    { id: "task-2", time: "9:50 AM", label: "Beth's Son Visiting", room: "Room 123", completed: false },
    { id: "task-3", time: "9:00 AM", label: "Check Beth's Vitals", room: "Room 123", completed: false },
    { id: "task-4", time: "9:00 AM", label: "Check Beth's Vitals", room: "Room 123", completed: false },
    { id: "task-5", time: "9:00 AM", label: "Check Beth's Vitals", room: "Room 123", completed: false },
    { id: "task-6", time: "9:00 AM", label: "Check Beth's Vitals", room: "Room 123", completed: false }
  ]
};

export const residentsPageData: ResidentsPageData = {
  title: "Residents",
  subtitle: "Search",
  searchPlaceholder: "Type to search...",
  residents: [
    {
      id: "beth-adams",
      name: "Beth Adams",
      room: "Room 123",
      lastUpdate: "10:05 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "/images/beth-adams.jpg",
      detailPath: "/residents/beth-adams",
      accent: "#86d4eb"
    },
    {
      id: "clarence-doyle",
      name: "Clarence Doyle",
      room: "Room 222",
      lastUpdate: "9:42 AM",
      lastUpdateLabel: "Daily Log last updated",
      detailPath: "/residents/clarence-doyle",
      accent: "#9dc9e4"
    },
    {
      id: "edgar-callahan",
      name: "Edgar Callahan",
      room: "Room 124",
      lastUpdate: "12:02 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      detailPath: "/residents/edgar-callahan",
      accent: "#d3a16c"
    },
    {
      id: "franklin-dempsey",
      name: "Franklin Dempsey",
      room: "Room 225",
      lastUpdate: "11:14 AM",
      lastUpdateLabel: "Daily Log last updated",
      detailPath: "/residents/franklin-dempsey",
      accent: "#7a8d9c"
    },
    {
      id: "harold-bennett",
      name: "Harold Bennett",
      room: "Room 127",
      lastUpdate: "4:32 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      image: "/images/harold-bennet.jpg",
      detailPath: "/residents/harold-bennett",
      accent: "#b9c3cf"
    },
    {
      id: "june-sinclair",
      name: "June Sinclair",
      room: "Room 532",
      lastUpdate: "2:54 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      detailPath: "/residents/june-sinclair",
      accent: "#d0b676"
    },
    {
      id: "lilian-mendoza",
      slug: "lilian-mendoza",
      name: "Lilian Mendoza",
      room: "Room 252",
      lastUpdate: "8:24 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "/images/lilian-mendoza.jpg",
      detailPath: "/residents/lilian-mendoza",
      accent: "#b88b72"
    }
  ]
};

export const lilianMendozaDetailData: ResidentDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Lilian Mendoza",
  resident: {
    id: "lilian-mendoza",
    slug: "lilian-mendoza",
    name: "Lilian Mendoza",
    room: "Room 252",
    lastUpdate: "8:24 AM",
    lastUpdateLabel: "Daily Log last updated",
    image: "/images/lilian-mendoza.jpg",
    detailPath: "/residents/lilian-mendoza",
    accent: "#b88b72"
  },
  residentId: "NH-20458",
  age: "64",
  dob: "01/01/1964",
  admissionDate: "June 8, 2023",
  diagnoses: ["Hypertension", "Type 2 Diabetes"],
  medications: [
    "Metformin 500 mg Oral Twice Daily (8:00 AM, 8:00 PM)",
    "Lisinopril 10 mg Oral Once Daily (9:00 AM)"
  ],
  personalNotes: [
    "Prefers to wake up around 10:30 AM. Not a morning person.",
    "Enjoys chamomile tea before bed.",
    "Likes her room curtains slightly open during the day.",
    "Gets anxious if routine changes without notice."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const checklistStorageKey = "sharedcare-dashboard-checklist";

export const initialChecklistItems: ChecklistItem[] = dashboardData.checklistItems;

const residentDetailsBySlug: Record<string, ResidentDetailData> = {
  "lilian-mendoza": lilianMendozaDetailData
};

export function getResidentDetailBySlug(slug: string) {
  return residentDetailsBySlug[slug];
}
