import { dashboardData, loadDailyLogEntries, messagesData } from "../../data/mockData";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

export function StaffAppShell({ children, onStubNavigate }) {
  const pendingDailyLogsCount = loadDailyLogEntries().filter(
    (entry) => entry.status === "pending"
  ).length;
  const unreadMessagesCount = messagesData.contacts.reduce(
    (total, contact) => total + (contact.unreadCount ?? 0),
    0
  );

  const navItems = dashboardData.navItems.map((item) => {
    if (item.id === "daily-logs") {
      return {
        ...item,
        badgeCount: pendingDailyLogsCount,
        badgeLabel: "pending daily logs"
      };
    }

    if (item.id === "messages") {
      return {
        ...item,
        badgeCount: unreadMessagesCount,
        badgeLabel: "unread messages"
      };
    }

    return item;
  });

  return (
    <div className="app-shell">
      <TopBar />
      <div className="dashboard-shell">
        <aside className="sidebar">
          <SidebarNav items={navItems} onStubNavigate={onStubNavigate} />
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
