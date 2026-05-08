import { useEffect, useState } from "react";

import {
  dashboardData,
  getCanonicalDailyLogResidentId
} from "../../data/mockData";
import { db } from "../../lib/firebase";
import { listenToConversations } from "../../services/messageService";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

const staffUserId = "staff_1";
const assignedDailyLogResidentIds = ["beth-adams", "edgar-callahan", "lilian-mendoza"].map(
  getCanonicalDailyLogResidentId
);

function getPendingDailyLogsCount() {
  return assignedDailyLogResidentIds.length;
}

export function StaffAppShell({ children, onStubNavigate }) {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const pendingDailyLogsCount = getPendingDailyLogsCount();

  useEffect(() => {
    if (!db) {
      setUnreadMessagesCount(0);
      return undefined;
    }

    return listenToConversations(
      db,
      (conversations) => {
        const nextUnreadCount = conversations
          .filter((conversation) => conversation.participantIds?.includes(staffUserId))
          .reduce((total, conversation) => total + (conversation.unreadCountStaff ?? 0), 0);

        setUnreadMessagesCount(nextUnreadCount);
      },
      () => setUnreadMessagesCount(0)
    );
  }, []);

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
