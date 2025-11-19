import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from "firebase/firestore";
import type { StudyEntry } from "../types";

export const addDiaryEntry = async (entry: Omit<StudyEntry, "id" | "createdAt">) => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn("User not logged in, cannot add entry");
    return;
  }

  await addDoc(collection(db, "users", uid, "diaryEntries"), {
    ...entry,
    createdAt: new Date().toISOString()
  });
};

export const listenDiaryEntries = (
  callback: (entries: StudyEntry[]) => void
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn("User not logged in, cannot listen");
    return () => {};
  }

  const q = query(
    collection(db, "users", uid, "diaryEntries"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, snapshot => {
    const entries: StudyEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    }));
    callback(entries);
  });
};

export const deleteDiaryEntry = async (id: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  await deleteDoc(doc(db, "users", uid, "diaryEntries", id));
};
