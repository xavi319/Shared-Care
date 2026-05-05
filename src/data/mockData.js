export const dashboardData = {
  userName: "Sarah",
  subtitle: "Dashboard",
  checklistDate: "February 15, 2026",
  navItems: [
    { id: "dashboard", label: "Dashboard", href: "/", icon: "home" },
    { id: "daily-logs", label: "Daily Logs", href: "/daily-logs", icon: "logs" },
    { id: "scheduling", label: "Scheduling", href: "/scheduling", icon: "calendar" },
    { id: "residents", label: "Residents", href: "/residents", icon: "residents" },
    { id: "messages", label: "Messages", href: "/messages", icon: "messages" }
  ],
  stats: [
    { id: "pending-daily-logs", label: "Pending Daily Logs", icon: "logs", href: "/daily-logs" },
    { id: "residents", label: "Residents", icon: "residents", href: "/residents" },
    { id: "todays-visits", label: "Today's Visits", icon: "visits", href: "/scheduling" },
    { id: "messages", label: "Messages", icon: "messages", href: "/messages" }
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
      id: "harold-bennett",
      name: "Harold Bennett",
      room: "Room 127",
      lastUpdate: "10:05 AM",
      image: "/images/harold-bennet.jpg",
      detailPath: "/residents/harold-bennett",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#b9c3cf"
    }
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
      id: "ronald-perry",
      name: "Ronald Perry",
      room: "Room 278",
      lastUpdate: "10:05 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "/images/ronald-perry.jpg",
      detailPath: "/residents/ronald-perry",
      accent: "#c8954b"
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

export const familyData = {
  navItems: [
    { id: "family-dashboard", label: "Dashboard", href: "/family", icon: "home" },
    { id: "family-daily-logs", label: "Daily Logs", href: "/family/daily-logs", icon: "logs" },
    { id: "family-scheduling", label: "Scheduling", href: "/family/scheduling", icon: "calendar" },
    { id: "family-messages", label: "Messages", href: "/family/messages", icon: "messages" }
  ],
  resident: {
    id: "beth_123",
    name: "Beth Adams",
    room: "Room 123",
    lastUpdated: "Today at 10:05 AM",
    status: "Mostly Calm",
    image: "/images/beth-adams.jpg",
    dailySummary:
      "Beth had a steady morning, ate breakfast well, and enjoyed a quiet activity after vitals."
  },
  visitor: {
    name: "Robert Adams"
  }
};

export const dailyLogsPageData = {
  title: "Daily Logs",
  subtitle: "Care Documentation",
  requiredDate: "2026-03-15",
  entries: [
    {
      residentId: "beth-adams",
      caregiver: "Sarah Allen",
      mood: "Good",
      date: "2026-03-15 10:05",
      status: "completed",
      reportStatus: "submitted",
      meals: "Ate well",
      activityEngagement: "Moderately Engaged",
      assistanceLevel: "Partial Assist",
      safety: "",
      notes:
        "Beth had a calm morning. She ate breakfast well, joined part of the group activity, and responded positively to check-ins from staff."
    },
    {
      residentId: "beth-adams",
      caregiver: "Terry Nguyen",
      mood: "Neutral",
      date: "2026-03-14 17:20",
      status: "completed",
      reportStatus: "submitted",
      meals: "Ate moderately",
      activityEngagement: "Moderately Engaged",
      assistanceLevel: "Partial Assist",
      safety: "",
      notes:
        "Beth rested after lunch, ate a moderate dinner, and enjoyed looking through family photos with staff."
    },
    {
      residentId: "beth-adams",
      caregiver: "Georgia Doe",
      mood: "Good",
      date: "2026-03-13 09:45",
      status: "completed",
      reportStatus: "submitted",
      meals: "Ate well",
      activityEngagement: "Fully Engaged",
      assistanceLevel: "Independent",
      safety: "",
      notes:
        "Beth was bright during the morning routine, finished most of breakfast, and stayed for the full music group."
    },
    {
      residentId: "beth-adams",
      caregiver: "Andy Smith",
      mood: "Withdrawn",
      date: "2026-03-12 18:10",
      status: "completed",
      reportStatus: "submitted",
      meals: "Ate moderately",
      activityEngagement: "Disinterested",
      assistanceLevel: "Partial Assist",
      safety: "",
      notes:
        "Beth preferred quiet time in her room for much of the afternoon, accepted gentle check-ins, and ate soup at dinner."
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
export const currentDemoStaffName = "Sarah Allen";
const currentDemoStaffFirstName = dashboardData.userName;

const canonicalDailyLogResidentIds = {
  "beth-adams": "beth_123",
  beth_123: "beth_123"
};

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
  safety: ["No safety concerns", "Fall", "Near fall", "Injury observed", "Medication refused"]
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
  primaryRelative: {
    name: "Maria Mendoza",
    relation: "Daughter",
    room: "Room 252",
    contactId: "contact-maria-mendoza"
  },
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

export const bethAdamsDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Beth Adams",
  resident: {
    id: "beth-adams",
    slug: "beth-adams",
    name: "Beth Adams",
    room: "Room 123",
    lastUpdate: "10:05 AM",
    lastUpdateLabel: "Daily Log last updated",
    image: "/images/beth-adams.jpg",
    detailPath: "/residents/beth-adams",
    accent: "#86d4eb"
  },
  residentId: "NH-20013",
  age: "79",
  dob: "08/14/1946",
  admissionDate: "January 12, 2022",
  diagnoses: ["Mild Osteoarthritis", "Chronic Atrial Fibrillation"],
  primaryRelative: {
    name: "Robert Adams",
    relation: "Son",
    room: "Room 123",
    contactId: "contact-robert-adams"
  },
  medications: [
    "Apixaban 5 mg Oral Twice Daily (8:00 AM, 8:00 PM)",
    "Acetaminophen 500 mg Oral As Needed for Joint Pain"
  ],
  personalNotes: [
    "Enjoys bingo and social group activities.",
    "Prefers oatmeal with fruit for breakfast.",
    "Requests a reminder before family video calls."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const ronaldPerryDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Ronald Perry",
  resident: {
    id: "ronald-perry",
    slug: "ronald-perry",
    name: "Ronald Perry",
    room: "Room 278",
    lastUpdate: "10:05 AM",
    lastUpdateLabel: "Daily Log last updated",
    image: "/images/ronald-perry.jpg",
    detailPath: "/residents/ronald-perry",
    accent: "#c8954b"
  },
  residentId: "NH-20264",
  age: "81",
  dob: "05/22/1945",
  admissionDate: "March 17, 2023",
  diagnoses: ["Type 2 Diabetes", "Mild Cognitive Impairment"],
  primaryRelative: {
    name: "Elaine Perry",
    relation: "Daughter",
    room: "Room 278"
  },
  medications: [
    "Metformin 500 mg Oral Twice Daily",
    "Atorvastatin 20 mg Oral Nightly"
  ],
  personalNotes: [
    "Enjoys morning walks when weather permits.",
    "Prefers coffee with breakfast.",
    "Responds well to reminders written in large print."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const clarenceDoyleDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Clarence Doyle",
  resident: {
    id: "clarence-doyle",
    slug: "clarence-doyle",
    name: "Clarence Doyle",
    room: "Room 222",
    lastUpdate: "9:42 AM",
    lastUpdateLabel: "Daily Log last updated",
    detailPath: "/residents/clarence-doyle",
    accent: "#9dc9e4"
  },
  residentId: "NH-20177",
  age: "83",
  dob: "03/09/1943",
  admissionDate: "September 4, 2021",
  diagnoses: ["Parkinson's Disease", "Orthostatic Hypotension"],
  primaryRelative: {
    name: "David Doyle",
    relation: "Son",
    room: "Room 222",
    contactId: "contact-david-doyle"
  },
  medications: [
    "Carbidopa-Levodopa 25/100 mg Oral Three Times Daily",
    "Midodrine 5 mg Oral Twice Daily"
  ],
  personalNotes: [
    "Walks better with a short warm-up stretch.",
    "Responds positively to calm, one-step instructions.",
    "Enjoys jazz music in the afternoons."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const edgarCallahanDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Edgar Callahan",
  resident: {
    id: "edgar-callahan",
    slug: "edgar-callahan",
    name: "Edgar Callahan",
    room: "Room 124",
    lastUpdate: "12:02 PM, Yesterday",
    lastUpdateLabel: "Daily Log last updated",
    detailPath: "/residents/edgar-callahan",
    accent: "#d3a16c"
  },
  residentId: "NH-20342",
  age: "71",
  dob: "11/27/1954",
  admissionDate: "April 19, 2024",
  diagnoses: ["COPD", "Generalized Anxiety Disorder"],
  primaryRelative: {
    name: "Megan Callahan",
    relation: "Daughter",
    room: "Room 124"
  },
  medications: [
    "Tiotropium 18 mcg Inhaled Once Daily",
    "Sertraline 50 mg Oral Once Daily"
  ],
  personalNotes: [
    "Prefers sitting near windows during meals.",
    "Benefits from guided breathing during anxiety episodes.",
    "Likes the newspaper crossword each morning."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const franklinDempseyDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Franklin Dempsey",
  resident: {
    id: "franklin-dempsey",
    slug: "franklin-dempsey",
    name: "Franklin Dempsey",
    room: "Room 225",
    lastUpdate: "11:14 AM",
    lastUpdateLabel: "Daily Log last updated",
    detailPath: "/residents/franklin-dempsey",
    accent: "#7a8d9c"
  },
  residentId: "NH-20506",
  age: "76",
  dob: "06/05/1950",
  admissionDate: "December 2, 2022",
  diagnoses: ["Vascular Dementia", "Stage 2 Chronic Kidney Disease"],
  primaryRelative: {
    name: "Angela Dempsey",
    relation: "Spouse",
    room: "Room 225"
  },
  medications: [
    "Donepezil 10 mg Oral Nightly",
    "Losartan 50 mg Oral Once Daily"
  ],
  personalNotes: [
    "Eats better when offered smaller portions more often.",
    "Prefers evening walks in the courtyard.",
    "Can become frustrated with loud environments."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const haroldBennettDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "Harold Bennett",
  resident: {
    id: "harold-bennett",
    slug: "harold-bennett",
    name: "Harold Bennett",
    room: "Room 127",
    lastUpdate: "4:32 PM, Yesterday",
    lastUpdateLabel: "Daily Log last updated",
    image: "/images/harold-bennet.jpg",
    detailPath: "/residents/harold-bennett",
    accent: "#b9c3cf"
  },
  residentId: "NH-19889",
  age: "88",
  dob: "10/03/1938",
  admissionDate: "May 14, 2020",
  diagnoses: ["Congestive Heart Failure", "Macular Degeneration"],
  primaryRelative: {
    name: "Lillian Bennett",
    relation: "Daughter",
    room: "Room 127",
    contactId: "contact-lillian-bennett"
  },
  medications: [
    "Furosemide 20 mg Oral Every Morning",
    "Metoprolol Succinate 25 mg Oral Once Daily"
  ],
  personalNotes: [
    "Needs high-contrast text for reading materials.",
    "Enjoys baseball highlights after dinner.",
    "Prefers blood pressure checks before lunch."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const juneSinclairDetailData = {
  title: "Residents",
  subtitle: "Search",
  searchValue: "June Sinclair",
  resident: {
    id: "june-sinclair",
    slug: "june-sinclair",
    name: "June Sinclair",
    room: "Room 532",
    lastUpdate: "2:54 PM, Yesterday",
    lastUpdateLabel: "Daily Log last updated",
    detailPath: "/residents/june-sinclair",
    accent: "#d0b676"
  },
  residentId: "NH-20711",
  age: "68",
  dob: "02/18/1958",
  admissionDate: "August 29, 2025",
  diagnoses: ["Major Depressive Disorder", "Insomnia"],
  primaryRelative: {
    name: "Paul Sinclair",
    relation: "Brother",
    room: "Room 532"
  },
  medications: [
    "Mirtazapine 15 mg Oral Nightly",
    "Melatonin 3 mg Oral at Bedtime"
  ],
  personalNotes: [
    "Feels more engaged with afternoon art sessions.",
    "Prefers tea over coffee.",
    "Responds well to check-ins before evening medications."
  ],
  actions: [
    { label: "Daily Log Summaries", tone: "neutral" },
    { label: "Medical Charts", tone: "dark" }
  ]
};

export const messagesData = {
  contacts: [
    {
      id: "contact-maria-mendoza",
      name: "Maria Mendoza",
      relation: "Daughter of Lilian Mendoza",
      room: "Room 252",
      lastMessage: "Hello Nurse Sarah, how was Lilian's morning today?",
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
      id: "contact-david-doyle",
      name: "David Doyle",
      relation: "Son of Clarence Doyle",
      room: "Room 222",
      lastMessage: "Hello Nurse Sarah, how was Clarence's morning today?",
      unreadCount: 0,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: "contact-lillian-bennett",
      name: "Lillian Bennett",
      relation: "Daughter of Harold Bennett",
      room: "Room 127",
      lastMessage: "Thanks for the update!",
      unreadCount: 0,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ],

  conversations: {
    "contact-maria-mendoza": [
      { id: "d1", type: "divider", label: "Today 9:00 AM" },
      {
        id: "m1",
        type: "message",
        text: "Hello Nurse Sarah, how was Lilian's morning today?",
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
    "contact-david-doyle": [
      { id: "d1", type: "divider", label: "Today 8:00 AM" },
      {
        id: "m1",
        type: "message",
        text: "Hello Nurse Sarah, how was Clarence's morning today?",
        direction: "incoming"
      }
    ],
    "contact-lillian-bennett": [
      { id: "d1", type: "divider", label: "Yesterday 3:15 PM" },
      {
        id: "m1",
        type: "message",
        text: "Harold had a great physical therapy session!",
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
      title: "Robert Adams Visiting",
      subtitle: "Beth Adams' son",
      room: "Room 123",
      startTime: "9:50 AM",
      endTime: "11:40 AM",
      date: "2026-02-15",
    },
    {
      id: "visit-2",
      title: "Lillian Bennett Visiting",
      subtitle: "Daughter of Harold Bennett",
      room: "Room 127",
      startTime: "12:30 PM",
      endTime: "1:40 PM",
      date: "2026-02-15",
    },
    {
      id: "visit-3",
      title: "Maria Mendoza Visiting",
      subtitle: "Daughter of Lilian Mendoza",
      room: "Room 252",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      date: "2026-02-14",
    },
    {
      id: "visit-4",
      title: "David Doyle Visiting",
      subtitle: "Son of Clarence Doyle",
      room: "Room 222",
      startTime: "4:00 PM",
      endTime: "5:00 PM",
      date: "2026-02-16",
    },
  ],
 
  // Requests awaiting staff approval shown in the right panel
  pendingAppointments: [
    {
      id: "pending-1",
      name: "Maria Mendoza",
      relation: "Daughter of Lilian Mendoza",
      room: "Room 252",
      date: "Feb 20, 2026",
      time: "11:00 AM",
      notes: "Wants to come visit her mother for lunch, around 11AM to 12PM.",
    },
    {
      id: "pending-2",
      name: "David Doyle",
      relation: "Son of Clarence Doyle",
      room: "Room 222",
      date: "Feb 21, 2026",
      time: "4:00 PM",
      notes: "Wants to come visit his father just to check up on him, from 4PM to 7PM-ish.",
    },
    {
      id: "pending-3",
      name: "James Bennett",
      relation: "Son of Harold Bennett",
      room: "Room 127",
      date: "Feb 15, 2026",
      time: "10:30 AM",
      notes: "Wants to stop by and visit his father in the morning.",
    },
  ],
};
 
export const checklistStorageKey = "sharedcare-dashboard-checklist";

export const initialDailyLogEntries = dailyLogsPageData.entries;

export function getCanonicalDailyLogResidentId(residentId) {
  return canonicalDailyLogResidentIds[residentId] ?? residentId;
}

export function isDailyLogForResident(entryResidentId, residentId) {
  return getCanonicalDailyLogResidentId(entryResidentId) === getCanonicalDailyLogResidentId(residentId);
}

function getDailyLogCreatedAt(entry) {
  return entry.createdAt ?? entry.date ?? "";
}

export function getDailyLogDateKey(value) {
  if (!value) {
    return "";
  }

  const dateValue = typeof value === "object" && typeof value.toDate === "function"
    ? value.toDate()
    : new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(dateValue.getTime())) {
    return String(value).slice(0, 10);
  }

  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDailyLogRequiredDate() {
  if (dailyLogsPageData.requiredDate) {
    return dailyLogsPageData.requiredDate;
  }

  return getUniqueDailyLogEntries(initialDailyLogEntries)
    .map((entry) => getDailyLogDateKey(getDailyLogCreatedAt(entry)))
    .filter(Boolean)
    .sort()
    .at(-1) ?? "";
}

function getDailyLogSummary(entry) {
  return entry.summary ?? entry.notes ?? "";
}

function normalizeDailyLogIdPart(value) {
  return String(value || "missing")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDailyLogSummaryHash(value) {
  return String(value || "")
    .split("")
    .reduce((hash, character) => ((hash << 5) - hash + character.charCodeAt(0)) | 0, 0)
    .toString(36)
    .replace("-", "n");
}

function getStableDailyLogId(entry) {
  const createdAt = getDailyLogCreatedAt(entry);
  const summary = getDailyLogSummary(entry);

  return [
    "daily-log",
    normalizeDailyLogIdPart(getCanonicalDailyLogResidentId(entry.residentId)),
    normalizeDailyLogIdPart(createdAt),
    getDailyLogSummaryHash(summary || entry.mood || entry.status)
  ].join("-");
}

function normalizeDailyLogEntry(entry) {
  const residentId = getCanonicalDailyLogResidentId(entry.residentId);
  const createdAt = getDailyLogCreatedAt(entry);
  const summary = getDailyLogSummary(entry);
  const rawStaffName = entry.staffName ?? entry.caregiverName ?? entry.caregiver ?? currentDemoStaffName;
  const staffName = rawStaffName === currentDemoStaffFirstName ? currentDemoStaffName : rawStaffName;

  return {
    ...entry,
    id: entry.id ?? getStableDailyLogId({ ...entry, residentId, createdAt, summary }),
    residentId,
    residentName: entry.residentName ?? (residentId === "beth_123" ? "Beth Adams" : entry.residentName),
    residentRoom: entry.residentRoom ?? (residentId === "beth_123" ? "Room 123" : entry.residentRoom),
    staffName,
    caregiverName: staffName,
    caregiver: staffName,
    createdAt,
    date: createdAt,
    summary,
    notes: entry.notes ?? summary,
    visibleToFamily: entry.visibleToFamily ?? entry.reportStatus === "submitted"
  };
}

function getDailyLogFallbackDedupeKey(entry) {
  return [
    getCanonicalDailyLogResidentId(entry.residentId),
    getDailyLogCreatedAt(entry),
    getDailyLogSummary(entry)
  ].join("|");
}

function getDailyLogPreferenceScore(entry) {
  let score = 0;

  if (entry.reportStatus === "missing") {
    score += 8;
  }

  if (entry.staffName === currentDemoStaffName) {
    score += 4;
  } else if (entry.staffName === currentDemoStaffFirstName || entry.staffName?.startsWith(currentDemoStaffFirstName)) {
    score += 3;
  }

  if (entry.visibleToFamily) {
    score += 2;
  }

  if (entry.reportStatus === "submitted") {
    score += 1;
  }

  return score;
}

function getPreferredDailyLogEntry(currentEntry, nextEntry) {
  if (!currentEntry) {
    return nextEntry;
  }

  return getDailyLogPreferenceScore(nextEntry) >= getDailyLogPreferenceScore(currentEntry)
    ? nextEntry
    : currentEntry;
}

export function getUniqueDailyLogEntries(entries) {
  const entriesById = new Map();

  entries.map((entry) => normalizeDailyLogEntry(entry)).forEach((entry) => {
    entriesById.set(entry.id, getPreferredDailyLogEntry(entriesById.get(entry.id), entry));
  });

  const entriesByFallbackKey = new Map();

  Array.from(entriesById.values()).forEach((entry) => {
    const fallbackKey = getDailyLogFallbackDedupeKey(entry);
    entriesByFallbackKey.set(
      fallbackKey,
      getPreferredDailyLogEntry(entriesByFallbackKey.get(fallbackKey), entry)
    );
  });

  return Array.from(entriesByFallbackKey.values());
}

const residentDetailsBySlug = {
  "beth-adams": bethAdamsDetailData,
  "ronald-perry": ronaldPerryDetailData,
  "clarence-doyle": clarenceDoyleDetailData,
  "edgar-callahan": edgarCallahanDetailData,
  "franklin-dempsey": franklinDempseyDetailData,
  "harold-bennett": haroldBennettDetailData,
  "june-sinclair": juneSinclairDetailData,
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
    return getUniqueDailyLogEntries(initialDailyLogEntries);
  }

  const storedValue = window.sessionStorage.getItem(dailyLogStorageKey);

  if (!storedValue) {
    return getUniqueDailyLogEntries(initialDailyLogEntries);
  }

  try {
    const parsedEntries = JSON.parse(storedValue);

    if (!Array.isArray(parsedEntries)) {
      return getUniqueDailyLogEntries(initialDailyLogEntries);
    }

    return getUniqueDailyLogEntries([...initialDailyLogEntries, ...parsedEntries]);
  } catch {
    return getUniqueDailyLogEntries(initialDailyLogEntries);
  }
}

export function saveDailyLogEntries(entries) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(dailyLogStorageKey, JSON.stringify(getUniqueDailyLogEntries(entries)));
}

export function getDailyLogEntryByResidentId(residentId, targetDate = getDailyLogRequiredDate()) {
  return loadDailyLogEntries()
    .filter((entry) => isDailyLogForResident(entry.residentId, residentId))
    .filter((entry) => getDailyLogDateKey(getDailyLogCreatedAt(entry)) === targetDate)
    .sort((firstEntry, secondEntry) => {
      const firstDate = new Date(String(getDailyLogCreatedAt(firstEntry)).replace(" ", "T"));
      const secondDate = new Date(String(getDailyLogCreatedAt(secondEntry)).replace(" ", "T"));

      return secondDate.getTime() - firstDate.getTime();
    })[0] ?? null;
}

export function updateDailyLogEntry(residentId, updates) {
  const entries = loadDailyLogEntries();
  const targetDate = getDailyLogDateKey(updates.createdAt ?? updates.date) || getDailyLogRequiredDate();
  const targetIndex = entries.findIndex(
    (entry) =>
      isDailyLogForResident(entry.residentId, residentId) &&
      getDailyLogDateKey(getDailyLogCreatedAt(entry)) === targetDate
  );
  const nextEntry = normalizeDailyLogEntry({
    ...(targetIndex >= 0 ? entries[targetIndex] : { residentId }),
    ...updates
  });
  const nextEntries =
    targetIndex >= 0
      ? entries.map((entry, index) => (index === targetIndex ? nextEntry : entry))
      : [nextEntry, ...entries];

  const uniqueEntries = getUniqueDailyLogEntries(nextEntries);

  saveDailyLogEntries(uniqueEntries);
  return uniqueEntries.find((entry) => entry.id === nextEntry.id) ?? nextEntry;
}
