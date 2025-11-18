import React, { useState, useEffect } from "react";
import DiaryUI from "./DiaryUI"; // make sure path is correct
import { listenDiaryEntries, deleteDiaryEntry } from "./diary";
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

  // Explicit return with parentheses to avoid JSX parsing issues
  return (
    <DiaryUI entries={entries} onDeleteEntry={handleDeleteEntry} />
  );
};

export default Diary;
