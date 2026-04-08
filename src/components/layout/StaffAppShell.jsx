import { dashboardData } from "../../data/mockData";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

export function StaffAppShell({ children, onStubNavigate }) {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="dashboard-shell">
        <aside className="sidebar">
          <SidebarNav items={dashboardData.navItems} onStubNavigate={onStubNavigate} />
        </aside>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
