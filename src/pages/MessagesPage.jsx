import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import {
  AttachIcon,
  CheckDoubleIcon,
  CheckMarkIcon,
  ComposeIcon,
  SearchIcon,
  SendIcon,
  UserRoundIcon
} from "../components/layout/icons";
import { getDailyLogEntryByResidentId, messagesData } from "../data/mockData";
import { db } from "../lib/firebase";
import { listenToDailyLogsForResident } from "../services/dailyLogService";
import {
  listenToConversations,
  listenToMessages,
  markConversationAsRead,
  sendMessage
} from "../services/messageService";

const staffUser = {
  uid: "staff_1",
  name: "Sarah",
  role: "staff"
};

const familyUser = {
  uid: "family_robert_adams",
  name: "Robert Adams",
  role: "family"
};

const robertAdamsConversationId = "contact-robert-adams";
const sarahProfileImage = "/images/sarah-profile.jpg";

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeRoom(room) {
  if (!room) {
    return "";
  }

  const roomText = String(room);
  return roomText.toLowerCase().includes("room") ? roomText : `Room ${roomText}`;
}

function parseFamilyRelation(relation = "") {
  const [relationship, residentName] = String(relation).split(" of ");

  return {
    relationship: relationship || "Family",
    residentName: residentName || ""
  };
}

