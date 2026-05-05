import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from "firebase/firestore";

import {
  getCanonicalDailyLogResidentId,
  getUniqueDailyLogEntries,
  isDailyLogForResident
} from "../data/mockData";

const dailyLogsCollectionName = "dailyLogs";

function mapDailyLogDocument(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

function getDateValue(value) {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? Number.NEGATIVE_INFINITY : date.getTime();
}

export function sortDailyLogsNewestFirst(logs) {
  return [...logs].sort((firstLog, secondLog) => {
    const firstDate = firstLog.createdAt ?? firstLog.date;
    const secondDate = secondLog.createdAt ?? secondLog.date;

    return getDateValue(secondDate) - getDateValue(firstDate);
  });
}

export function getSubmittedDailyLogsForResident(logs, residentId) {
  return sortDailyLogsNewestFirst(
    getUniqueDailyLogEntries(logs)
      .filter((log) => isDailyLogForResident(log.residentId, residentId))
      .filter((log) => log.visibleToFamily !== false)
      .filter((log) => log.reportStatus === "submitted" || log.status === "completed")
  );
}

export function listenToDailyLogsForResident(db, residentId, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const canonicalResidentId = getCanonicalDailyLogResidentId(residentId);
  const residentIds =
    canonicalResidentId === residentId ? [residentId] : [canonicalResidentId, residentId];
  const dailyLogsQuery = query(
    collection(db, dailyLogsCollectionName),
    where("residentId", "in", residentIds)
  );

  return onSnapshot(
    dailyLogsQuery,
    (snapshot) => {
      onNext(getSubmittedDailyLogsForResident(snapshot.docs.map(mapDailyLogDocument), residentId));
    },
    onError
  );
}

export async function saveDailyLogToFirestore(db, dailyLog) {
  if (!db || !dailyLog?.id) {
    return;
  }

  await setDoc(
    doc(db, dailyLogsCollectionName, dailyLog.id),
    {
      ...dailyLog,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
