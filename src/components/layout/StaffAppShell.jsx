import { dashboardData, messagesData } from "../../data/mockData";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

export function StaffAppShell({ children, onStubNavigate }) {
  const unreadMessagesCount = messagesData.contacts.reduce(
    (total, contact) => total + (contact.unreadCount ?? 0),
    0
  );

  const navItems = dashboardData.navItems.map((item) =>
    item.id === "messages" ? { ...item, badgeCount: unreadMessagesCount } : item
  );

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
