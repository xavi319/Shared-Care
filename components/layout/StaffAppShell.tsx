"use client";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopBar } from "@/components/layout/TopBar";
import { dashboardData } from "@/lib/mock-data";

interface StaffAppShellProps {
  children: React.ReactNode;
  onStubNavigate?: (navId: string) => void;
}

export function StaffAppShell({ children, onStubNavigate }: StaffAppShellProps) {
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
