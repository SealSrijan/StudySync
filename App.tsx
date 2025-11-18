import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { app, auth, db } from './firebase';
import type { Theme, StudyEntry, Reminder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import EntryForm from './components/EntryForm';
import Diary from './components/DiaryUI';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import FirebaseConfigWarning from './components/FirebaseConfigWarning';
import ReminderModal from './components/ReminderModal';

const App: React.FC = () => {
  // Check for placeholder credentials before initializing Firebase
  if (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    return <FirebaseConfigWarning />;
  }

  // Use shared Firebase services from `firebase.ts`

  const [theme, setTheme] = useLocalStorage<Theme>('studysync_theme', 'light');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<StudyEntry[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setReminders([]);
      return;
    }

    const entriesQuery = query(collection(db, "entries"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
    const entriesUnsubscribe = onSnapshot(entriesQuery, (snapshot) => {
      const userEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyEntry));
      setEntries(userEntries);
    });

    const remindersQuery = query(collection(db, "reminders"), where("uid", "==", user.uid), orderBy("date", "asc"));
    const remindersUnsubscribe = onSnapshot(remindersQuery, (snapshot) => {
      const userReminders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reminder));
      setReminders(userReminders);
    });
    
    return () => {
      entriesUnsubscribe();
      remindersUnsubscribe();
    };
  }, [user, db]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);
  
  const addEntry = useCallback(async (entry: Omit<StudyEntry, 'id' | 'createdAt' | 'uid'>) => {
    if (!user) return;
    const newEntry = {
      ...entry,
      uid: user.uid,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "entries"), newEntry);
  }, [user, db]);
  
  const deleteEntry = useCallback(async (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      await deleteDoc(doc(db, "entries", id));
    }
  }, [db]);

  const addReminder = useCallback(async (reminder: { title: string; date: string }) => {
    if (!user) return;
    const { title, date } = reminder;

    if (!title.trim() || !date) {
      alert("Title and date are required.");
      return;
    }
    
    const newReminder = { title, date, uid: user.uid };
    await addDoc(collection(db, "reminders"), newReminder);
    setIsReminderModalOpen(false);
  }, [user, db]);

  const deleteReminder = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "reminders", id));
  }, [db]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

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

  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    const studyDates = new Set(entries.map(e => e.date));
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().slice(0, 10);
      if (studyDates.has(dateString)) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  }, [entries]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-xl font-handwriting text-pink-500">Loading your diary...</p>
      </div>
    );
  }

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
                <Diary entries={entries} onDeleteEntry={deleteEntry} />
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
        StudySync Diary - Track your path to success.
      </footer>
    </div>
  );
};

export default App;