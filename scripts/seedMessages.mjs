import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getFirestore,
  Timestamp,
  writeBatch
} from "firebase/firestore";

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split("\n");

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    process.env[key] = process.env[key] ?? value;
  });
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

if (!Object.values(firebaseConfig).every(Boolean)) {
  console.error("Missing Firebase env variables. Add your VITE_FIREBASE_* values to .env.local.");
  process.exit(1);
}

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const staffUser = {
  uid: "staff_1",
  name: "Sarah",
  role: "staff"
};

function message(sender, text, createdAt) {
  return {
    senderId: sender.uid,
    senderName: sender.name,
    senderRole: sender.role,
    text,
    createdAt: Timestamp.fromDate(new Date(createdAt))
  };
}

const conversations = [
  {
    id: "contact-robert-adams",
    residentId: "beth-adams",
    residentName: "Beth Adams",
    residentRoom: "Room 123",
    familyName: "Robert Adams",
    familyRelationship: "Son",
    familyUser: { uid: "family_robert_adams", name: "Robert Adams", role: "family" },
    unreadCountStaff: 0,
    unreadCountFamily: 1,
    messages: [
      message(staffUser, "Beth just won her bingo game.", "2026-02-14T17:07:00"),
      message(staffUser, "She was really happy afterward.", "2026-02-14T17:08:00"),
      message({ uid: "family_robert_adams", name: "Robert Adams", role: "family" }, "That is great to hear.", "2026-02-14T17:12:00"),
      message({ uid: "family_robert_adams", name: "Robert Adams", role: "family" }, "Hi, how is my mom doing this morning?", "2026-02-15T08:23:00"),
      message(staffUser, "She is doing well and finished breakfast.", "2026-02-15T08:31:00")
    ]
  },
  {
    id: "contact-maria-mendoza",
    residentId: "lilian-mendoza",
    residentName: "Lilian Mendoza",
    residentRoom: "Room 252",
    familyName: "Maria Mendoza",
    familyRelationship: "Daughter",
    familyUser: { uid: "family_maria_mendoza", name: "Maria Mendoza", role: "family" },
    unreadCountStaff: 2,
    unreadCountFamily: 0,
    messages: [
      message({ uid: "family_maria_mendoza", name: "Maria Mendoza", role: "family" }, "Good morning, how was Lilian overnight?", "2026-02-15T08:55:00"),
      message(staffUser, "She slept steadily and had chamomile tea before bed.", "2026-02-15T09:02:00"),
      message({ uid: "family_maria_mendoza", name: "Maria Mendoza", role: "family" }, "Thank you. Did she seem anxious today?", "2026-02-15T09:05:00")
    ]
  },
  {
    id: "contact-david-doyle",
    residentId: "clarence-doyle",
    residentName: "Clarence Doyle",
    residentRoom: "Room 222",
    familyName: "David Doyle",
    familyRelationship: "Son",
    familyUser: { uid: "family_david_doyle", name: "David Doyle", role: "family" },
    unreadCountStaff: 0,
    unreadCountFamily: 0,
    messages: [
      message({ uid: "family_david_doyle", name: "David Doyle", role: "family" }, "Hello Sarah, how was Clarence's morning?", "2026-02-15T08:00:00"),
      message(staffUser, "He did well after a short warm-up walk.", "2026-02-15T08:18:00"),
      message(staffUser, "He also enjoyed jazz after breakfast.", "2026-02-15T08:21:00"),
      message({ uid: "family_david_doyle", name: "David Doyle", role: "family" }, "That sounds like him. Thank you.", "2026-02-15T08:28:00")
    ]
  },
  {
    id: "contact-lillian-bennett",
    residentId: "harold-bennett",
    residentName: "Harold Bennett",
    residentRoom: "Room 127",
    familyName: "Lillian Bennett",
    familyRelationship: "Daughter",
    familyUser: { uid: "family_lillian_bennett", name: "Lillian Bennett", role: "family" },
    unreadCountStaff: 0,
    unreadCountFamily: 0,
    messages: [
      message(staffUser, "Harold had a good physical therapy session today.", "2026-02-14T15:15:00"),
      message({ uid: "family_lillian_bennett", name: "Lillian Bennett", role: "family" }, "Thanks for the update.", "2026-02-14T15:22:00"),
      message(staffUser, "We also made sure his reading materials had high contrast.", "2026-02-14T15:30:00")
    ]
  }
];

const batch = writeBatch(db);

conversations.forEach((conversation) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const participantIds = [staffUser.uid, conversation.familyUser.uid];
  const conversationRef = doc(db, "conversations", conversation.id);

  batch.set(conversationRef, {
    residentId: conversation.residentId,
    residentName: conversation.residentName,
    residentRoom: conversation.residentRoom,
    familyName: conversation.familyName,
    familyRelationship: conversation.familyRelationship,
    participantIds,
    lastMessage: lastMessage.text,
    lastMessageAt: lastMessage.createdAt,
    unreadCountStaff: conversation.unreadCountStaff,
    unreadCountFamily: conversation.unreadCountFamily
  });

  conversation.messages.forEach((conversationMessage, index) => {
    const messageRef = doc(collection(conversationRef, "messages"), `message-${index + 1}`);
    batch.set(messageRef, conversationMessage);
  });
});

await batch.commit();

console.log(`Seeded ${conversations.length} message conversations.`);
