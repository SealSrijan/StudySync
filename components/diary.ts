import { db, auth } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import type { StudyEntry } from "../types";

// Add entry
export const addDiaryEntry = async (entry: Omit<StudyEntry, "id" | "createdAt">) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  await addDoc(collection(db, "users", uid, "diaryEntries"), {
    ...entry,
    createdAt: new Date().toISOString(),
  });
};

// Listen to entries
export const listenDiaryEntries = (
  callback: (entries: StudyEntry[]) => void
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const q = query(
    collection(db, "users", uid, "diaryEntries"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const entries: StudyEntry[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<StudyEntry, "id">),
    }));
    callback(entries);
  });
};

// Delete
export const deleteDiaryEntry = async (id: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await deleteDoc(doc(db, "users", uid, "diaryEntries", id));
};

// Edit
export const editDiaryEntry = async (
  id: string,
  updatedData: Partial<StudyEntry>
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await updateDoc(doc(db, "users", uid, "diaryEntries", id), updatedData);
};