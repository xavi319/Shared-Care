// @ts-check

/** @typedef {import("./dashboard-types").DashboardData} DashboardData */
/** @typedef {import("./dashboard-types").ResidentsPageData} ResidentsPageData */

/** @type {DashboardData} */
export const dashboardData = {
  title: "Good morning, Sarah",
  userName: "Sarah",
  subtitle: "Dashboard",
  checklistDate: "February 15, 2026",
  navItems: [
    { id: "dashboard", label: "Dashboard", href: "./index.html", icon: "home", isCurrent: true },
    { id: "scheduling", label: "Scheduling", href: "#scheduling", icon: "calendar" },
    { id: "residents", label: "Residents", href: "./residents.html", icon: "residents" },
    { id: "messages", label: "Messages", href: "#messages", icon: "messages" }
  ],
  stats: [
    { id: "pending-daily-logs", label: "Pending Daily Logs", value: 5, icon: "logs" },
    { id: "residents", label: "Residents", value: 32, icon: "residents" },
    { id: "todays-visits", label: "Today's Visits", value: 3, icon: "visits" },
    { id: "messages", label: "Messages", value: 1, icon: "messages" }
  ],
  residents: [
    {
      id: "beth-adams",
      name: "Beth Adams",
      room: "Room 123",
      lastUpdate: "10:05 AM",
      image: "./images/beth-adams.jpg",
      detailPath: "/residents/beth-adams",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#86d4eb"
    },
    {
      id: "ronald-perry",
      name: "Ronald Perry",
      room: "Room 278",
      lastUpdate: "10:05 AM",
      image: "./images/ronald-perry.jpg",
      detailPath: "/residents/ronald-perry",
      lastUpdateLabel: "Daily Log last updated",
      accent: "#c8954b"
    },
    {
      id: "harold-bennet",
      name: "Harold Bennet",
      room: "Room 123",
      lastUpdate: "10:05 AM",
      image: "./images/harold-bennet.jpg",
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

/** @type {ResidentsPageData} */
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
      image: "./images/beth-adams.jpg",
      detailPath: "/residents/beth-adams",
      accent: "#86d4eb"
    },
    {
      id: "clarence-doyle",
      name: "Clarence Doyle",
      room: "Room 222",
      lastUpdate: "9:42 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "",
      detailPath: "/residents/clarence-doyle",
      accent: "#9dc9e4"
    },
    {
      id: "edgar-callahan",
      name: "Edgar Callahan",
      room: "Room 124",
      lastUpdate: "12:02 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      image: "",
      detailPath: "/residents/edgar-callahan",
      accent: "#d3a16c"
    },
    {
      id: "franklin-dempsey",
      name: "Franklin Dempsey",
      room: "Room 225",
      lastUpdate: "11:14 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "",
      detailPath: "/residents/franklin-dempsey",
      accent: "#7a8d9c"
    },
    {
      id: "harold-bennett",
      name: "Harold Bennett",
      room: "Room 127",
      lastUpdate: "4:32 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      image: "./images/harold-bennet.jpg",
      detailPath: "/residents/harold-bennett",
      accent: "#b9c3cf"
    },
    {
      id: "june-sinclair",
      name: "June Sinclair",
      room: "Room 532",
      lastUpdate: "2:54 PM, Yesterday",
      lastUpdateLabel: "Daily Log last updated",
      image: "",
      detailPath: "/residents/june-sinclair",
      accent: "#d0b676"
    },
    {
      id: "lillian-mendoza",
      name: "Lillian Mendoza",
      room: "Room 252",
      lastUpdate: "8:24 AM",
      lastUpdateLabel: "Daily Log last updated",
      image: "",
      detailPath: "/residents/lillian-mendoza",
      accent: "#b88b72"
    }
  ]
};
