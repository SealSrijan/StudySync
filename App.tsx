import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import type { Theme, StudyEntry, Reminder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import EntryForm from './components/EntryForm';
import Diary from './components/Diary';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import ReminderModal from './components/ReminderModal';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('studysync_theme', 'light');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  // SIGN OUT
  const handleSignOut = async () => {
    await signOut(auth);
  };

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // DIARY + REMINDERS LISTENERS
  useEffect(() => {
    if (!user) {
      setEntries([]);
      setReminders([]);
      return;
    }

    // ---- DIARY LISTENER ----
    const entriesQuery = query(
      collection(db, "users", user.uid, "diaryEntries"),
      orderBy("createdAt", "desc")
    );

    const entriesUnsub = onSnapshot(entriesQuery, (snapshot) => {
      const userEntries = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
      }) as StudyEntry);
      setEntries(userEntries);
    });

    // ---- REMINDERS LISTENER ----
    const remindersQuery = query(
      collection(db, "users", user.uid, "reminders"),
      orderBy("date", "asc")
    );

    const remindersUnsub = onSnapshot(remindersQuery, (snapshot) => {
      const userReminders = snapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as any)
      }) as Reminder);
      setReminders(userReminders);
    });

    return () => {
      entriesUnsub();
      remindersUnsub();
    };
  }, [user]);

  // THEME HANDLING
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  // ---- ADD DIARY ENTRY ----
  const addEntry = useCallback(async (entry: Omit<StudyEntry, 'id' | 'createdAt' | 'uid'>) => {
    if (!user) return;
    const newEntry = {
      ...entry,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "users", user.uid, "diaryEntries"), newEntry);
  }, [user]);

  // ---- DELETE DIARY ENTRY ----
  const deleteEntry = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "diaryEntries", id));
  }, [user]);

  // ---- ADD REMINDER ----
  const addReminder = useCallback(async (reminder: { title: string; date: string }) => {
    if (!user) return;

    const { title, date } = reminder;

    if (!title.trim() || !date) {
      alert("Title and date are required.");
      return;
    }

    const newReminder = {
      title,
      date,
      uid: user.uid,
    };

    await addDoc(
      collection(db, "users", user.uid, "reminders"),
      newReminder
    );

    setIsReminderModalOpen(false);
  }, [user]);

  // ---- DELETE REMINDER ----
  const deleteReminder = useCallback(async (id: string) => {
    if (!user) return;

    await deleteDoc(
      doc(db, "users", user.uid, "reminders", id)
    );
  }, [user]);

  // ---- WEEKLY SUMMARY ----
  const weeklySummary = useMemo(() => {
    const summary: { [subject: string]: number } = {};
    let totalHours = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    entries.forEach(entry => {
      if (new Date(entry.date) >= sevenDaysAgo) {
        summary[entry.subject] = (summary[entry.subject] || 0) + entry.hours;
        totalHours += entry.hours;
      }
    });

    return { bySubject: summary, total: totalHours };
  }, [entries]);

  // ---- STREAK CALCULATION ----
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    const studyDates = new Set(entries.map(e => e.date));
    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dateString = day.toISOString().slice(0, 10);
      if (!studyDates.has(dateString)) break;
      currentStreak++;
    }
    return currentStreak;
  }, [entries]);

  // ---- LOADING ----
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-xl font-handwriting text-pink-500">Loading your diary...</p>
      </div>
    );
  }

  // ---- MAIN UI ----
  return (
    <div className="min-h-screen bg-pink-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onSignOut={handleSignOut} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <Auth auth={auth} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <EntryForm onAddEntry={addEntry} streak={streak} />
                <Diary />
              </div>

              <Sidebar
                summary={weeklySummary}
                reminders={reminders}
                onAddReminder={() => setIsReminderModalOpen(true)}
                onDeleteReminder={deleteReminder}
              />
            </div>

            <ReminderModal
              isOpen={isReminderModalOpen}
              onClose={() => setIsReminderModalOpen(false)}
              onAddReminder={addReminder}
            />
          </>
        )}
      </main>

      <footer className="text-center py-4 text-xs text-pink-400 dark:text-slate-500">
        StudySync Diary - Track your path to success. <strong>© SRIJAN 2025</strong>
      </footer>
    </div>
  );
};

export default App;
