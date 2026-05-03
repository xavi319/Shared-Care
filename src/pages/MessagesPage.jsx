import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FamilyAppShell } from "../components/layout/FamilyAppShell";
import { StaffAppShell } from "../components/layout/StaffAppShell";
import { db } from "../lib/firebase";
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

function PhoneIcon() {
  return (
    <svg className="chat-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2 3.5A1.5 1.5 0 013.5 2h2.382a1.5 1.5 0 011.418 1.01l.97 2.91a1.5 1.5 0 01-.34 1.56l-1.3 1.3a16.07 16.07 0 006.59 6.59l1.3-1.3a1.5 1.5 0 011.56-.34l2.91.97A1.5 1.5 0 0122 16.118V18.5A1.5 1.5 0 0120.5 20C10.335 20 2 11.665 2 3.5z"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="chat-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v12.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="chat-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8h.01M12 11v5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="messages-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M20 20l-3-3" />
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg className="compose-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="messages-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="attach-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function AttachIcon() {
  return (
    <svg className="attach-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatContactFromConversation(conversation, viewMode) {
  const isFamilyView = viewMode === "family";

  return {
    id: conversation.id,
    name: isFamilyView ? "Sarah" : conversation.familyName,
    image: isFamilyView ? sarahProfileImage : conversation.familyImage,
    relation: isFamilyView
      ? `Care team for ${conversation.residentName}`
      : `${conversation.familyRelationship} of ${conversation.residentName}`,
    room: conversation.residentRoom,
    lastMessage: conversation.lastMessage ?? "No messages yet.",
    unreadCount: isFamilyView
      ? conversation.unreadCountFamily ?? 0
      : conversation.unreadCountStaff ?? 0,
    conversation
  };
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
  const timeLabel = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  if (isSameDay(date, today)) {
    return `Today ${timeLabel}`;
  }

  if (isSameDay(date, yesterday)) {
    return `Yesterday ${timeLabel}`;
  }

  return `${date.toLocaleDateString([], { month: "short", day: "numeric" })} ${timeLabel}`;
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
        <div className="contact-avatar">
          {contact.image ? (
            <img src={contact.image} alt={contact.name} />
          ) : (
            <span className="contact-avatar-initials">{getInitials(contact.name)}</span>
          )}
          {contact.unreadCount > 0 ? (
            <span className="unread-badge" aria-label={unreadLabel}>
              {contact.unreadCount}
            </span>
          ) : null}
        </div>
        <div className="contact-info">
          <p className="contact-name">{contact.name}</p>
          <p className="contact-relation">
            {contact.relation} · <strong>{contact.room}</strong>
          </p>
          <p className="contact-preview">{contact.lastMessage}</p>
        </div>
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
  const chatThreadRef = useRef(null);

  useEffect(() => {
    if (!db) {
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
    if (!db || !activeContact?.id) {
      setActiveMessages([]);
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

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.room.toLowerCase().includes(searchQuery.toLowerCase())
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
      <div className="messages-page-header">
        <div>
          <p className="eyebrow">Messages</p>
          <h1 className="page-title">
            {viewMode === "family" ? "Care Team Messages" : "Family Contacts"}
          </h1>
          <p className="status-message" aria-live="polite">
            {statusMessage}
          </p>
        </div>
        <button
          className="messages-back-button"
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <BackIcon />
        </button>
      </div>

      <div className="messages-layout">
        {/* ── Sidebar ── */}
        <aside className="messages-sidebar" aria-label="Contacts list">
          <div className="sidebar-top">
            <button className="compose-button" type="button" aria-label="Compose new message">
              <ComposeIcon />
            </button>
          </div>

          <div className="messages-search-wrapper">
            <SearchIcon />
            <input
              className="messages-search-input"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search contacts"
            />
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
                <button className="chat-action-button" type="button" aria-label="Voice call">
                  <PhoneIcon />
                </button>
                <button className="chat-action-button" type="button" aria-label="Video call">
                  <VideoIcon />
                </button>
                <button className="chat-action-button" type="button" aria-label="Contact info">
                  <InfoIcon />
                </button>
              </div>
            </div>

            {/* Message thread */}
            <div className="chat-thread" role="log" aria-live="polite" ref={chatThreadRef}>
              {activeThreadItems.map((item) =>
                item.type === "divider" ? (
                  <ChatDateDivider key={item.id} label={item.label} />
                ) : (
                  <ChatBubble key={item.id} message={item} currentUser={currentUser} />
                )
              )}
            </div>

            {/* Reply bar */}
            <div className="chat-reply-bar">
              <button className="reply-attach-button" type="button" aria-label="Attach image">
                <ImageIcon />
              </button>
              <button className="reply-attach-button" type="button" aria-label="Attach file">
                <AttachIcon />
              </button>
              <input
                className="reply-input"
                type="text"
                placeholder="Reply to ..."
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
                <SendIcon />
              </button>
            </div>
          </section>
        ) : (
          <section className="chat-panel chat-panel--empty">
            <p>Select a contact to start messaging.</p>
          </section>
        )}
      </div>
    </Shell>
  );
}
