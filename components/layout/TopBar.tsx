"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { InboxIcon } from "@/components/layout/icons";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function TopBar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(formatTime(new Date()));

    const intervalId = window.setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="SharedCare dashboard">
        <img className="brand-wordmark" src="/images/sharedcare-logo-blue.png" alt="SharedCare" />
      </Link>

      <div className="topbar-actions">
        <p className="current-time" suppressHydrationWarning>
          {currentTime}
        </p>
        <button className="icon-button" type="button" aria-label="Inbox">
          <InboxIcon />
        </button>
        <div className="avatar">
          <img src="/images/sarah-profile.jpg" alt="Sarah profile" />
        </div>
      </div>
    </header>
  );
}
