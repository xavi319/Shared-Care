import { collection, doc, onSnapshot, query, serverTimestamp, setDoc, where } from "firebase/firestore";

import { familyData, residentsPageData } from "../data/mockData";

const residentsCollectionName = "residents";
const familyFallbackUserId = "family_robert_adams";

const residentSlugsById = {
  beth_123: "beth-adams",
  clarence_222: "clarence-doyle",
  edgar_124: "edgar-callahan",
  franklin_225: "franklin-dempsey",
  harold_127: "harold-bennett",
  june_532: "june-sinclair",
  lilian_252: "lilian-mendoza"
};

const fallbackResidentsBySlug = new Map(
  residentsPageData.residents.map((resident) => [resident.slug ?? resident.detailPath.split("/").pop(), resident])
);
const residentIdsBySlug = Object.fromEntries(
  Object.entries(residentSlugsById).map(([residentId, slug]) => [slug, residentId])
);

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getResidentSlug(residentId, fullName) {
  return residentSlugsById[residentId] ?? slugify(fullName || residentId);
}

function getFallbackResidentMeta(residentId, fullName) {
  const slug = getResidentSlug(residentId, fullName);
  return fallbackResidentsBySlug.get(slug) ?? {};
}

export function mapFirestoreResident(data, documentId) {
  const residentId = data.residentId ?? documentId;
  const fullName = data.fullName ?? data.name ?? "";
  const slug = getResidentSlug(residentId, fullName);
  const fallbackMeta = getFallbackResidentMeta(residentId, fullName);

  return {
    id: residentId,
    residentId,
    fullName,
    name: fullName,
    room: data.room ?? "",
    profilePhoto: data.profilePhoto ?? "",
    image: data.profilePhoto ?? fallbackMeta.image ?? "",
    status: data.status ?? "active",
    primaryFamilyUserId: data.primaryFamilyUserId ?? "",
    primaryFamilyName: data.primaryFamilyName ?? "",
    primaryFamilyRelationship: data.primaryFamilyRelationship ?? "",
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    slug,
    detailPath: `/residents/${slug}`,
    lastUpdate: fallbackMeta.lastUpdate ?? "Not updated yet",
    lastUpdateLabel: fallbackMeta.lastUpdateLabel ?? "Daily Log last updated",
    accent: fallbackMeta.accent ?? "#aaccee"
  };
}

function mapResidentDocument(snapshot) {
  return mapFirestoreResident(snapshot.data(), snapshot.id);
}

function sortResidentsByName(residents) {
  return [...residents].sort((firstResident, secondResident) =>
    firstResident.name.localeCompare(secondResident.name)
  );
}

export function getFallbackResidents() {
  return residentsPageData.residents.map((resident) => {
    const slug = resident.slug ?? resident.detailPath.split("/").pop();
    const residentId = residentIdsBySlug[slug] ?? resident.id;

    return {
      ...resident,
      id: residentId,
      residentId,
      fullName: resident.name,
      profilePhoto: resident.image ?? "",
      primaryFamilyUserId: resident.name === familyData.resident.name ? familyFallbackUserId : "",
      primaryFamilyName: resident.name === familyData.resident.name ? familyData.visitor.name : "",
      primaryFamilyRelationship: resident.name === familyData.resident.name ? "Son" : ""
    };
  });
}

export async function saveResident(db, resident) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await setDoc(
    doc(db, residentsCollectionName, resident.residentId),
    {
      residentId: resident.residentId,
      fullName: resident.name,
      room: resident.room,
      profilePhoto: resident.image ?? "",
      admissionDate: resident.admissionDate ?? "",
      primaryFamilyUserId: "",
      primaryFamilyName: "",
      primaryFamilyRelationship: "",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export function getFallbackFamilyResident(familyUserId = familyFallbackUserId) {
  const fallbackResident =
    getFallbackResidents().find((resident) => resident.primaryFamilyUserId === familyUserId) ??
    getFallbackResidents()[0];

  return {
    ...familyData.resident,
    id: fallbackResident.residentId ?? familyData.resident.id,
    residentId: fallbackResident.residentId ?? familyData.resident.id,
    name: fallbackResident.name,
    fullName: fallbackResident.name,
    room: fallbackResident.room,
    image: fallbackResident.image ?? familyData.resident.image,
    profilePhoto: fallbackResident.profilePhoto ?? familyData.resident.image
  };
}

export function toFamilyResident(resident) {
  return {
    ...familyData.resident,
    id: resident.residentId,
    residentId: resident.residentId,
    name: resident.name,
    fullName: resident.name,
    room: resident.room,
    image: resident.image,
    profilePhoto: resident.profilePhoto,
    status: familyData.resident.status,
    lastUpdated: familyData.resident.lastUpdated
  };
}

export function listenToResidents(db, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  return onSnapshot(
    collection(db, residentsCollectionName),
    (snapshot) => {
      onNext(sortResidentsByName(snapshot.docs.map(mapResidentDocument)));
    },
    onError
  );
}

export function listenToResidentsForFamily(db, familyUserId, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const residentsQuery = query(
    collection(db, residentsCollectionName),
    where("primaryFamilyUserId", "==", familyUserId)
  );

  return onSnapshot(
    residentsQuery,
    (snapshot) => {
      onNext(sortResidentsByName(snapshot.docs.map(mapResidentDocument)));
    },
    onError
  );
}
