import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

function mapDocument(snapshot) {
  return {
    id: snapshot.id,
    ...snapshot.data()
  };
}

export function listenToConversations(db, onNext, onError) {
  if (!db) {
    onError?.(new Error("Firebase is not configured."));
    return () => {};
  }

  const conversationsQuery = query(
    collection(db, "conversations"),
    orderBy("lastMessageAt", "desc")
  );

  return onSnapshot(
    conversationsQuery,
    (snapshot) => onNext(snapshot.docs.map(mapDocument)),
    onError
  );
}

export function listenToMessages(db, conversationId, onNext, onError) {
  if (!db || !conversationId) {
    onNext([]);
    return () => {};
  }

  const messagesQuery = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => onNext(snapshot.docs.map(mapDocument)),
    onError
  );
}

export async function sendMessage(db, conversationId, currentUser, text) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const trimmedText = text.trim();

  if (!conversationId || !trimmedText) {
    return;
  }

  const message = {
    senderId: currentUser.uid,
    senderName: currentUser.name,
    senderRole: currentUser.role,
    text: trimmedText,
    createdAt: serverTimestamp()
  };

  await addDoc(collection(db, "conversations", conversationId, "messages"), message);

  const unreadField =
    currentUser.role === "staff" ? "unreadCountFamily" : "unreadCountStaff";

  await updateDoc(doc(db, "conversations", conversationId), {
    lastMessage: trimmedText,
    lastMessageAt: serverTimestamp(),
    [unreadField]: increment(1)
  });
}

export async function markConversationAsRead(db, conversationId, currentUser) {
  if (!db || !conversationId) {
    return;
  }

  const unreadField =
    currentUser.role === "staff" ? "unreadCountStaff" : "unreadCountFamily";

  await updateDoc(doc(db, "conversations", conversationId), {
    [unreadField]: 0
  });
}
