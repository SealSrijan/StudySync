import React, { useState, useEffect } from "react";
import DiaryUI from "./DiaryUI"; // make sure path is correct
import EntryForm from "./EntryForm";
import { listenDiaryEntries, deleteDiaryEntry, addDiaryEntry } from "./diary";
import type { StudyEntry } from "../types";

const Diary: React.FC = () => {
  // State for diary entries
  const [entries, setEntries] = useState<StudyEntry[]>([]);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = listenDiaryEntries((newEntries: StudyEntry[]) => {
      setEntries(newEntries);
    });

    // Cleanup subscription
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle deleting an entry
  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDiaryEntry(id);
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  // Handle adding an entry
  const handleAddEntry = async (
    entry: Omit<StudyEntry, "id" | "createdAt" | "uid">
  ) => {
    try {
      await addDiaryEntry(entry);
    } catch (err) {
      console.error("Failed to add entry:", err);
    }
  };

  const calculateStreak = (entries: StudyEntry[]) => {
    const dateSet = new Set(entries.map((e) => e.date));
    let streak = 0;
    const today = new Date();
    const cur = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    while (true) {
      const iso = cur.toISOString().slice(0, 10);
      if (dateSet.has(iso)) {
        streak++;
        cur.setDate(cur.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak(entries);

  // Explicit return with parentheses to avoid JSX parsing issues
  return (
    <>
      <EntryForm onAddEntry={handleAddEntry} streak={streak} />
      <DiaryUI entries={entries} onDeleteEntry={handleDeleteEntry} />
    </>
  );
};

export default Diary;
