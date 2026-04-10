import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";
import { InboxIcon } from "./icons";

function formatTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function TopBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(formatTime(new Date()));

    const intervalId = window.setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <Link className="brand" to="/" aria-label="SharedCare dashboard">
        <img className="brand-wordmark" src="/images/sharedcare-logo-blue.png" alt="SharedCare" />
      </Link>

      <div className="topbar-actions">
        <p className="current-time">{currentTime}</p>
        <button className="icon-button" type="button" aria-label="Inbox">
          <InboxIcon />
        </button>
        <button className="topbar-action-button" type="button" onClick={handleLogout}>
          Log Out
        </button>
        <div className="avatar">
          <img src="/images/sarah-profile.jpg" alt="Sarah profile" />
        </div>
      </div>
    </header>
  );
}
