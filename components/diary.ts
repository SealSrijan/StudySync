import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import type { StudyEntry } from "../types";

// Add entry to top-level `entries` collection (consistent with App.tsx)
export const addDiaryEntry = async (
  entry: Omit<StudyEntry, "id" | "createdAt" | "uid">
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await addDoc(collection(db, "entries"), {
    ...entry,
    uid,
    createdAt: new Date().toISOString(),
  });
};

// Listen to entries for given user (uses auth.currentUser internally)
export const listenDiaryEntries = (
  callback: (entries: StudyEntry[]) => void
) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};

  const q = query(
    collection(db, "entries"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const entries: StudyEntry[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<StudyEntry, "id">),
    }));
    callback(entries);
  });
};

// Delete
export const deleteDiaryEntry = async (id: string) => {
  await deleteDoc(doc(db, "entries", id));
};

// Edit
export const editDiaryEntry = async (
  id: string,
  updatedData: Partial<StudyEntry>
) => {
  await updateDoc(doc(db, "entries", id), updatedData);
};