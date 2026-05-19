import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { familyData } from "../../data/mockData";
import { db } from "../../lib/firebase";
import { listenToConversations } from "../../services/messageService";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";

const familyUserId = "family_robert_adams";

export function FamilyAppShell({ children }) {
  const navigate = useNavigate();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (!db) {
      setUnreadMessagesCount(0);
      return undefined;
    }

    return listenToConversations(
      db,
      (conversations) => {
        const nextUnreadCount = conversations
          .filter((conversation) => conversation.participantIds?.includes(familyUserId))
          .reduce((total, conversation) => total + (conversation.unreadCountFamily ?? 0), 0);

        setUnreadMessagesCount(nextUnreadCount);
      },
      () => setUnreadMessagesCount(0)
    );
  }, []);

  const navItems = familyData.navItems.map((item) =>
    item.id === "family-messages"
      ? {
          ...item,
          badgeCount: unreadMessagesCount,
          badgeLabel: "unread messages"
        }
      : item
  );

  return (
    <div className="app-shell family-app-shell">
      <TopBar />
      <div className="dashboard-shell">
        <aside className="sidebar">
          <SidebarNav items={navItems} />
          <div className="family-sidebar-heading">
            <p className="family-sidebar-kicker">Family View</p>
            <button className="view-mode-toggle" type="button" onClick={() => navigate("/")}>
              Dev: Staff View
            </button>
          </div>
        </aside>
        <main className="content family-content">{children}</main>
      </div>
    </div>
  );
}
