import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";

const visitRequestsCollectionName = "visitRequests";

function mapVisitRequestDocument(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

function getTimestampMillis(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function sortVisitRequestsByCreatedAt(requests) {
  return [...requests].sort((firstRequest, secondRequest) => {
    const createdAtDifference =
      getTimestampMillis(secondRequest.createdAt) - getTimestampMillis(firstRequest.createdAt);

    if (createdAtDifference) {
      return createdAtDifference;
    }

    return `${secondRequest.requestedDate} ${secondRequest.requestedTime}`.localeCompare(
      `${firstRequest.requestedDate} ${firstRequest.requestedTime}`
    );
  });
}

export async function createVisitRequest(db, request) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const trimmedNotes = request.notes.trim();

  await addDoc(collection(db, visitRequestsCollectionName), {
    residentId: request.residentId,
    residentName: request.residentName,
    residentRoom: request.residentRoom,
    familyUserId: request.familyUserId,
    familyName: request.familyName,
    visitorName: request.visitorName,
    requestedDate: request.requestedDate,
    requestedTime: request.requestedTime,
    visitType: request.visitType ?? "in-person",
    notes: trimmedNotes,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reviewedBy: ""
  });
}

export async function cancelVisitRequest(db, requestId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, visitRequestsCollectionName, requestId));
}

export function listenToFamilyVisitRequests(db, familyUserId, onNext, onError) {
  if (!db || !familyUserId) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const visitRequestsQuery = query(
    collection(db, visitRequestsCollectionName),
    where("familyUserId", "==", familyUserId)
  );

  return onSnapshot(
    visitRequestsQuery,
    (snapshot) => onNext(sortVisitRequestsByCreatedAt(snapshot.docs.map(mapVisitRequestDocument))),
    onError
  );
}

export function listenToPendingVisitRequests(db, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const visitRequestsQuery = query(
    collection(db, visitRequestsCollectionName),
    where("status", "==", "pending")
  );

  return onSnapshot(
    visitRequestsQuery,
    (snapshot) => onNext(sortVisitRequestsByCreatedAt(snapshot.docs.map(mapVisitRequestDocument))),
    onError
  );
}

export function listenToApprovedVisitRequestsForDate(db, requestedDate, onNext, onError) {
  if (!db || !requestedDate) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const visitRequestsQuery = query(
    collection(db, visitRequestsCollectionName),
    where("requestedDate", "==", requestedDate)
  );

  return onSnapshot(
    visitRequestsQuery,
    (snapshot) => {
      const approvedRequests = snapshot.docs
        .map(mapVisitRequestDocument)
        .filter((request) => request.status === "approved");

      onNext(sortVisitRequestsByRequestedTime(approvedRequests));
    },
    onError
  );
}

export function listenToApprovedVisitRequests(db, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const visitRequestsQuery = query(
    collection(db, visitRequestsCollectionName),
    where("status", "==", "approved")
  );

  return onSnapshot(
    visitRequestsQuery,
    (snapshot) => onNext(sortVisitRequestsByCreatedAt(snapshot.docs.map(mapVisitRequestDocument))),
    onError
  );
}

function sortVisitRequestsByRequestedTime(requests) {
  return [...requests].sort((firstRequest, secondRequest) =>
    `${firstRequest.requestedTime || ""}`.localeCompare(`${secondRequest.requestedTime || ""}`)
  );
}

export async function updateVisitRequestStatus(db, requestId, status, reviewedBy) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await updateDoc(doc(db, visitRequestsCollectionName, requestId), {
    status,
    reviewedBy,
    updatedAt: serverTimestamp()
  });
}
