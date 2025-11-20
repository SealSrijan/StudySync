import React, { useState, useEffect } from "react";
import DiaryUI from "./DiaryUI"; 
import { listenDiaryEntries, deleteDiaryEntry } from "./diary";
import type { StudyEntry } from "../types";

const Diary: React.FC = () => {
  const [entries, setEntries] = useState<StudyEntry[]>([]);

  useEffect(() => {
    const unsubscribe = listenDiaryEntries((newEntries: StudyEntry[]) => {
      setEntries(newEntries);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDiaryEntry(id);
    } catch (err) {
      console.error("Failed to delete entry:", err);
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

  return (
    <>
      {/* Removed the duplicate EntryForm */}
      <DiaryUI entries={entries} onDeleteEntry={handleDeleteEntry} />
    </>
  );
};

export default Diary;
