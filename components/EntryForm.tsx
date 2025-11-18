import React, { useState } from 'react';
import type { StudyEntry } from '../types';
import { SUBJECTS, TIME_SLOTS } from '../constants';
import { FlameIcon } from './Icons';

interface EntryFormProps {
  onAddEntry: (entry: Omit<StudyEntry, 'id' | 'createdAt' | 'uid'>) => void;
  streak: number;
}

const EntryForm: React.FC<EntryFormProps> = ({ onAddEntry, streak }) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEntry: Omit<StudyEntry, 'id' | 'createdAt' | 'uid'> = {
      date: formData.get('date') as string,
      subject: formData.get('subject') as string,
      timeSlot: formData.get('timeSlot') as string,
      chapter: formData.get('chapter') as string,
      details: formData.get('details') as string,
      hours: Number(formData.get('hours')),
    };

    if (!newEntry.subject || !newEntry.timeSlot) {
      alert("Please select a subject and time slot.");
      return;
    }
    
    onAddEntry(newEntry);
    e.currentTarget.reset();
    setDate(new Date().toISOString().slice(0, 10)); // Reset date to today after submit
  };
  
  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-pink-700 dark:text-pink-300">Add Today's Study Session</h2>
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400 px-3 py-1 rounded-full">
          <FlameIcon className="w-4 h-4" />
          <span>{streak} Day Streak</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
            <input type="date" id="date" name="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"/>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
            <select id="subject" name="subject" required className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500">
              <option value="">Select Subject</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Time Slot</label>
            <select id="timeSlot" name="timeSlot" required className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500">
              <option value="">Choose Time Slot</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
           <div>
            <label htmlFor="hours" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Hours Studied</label>
            <input type="number" id="hours" name="hours" placeholder="e.g., 2.5" step="0.5" min="0" required className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500" />
          </div>
        </div>
        <div>
          <label htmlFor="chapter" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Chapter / Topic</label>
          <input type="text" id="chapter" name="chapter" placeholder="Ex: Electrostatics – Gauss Law" required className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500" />
        </div>
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Details & Notes</label>
          <textarea id="details" name="details" rows={3} placeholder="Write what you studied, key concepts, or questions you have..." className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"></textarea>
        </div>
        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl font-semibold shadow-md transition-transform hover:scale-[1.02]">
          Add to Diary
        </button>
      </form>
    </section>
  );
};

export default EntryForm;