function getFallbackResidentId(residentName, fallbackId) {
  const slug = String(residentName || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || fallbackId;
}

function getResidentProfilePath(contact) {
  const residentSlug = String(contact?.residentName || contact?.residentId || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return residentSlug ? `/residents/${residentSlug}` : "/residents";
}

function formatCareLabel(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function formatTimestamp(value, fallback = "") {
  if (!value) {
    return fallback;
  }

  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatContactFromConversation(conversation, viewMode) {
  const isFamilyView = viewMode === "family";
  const room = normalizeRoom(conversation.residentRoom);
  const relationship = isFamilyView ? "Care team" : conversation.familyRelationship;
  const relation = isFamilyView
    ? `Care team for ${conversation.residentName}`
    : `${relationship} of ${conversation.residentName}`;

  return {
    id: conversation.id,
    name: isFamilyView ? "Sarah" : conversation.familyName,
    image: isFamilyView ? sarahProfileImage : conversation.familyImage,
    relation,
    relationship,
    residentName: conversation.residentName,
    residentId: conversation.residentId,
    room,
    lastMessage: conversation.lastMessage ?? "No care updates have been shared yet.",
    timestamp: formatTimestamp(conversation.lastMessageAt, ""),
    unreadCount: isFamilyView
      ? conversation.unreadCountFamily ?? 0
      : conversation.unreadCountStaff ?? 0,
    conversation
  };
}

function getFallbackConversations(viewMode) {
  const fallbackContacts = messagesData.contacts.map((contact, index) => {
    const { relationship, residentName } = parseFamilyRelation(contact.relation);

    return {
      id: contact.id,
      familyName: contact.name,
      familyRelationship: relationship,
      familyImage: "",
      residentId: getFallbackResidentId(residentName, contact.id),
      residentName,
      residentRoom: contact.room,
      lastMessage: contact.lastMessage,
      lastMessageAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
      unreadCountStaff: contact.unreadCount,
      unreadCountFamily: contact.id === robertAdamsConversationId ? contact.unreadCount : 0,
      participantIds: ["staff_1", contact.id === robertAdamsConversationId ? familyUser.uid : `family_${contact.id}`]
    };
  });

  const conversations = viewMode === "family"
    ? fallbackContacts.filter((conversation) => conversation.id === robertAdamsConversationId)
    : fallbackContacts;

  return conversations.map((conversation) => formatContactFromConversation(conversation, viewMode));
}

function getFallbackMessages(conversationId) {
  const fallbackMessages = messagesData.conversations[conversationId] ?? [];

  return fallbackMessages
    .filter((message) => message.type === "message")
    .map((message, index) => {
      const isFromFamily = message.direction === "incoming";
      const createdAt = new Date(Date.now() - (fallbackMessages.length - index) * 4 * 60 * 1000);

      return {
        id: message.id,
        senderId: isFromFamily ? familyUser.uid : staffUser.uid,
        senderName: isFromFamily ? familyUser.name : staffUser.name,
        senderRole: isFromFamily ? familyUser.role : staffUser.role,
        text: message.text,
        createdAt
      };
    });
}

function formatMessageTimestamp(value) {
  if (!value) {
    return "Sending...";
  }

  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timeLabel = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });

  if (isSameDay(date, new Date())) {
    return timeLabel;
  }

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} · ${timeLabel}`;
}

function isSameDay(leftDate, rightDate) {
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
}

function getMessageDateLabel(value) {
  if (!value) {
    return "Just now";
  }

  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) {
    return "Today";
  }

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getThreadItems(messages) {
  const items = [];
  let previousLabel = "";

  messages.forEach((message) => {
    const label = getMessageDateLabel(message.createdAt);

    if (label !== previousLabel) {
      items.push({
        id: `divider-${message.id}`,
        type: "divider",
        label
      });
      previousLabel = label;
    }

    items.push(message);
  });

  return items;
}

function resetContactUnreadCount(contacts, conversationId) {
  return contacts.map((contact) =>
    contact.id === conversationId ? { ...contact, unreadCount: 0 } : contact
  );
}

function ContactRow({ contact, isActive, onClick }) {
  const unreadLabel = `${contact.unreadCount} unread messages`;

  return (
    <li className={`contact-row-item${isActive ? " is-active" : ""}`}>
      <button
        className="contact-row"
        type="button"
        onClick={() => onClick(contact)}
        aria-label={`Open conversation with ${contact.name}`}
        aria-pressed={isActive}
      >
        {contact.unreadCount > 0 ? <span className="contact-unread-dot" aria-hidden="true" /> : null}
        <div className="contact-avatar">
          {contact.image ? (
            <img src={contact.image} alt={contact.name} />
          ) : (
            <span className="contact-avatar-initials">{getInitials(contact.name)}</span>
          )}
          {contact.unreadCount > 0 ? (
            <span className="unread-badge unread-badge--inline" aria-label={unreadLabel}>
              {contact.unreadCount}
            </span>
          ) : null}
        </div>
        <div className="contact-info">
          <p className="contact-name">{contact.name}</p>
          <p className="contact-relation">
            <span>{contact.relation}</span>
            {contact.room ? <strong>{contact.room}</strong> : null}
          </p>
          <p className="contact-preview">{contact.lastMessage}</p>
        </div>
        <span className="contact-time">{contact.timestamp}</span>
      </button>
    </li>
  );
}

function ChatBubble({ message, currentUser }) {
  const isOutgoing = message.senderId === currentUser.uid;
  return (
    <div className={`chat-bubble-wrapper${isOutgoing ? " is-outgoing" : " is-incoming"}`}>
      <div className={`chat-bubble${isOutgoing ? " bubble--outgoing" : " bubble--incoming"}`}>
        {message.text}
      </div>
      <p className="chat-bubble-time">
        {formatMessageTimestamp(message.createdAt)}
        {isOutgoing ? <CheckDoubleIcon className="message-read-check" /> : null}
      </p>
    </div>
  );
}

function ChatDateDivider({ label }) {
  return (
    <div className="chat-date-divider" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

function ResidentContextStrip({ contact, latestDailyLog }) {
  const dailyLog = latestDailyLog ?? getDailyLogEntryByResidentId(contact.residentId);
  const updatedAt = dailyLog?.createdAt ?? dailyLog?.date ?? dailyLog?.updatedAt;
  const updateTime = updatedAt ? formatTimestamp(updatedAt, "") : "";
  const mood = dailyLog?.mood ?? dailyLog?.status;
  const mealSummary = dailyLog?.meals ?? dailyLog?.summary;
  const mealLabel = formatCareLabel(mealSummary);
  const isConfirmedAteWell = String(dailyLog?.meals || "").trim().toLowerCase() === "ate well";

  return (
    <div className="resident-context-strip" aria-label={`${contact.residentName} care context`}>
      <p className="resident-context-copy">
        <strong>{contact.residentName}</strong>
        {updateTime ? <span>Updated {updateTime}</span> : <span>No Daily Update Yet Today</span>}
        {mood ? <span>Mood: <b>{formatCareLabel(mood)}</b></span> : null}
        {mealLabel ? (
          <span className={isConfirmedAteWell ? "resident-context-meals is-confirmed" : "resident-context-meals"}>
            {mealLabel}
            {isConfirmedAteWell ? <CheckMarkIcon className="resident-context-check" /> : null}
          </span>
        ) : null}
      </p>
    </div>
  );
}


export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const viewMode = location.pathname.startsWith("/family") ? "family" : "staff";
  const currentUser = viewMode === "family" ? familyUser : staffUser;
  const Shell = viewMode === "family" ? FamilyAppShell : StaffAppShell;

  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(Boolean(db));
  const [latestDailyLog, setLatestDailyLog] = useState(null);
  const chatThreadRef = useRef(null);

  useEffect(() => {
    if (!db) {
      const fallbackContacts = getFallbackConversations(viewMode);

      setContacts(fallbackContacts);
      setActiveContact((currentContact) =>
        fallbackContacts.find((contact) => contact.id === currentContact?.id) ?? fallbackContacts[0] ?? null
      );
      setStatusMessage("Firebase is not configured. Add your Vite Firebase env variables to use real-time messaging.");
      setIsLoadingConversations(false);
      return undefined;
    }

    setIsLoadingConversations(true);

    return listenToConversations(
      db,
      (nextConversations) => {
        const allContacts = nextConversations.map((conversation) =>
          formatContactFromConversation(conversation, viewMode)
        );
        const nextContacts =
          viewMode === "family"
            ? allContacts.filter((contact) =>
                contact.conversation.participantIds?.includes(currentUser.uid)
              )
            : allContacts;
        const hasRobertAdamsConversation = nextContacts.some(
          (contact) => contact.id === robertAdamsConversationId
        );
        setContacts(nextContacts);
        setIsLoadingConversations(false);
        setStatusMessage(() => {
          if (!nextContacts.length) {
            return viewMode === "family"
              ? "Robert Adams' conversation with Sarah about Beth Adams was not found. Run npm run seed:messages to load the demo conversation."
              : "No Firestore conversations found. Run npm run seed:messages to load demo conversations.";
          }

          if (viewMode === "family" && !hasRobertAdamsConversation) {
            return "Robert Adams' conversation with Sarah about Beth Adams was not found.";
          }

          return "";
        });
        setActiveContact((currentContact) => {
          if (!nextContacts.length) {
            return null;
          }

          if (viewMode === "family") {
            return (
              nextContacts.find((contact) => contact.id === robertAdamsConversationId) ??
              nextContacts.find((contact) => contact.id === currentContact?.id) ??
              nextContacts[0]
            );
          }

          return nextContacts.find((contact) => contact.id === currentContact?.id) ?? nextContacts[0];
        });
      },
      () => {
        setIsLoadingConversations(false);
        setStatusMessage("Could not load Firestore conversations. Check your Firebase config and Firestore rules.");
      }
    );
  }, [currentUser.uid, viewMode]);

  useEffect(() => {
    if (!activeContact?.id) {
      setActiveMessages([]);
      return undefined;
    }

    if (!db) {
      setActiveMessages(getFallbackMessages(activeContact.id));
      return undefined;
    }

    if (activeContact.unreadCount > 0) {
      setContacts((currentContacts) => resetContactUnreadCount(currentContacts, activeContact.id));
      setActiveContact((currentContact) =>
        currentContact?.id === activeContact.id
          ? { ...currentContact, unreadCount: 0 }
          : currentContact
      );
      markConversationAsRead(db, activeContact.id, currentUser).catch(() => {
        setStatusMessage("Could not update the unread status for this conversation.");
      });
    }

    return listenToMessages(
      db,
      activeContact.id,
      setActiveMessages,
      () => setStatusMessage("Could not load messages for this conversation.")
    );
  }, [activeContact?.id, activeContact?.unreadCount, currentUser]);

  useEffect(() => {
    if (!db || !activeContact?.residentId) {
      setLatestDailyLog(getDailyLogEntryByResidentId(activeContact?.residentId));
      return undefined;
    }

    return listenToDailyLogsForResident(
      db,
      activeContact.residentId,
      (dailyLogs) => setLatestDailyLog(dailyLogs[0] ?? getDailyLogEntryByResidentId(activeContact.residentId)),
      () => setLatestDailyLog(getDailyLogEntryByResidentId(activeContact.residentId))
    );
  }, [activeContact?.residentId]);

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.relation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.residentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeThreadItems = useMemo(() => getThreadItems(activeMessages), [activeMessages]);

  useEffect(() => {
    const chatThread = chatThreadRef.current;

    if (!chatThread) {
      return;
    }

    chatThread.scrollTo({
      top: chatThread.scrollHeight,
      behavior: "smooth"
    });
  }, [activeThreadItems.length]);

  function handleSelectContact(contact) {
    setContacts((currentContacts) => resetContactUnreadCount(currentContacts, contact.id));
    setActiveContact({ ...contact, unreadCount: 0 });
    setReplyText("");
  }

  async function handleSendReply() {
    if (!replyText.trim() || !activeContact) return;

    const nextReplyText = replyText;
    setReplyText("");

    try {
      await sendMessage(db, activeContact.id, currentUser, nextReplyText);
      setStatusMessage("");
    } catch {
      setReplyText(nextReplyText);
      setStatusMessage("Could not send this message. Check your Firebase connection and try again.");
    }
  }

  function handleReplyKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  }

  return (
    <Shell onStubNavigate={() => {}}>
      <div className="messages-page">
        <div className="messages-page-header">
          <div>
            <p className="eyebrow">Messages</p>
            <h1 className="page-title">
              {viewMode === "family" ? "Care Team Messages" : "Family Contacts"}
            </h1>
            {statusMessage ? (
              <p className="status-message" aria-live="polite">
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="messages-layout">
          {/* ── Sidebar ── */}
          <aside className="messages-sidebar" aria-label="Contacts list">
            <div className="sidebar-top">
              <div className="messages-search-wrapper">
                <SearchIcon className="messages-search-icon" />
                <input
                  className="messages-search-input"
                  type="search"
                  placeholder="Search conversations"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search contacts"
                />
              </div>
              <button className="compose-button" type="button" aria-label="Compose new message">
                <ComposeIcon className="compose-icon" />
              </button>
            </div>

            <ul className="contact-list">
              {filteredContacts.map((contact) => (
                <ContactRow
                  key={contact.id}
                  contact={contact}
                  isActive={activeContact?.id === contact.id}
                  onClick={handleSelectContact}
                />
              ))}
              {isLoadingConversations ? (
                <li className="contact-list-empty">Loading conversations...</li>
              ) : null}
              {!isLoadingConversations && filteredContacts.length === 0 && (
                <li className="contact-list-empty">
                  {contacts.length ? "No contacts found" : "No conversations available"}
                </li>
              )}
            </ul>
          </aside>

          {/* ── Chat Panel ── */}
          {activeContact ? (
            <section className="chat-panel" aria-label={`Conversation with ${activeContact.name}`}>
              {/* Header */}
              <div className="chat-header">
                <div className="chat-header-identity">
                  <div className="chat-header-avatar">
                    {activeContact.image ? (
                      <img src={activeContact.image} alt={activeContact.name} />
                    ) : (
                      <span className="contact-avatar-initials">{getInitials(activeContact.name)}</span>
                    )}
                    {viewMode === "family" && activeContact.unreadCount > 0 ? (
                      <span
                        className="unread-badge unread-badge--header"
                        aria-label={`${activeContact.unreadCount} unread messages from Sarah`}
                      >
                        {activeContact.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <p className="chat-header-name">{activeContact.name}</p>
                    <p className="chat-header-sub">
                      {activeContact.relation} · <strong>{activeContact.room}</strong>
                    </p>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <button
                    className="chat-action-button"
                    type="button"
                    onClick={() => navigate(getResidentProfilePath(activeContact))}
                    aria-label={`Open ${activeContact.residentName} resident profile`}
                  >
                    <UserRoundIcon className="chat-action-icon" />
                    <span>Resident Profile</span>
                  </button>
                </div>
              </div>

              <ResidentContextStrip contact={activeContact} latestDailyLog={latestDailyLog} />

              {/* Message thread */}
              <div className="chat-thread" role="log" aria-live="polite" ref={chatThreadRef}>
                {activeThreadItems.length ? activeThreadItems.map((item) =>
                  item.type === "divider" ? (
                    <ChatDateDivider key={item.id} label={item.label} />
                  ) : (
                    <ChatBubble key={item.id} message={item} currentUser={currentUser} />
                  )
                ) : (
                  <div className="chat-thread-empty">
                    <p>No messages yet.</p>
                    <span>Start the conversation with a care update or question.</span>
                  </div>
                )}
              </div>

              {/* Reply bar */}
              <div className="chat-composer">
                <p className="chat-privacy-note">Messages are visible to authorized staff and family only.</p>
                <div className="chat-reply-bar">
                  <button className="reply-attach-button" type="button" aria-label="Attach file">
                    <AttachIcon className="attach-icon" />
                  </button>
                  <input
                    className="reply-input"
                    type="text"
                    placeholder="Write a message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleReplyKeyDown}
                    aria-label={`Reply to ${activeContact.name}`}
                    disabled={!db}
                  />
                  <button
                    className={`reply-send-button${replyText.trim() ? " is-active" : ""}`}
                    type="button"
                    onClick={handleSendReply}
                    aria-label="Send reply"
                    disabled={!db || !replyText.trim()}
                  >
                    <SendIcon className="send-icon" />
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="chat-panel chat-panel--empty">
              <p>Select a contact to start messaging.</p>
            </section>
          )}
        </div>
      </div>
    </Shell>
  );
}
