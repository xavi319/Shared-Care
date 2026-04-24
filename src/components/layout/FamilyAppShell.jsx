import { useNavigate } from "react-router-dom";

import { familyData } from "../../data/mockData";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

export function FamilyAppShell({ children }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell family-app-shell">
      <TopBar />
      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="family-sidebar-heading">
            <p className="family-sidebar-kicker">Family View</p>
            <button className="view-mode-toggle" type="button" onClick={() => navigate("/")}>
              Dev: Staff View
            </button>
          </div>
          <SidebarNav items={familyData.navItems} />
        </aside>
        <main className="content family-content">{children}</main>
      </div>
    </div>
  );
}
