import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { initializeApp } from "firebase/app";
import { doc, getFirestore, serverTimestamp, writeBatch } from "firebase/firestore";

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

const residents = [
  {
    residentId: "beth_123",
    fullName: "Beth Adams",
    room: "Room 123",
    profilePhoto: "/images/beth-adams.jpg",
    primaryFamilyUserId: "family_robert_adams",
    primaryFamilyName: "Robert Adams",
    primaryFamilyRelationship: "Son"
  },
  {
    residentId: "clarence_222",
    fullName: "Clarence Doyle",
    room: "Room 222",
    profilePhoto: "",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  },
  {
    residentId: "edgar_124",
    fullName: "Edgar Callahan",
    room: "Room 124",
    profilePhoto: "",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  },
  {
    residentId: "franklin_225",
    fullName: "Franklin Dempsey",
    room: "Room 225",
    profilePhoto: "",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  },
  {
    residentId: "harold_127",
    fullName: "Harold Bennett",
    room: "Room 127",
    profilePhoto: "/images/harold-bennet.jpg",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  },
  {
    residentId: "june_532",
    fullName: "June Sinclair",
    room: "Room 532",
    profilePhoto: "",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  },
  {
    residentId: "lilian_252",
    fullName: "Lilian Mendoza",
    room: "Room 252",
    profilePhoto: "/images/lilian-mendoza.jpg",
    primaryFamilyUserId: "",
    primaryFamilyName: "",
    primaryFamilyRelationship: ""
  }
];

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const batch = writeBatch(db);

residents.forEach((resident) => {
  batch.set(
    doc(db, "residents", resident.residentId),
    {
      ...resident,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
});

await batch.commit();

console.log(`Seeded ${residents.length} residents.`);
