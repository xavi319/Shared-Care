export const dashboardData = {
  userName: "Sarah",
  subtitle: "Dashboard",
  checklistDate: "February 15, 2026",
  navItems: [
    { id: "dashboard", label: "Dashboard", href: "/", icon: "home" },
    { id: "scheduling", label: "Scheduling", href: "/scheduling", icon: "calendar" },
    { id: "residents", label: "Residents", href: "/residents", icon: "residents" },
    { id: "messages", label: "Messages", href: "/messages", icon: "messages"}
  ],
  stats: [
    { id: "pending-daily-logs", label: "Pending Daily Logs", value: 5, icon: "logs", href: "/daily-logs" },
    { id: "residents", label: "Residents", value: 32, icon: "residents", href: "/residents" },
    { id: "todays-visits", label: "Today's Visits", value: 3, icon: "visits" },
    { id: "messages", label: "Messages", value: 1, icon: "messages", href: "/messages" }
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

export const residentsPageData = {
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

export const dailyLogsPageData = {
  title: "Daily Logs",
  subtitle: "Care Documentation",
  entries: [
    {
      residentId: "beth-adams",
      caregiver: "Sarah Allen",
      mood: "Good",
      date: "2026-03-15",
      status: "pending"
    },
    {
      residentId: "clarence-doyle",
      caregiver: "Andy Smith",
      mood: "Neutral",
      date: "2026-03-15",
      status: "pending"
    },
    {
      residentId: "ronald-perry",
      caregiver: "Andy Smith",
      mood: "Good",
      date: "2026-03-15",
      status: "pending"
    },
    {
      residentId: "franklin-dempsey",
      caregiver: "Georgia Doe",
      mood: "Calm",
      date: "2026-03-15",
      status: "pending"
    },
    {
      residentId: "lilian-mendoza",
      caregiver: "Sarah Allen",
      mood: "",
      date: "2026-03-15",
      status: "pending",
      actionTone: "attention",
      reportStatus: "missing",
      meals: "",
      activityEngagement: "",
      assistanceLevel: "",
      safety: "",
      notes: ""
    },
    {
      residentId: "harold-bennett",
      caregiver: "Terry Nguyen",
      mood: "Irritable",
      date: "2026-03-14 19:47",
      status: "completed"
    },
    {
      residentId: "edgar-callahan",
      caregiver: "Sarah Allen",
      mood: "Good",
      date: "2026-03-14 11:27",
      status: "completed"
    },
    {
      residentId: "june-sinclair",
      caregiver: "Andy Smith",
      mood: "Withdrawn",
      date: "2026-03-14 14:09",
      status: "completed"
    }
  ]
};

export const dailyLogStorageKey = "sharedcare-daily-logs";

export const dailyLogFormOptions = {
  mood: ["Good", "Neutral", "Irritable", "Withdrawn", "Confused"],
  meals: ["Ate well", "Ate moderately", "Ate poorly", "Refused meals"],
  activityEngagement: [
    "Fully Engaged",
    "Moderately Engaged",
    "Disinterested",
    "Did Not Engage"
  ],
  assistanceLevel: ["Independent", "Partial Assist", "Full Assist", "Declined Assistance"],
  safety: ["Fall", "Near Fall", "Injury Observed", "Medication Refused"]
};

export const lilianMendozaDetailData = {
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

export const messagesData = {
  contacts: [
    {
      id: "contact-maria-gomez",
      name: "Maria Gomez",
      relation: "Daughter of Alex Gomez",
      room: "Room 498",
      lastMessage: "Hello Nurse Clara, how was Alex's morning today?",
      unreadCount: 2,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: "contact-robert-adams",
      name: "Robert Adams",
      relation: "Son of Beth Adams",
      room: "Room 123",
      lastMessage: "Yes, she is doing well. She just finished her breakfast.",
      unreadCount: 0,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: "contact-david-langley",
      name: "David Langley",
      relation: "Brother of Beatrice Langley",
      room: "Room 678",
      lastMessage: "Hello Nurse Clara, how was Alex's morning today?",
      unreadCount: 0,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: "contact-lillian-pembroke",
      name: "Lillian Pembroke",
      relation: "Daughter of Dorothy",
      room: "Room 418",
      lastMessage: "Thanks for the update!",
      unreadCount: 0,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ],

  conversations: {
    "contact-maria-gomez": [
      { id: "d1", type: "divider", label: "Today 9:00 AM" },
      {
        id: "m1",
        type: "message",
        text: "Hello Nurse Clara, how was Alex's morning today?",
        direction: "incoming"
      }
    ],
    "contact-robert-adams": [
      { id: "d1", type: "divider", label: "Yesterday 5:07 PM" },
      { id: "m1", type: "message", text: "Sarah just won her bingo game!", direction: "outgoing" },
      { id: "m2", type: "message", text: "She's super happy!", direction: "outgoing" },
      { id: "m3", type: "message", text: "Haha good to hear!", direction: "incoming" },
      { id: "d2", type: "divider", label: "Today 8:23 AM" },
      { id: "m4", type: "message", text: "Hi, How is my mom doing?", direction: "incoming" },
      { id: "m5", type: "message", text: "Has she been eating?", direction: "incoming" },
      {
        id: "m6",
        type: "message",
        text: "Yes, she is doing well. She just finished her breakfast.",
        direction: "outgoing"
      }
    ],
    "contact-david-langley": [
      { id: "d1", type: "divider", label: "Today 8:00 AM" },
      {
        id: "m1",
        type: "message",
        text: "Hello Nurse Clara, how was Alex's morning today?",
        direction: "incoming"
      }
    ],
    "contact-lillian-pembroke": [
      { id: "d1", type: "divider", label: "Yesterday 3:15 PM" },
      {
        id: "m1",
        type: "message",
        text: "Dorothy had a great physical therapy session!",
        direction: "outgoing"
      },
      { id: "m2", type: "message", text: "Thanks for the update!", direction: "incoming" }
    ]
  }
};

export const schedulingPageData = {
  // The date shown when the page first loads
  initialDate: new Date(2026, 1, 15), // February 15, 2026
 
  // How many hours to render in the calendar grid (starts at 8 am)
  hoursShown: 10, // 8 am – 5 pm
 
  // Scheduled events shown on the calendar
  events: [
    {
      id: "visit-1",
      title: "Robert Adam Visiting",
      subtitle: "Beth Adam's son",
      room: "Room 123",
      startTime: "9:50 AM",
      endTime: "11:40 AM",
    },
    {
      id: "visit-2",
      title: "Lillian Pembroke Visiting",
      subtitle: "Daughter of Dorothy",
      room: "Room 418",
      startTime: "12:30 PM",
      endTime: "1:40 PM",
    },
  ],
 
  // Requests awaiting staff approval shown in the right panel
  pendingAppointments: [
    {
      id: "pending-1",
      name: "Maria Gomez",
      relation: "Daughter of Alex Gomez",
      room: "Room 498",
      date: "Feb 20, 2026",
      time: "11:00 AM",
      notes: "Wants to come visit her mother for lunch, around 11AM to 12PM.",
    },
    {
      id: "pending-2",
      name: "David Langley",
      relation: "Brother of Beatrice Langley",
      room: "Room 678",
      date: "Feb 21, 2026",
      time: "4:00 PM",
      notes: "Wants to come visit his sister just to check up on her, from 4PM to 7PM-ish.",
    },
  ],
};
 

export const checklistStorageKey = "sharedcare-dashboard-checklist";

export const initialChecklistItems = dashboardData.checklistItems;
export const initialDailyLogEntries = dailyLogsPageData.entries;

const residentDetailsBySlug = {
  "lilian-mendoza": lilianMendozaDetailData
};

export function getResidentDetailBySlug(slug) {
  return residentDetailsBySlug[slug];
}

export function getResidentSlug(detailPath, explicitSlug) {
  if (explicitSlug) {
    return explicitSlug;
  }

  const pathSegments = detailPath.split("/").filter(Boolean);
  return pathSegments[pathSegments.length - 1];
}

export function loadDailyLogEntries() {
  if (typeof window === "undefined") {
    return initialDailyLogEntries;
  }

  const storedValue = window.sessionStorage.getItem(dailyLogStorageKey);

  if (!storedValue) {
    return initialDailyLogEntries;
  }

  try {
    const parsedEntries = JSON.parse(storedValue);

    if (!Array.isArray(parsedEntries)) {
      return initialDailyLogEntries;
    }

    const parsedEntriesByResidentId = new Map(
      parsedEntries.map((entry) => [entry.residentId, entry])
    );

    return initialDailyLogEntries.map((entry) => ({
      ...entry,
      ...(parsedEntriesByResidentId.get(entry.residentId) ?? {})
    }));
  } catch {
    return initialDailyLogEntries;
  }
}

export function saveDailyLogEntries(entries) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(dailyLogStorageKey, JSON.stringify(entries));
}

export function getDailyLogEntryByResidentId(residentId) {
  return loadDailyLogEntries().find((entry) => entry.residentId === residentId) ?? null;
}

export function updateDailyLogEntry(residentId, updates) {
  const nextEntries = loadDailyLogEntries().map((entry) =>
    entry.residentId === residentId ? { ...entry, ...updates } : entry
  );

  saveDailyLogEntries(nextEntries);
  return nextEntries.find((entry) => entry.residentId === residentId) ?? null;
}
