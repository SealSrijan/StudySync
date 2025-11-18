
import React from 'react';
import type { StudyEntry } from '../types';
import { TrashIcon } from './Icons';

interface DiaryProps {
  entries: StudyEntry[];
  onDeleteEntry: (id: string) => void;
}

const formatDateShort = (isoDate: string) => {
    // Fix: Corrected typo from toLocaleDateDateString to toLocaleDateString
    return new Date(isoDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const timeAgo = (isoTimestamp: string): string => {
  const diff = Date.now() - new Date(isoTimestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};


const Diary: React.FC<DiaryProps> = ({ entries, onDeleteEntry }) => {
  return (
    <section className="bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-slate-700">
      <div className="text-right text-pink-700 dark:text-pink-300 font-semibold text-sm mb-4 pr-2">
        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      <div
        className="relative bg-white/0 p-2 sm:p-6 rounded-lg"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 2.4rem, #e2e8f0 2.4rem, #e2e8f0 2.45rem)`,
          backgroundSize: '100% 2.5rem',
        }}
      >
        <div className="absolute left-8 top-0 bottom-0 w-px bg-pink-300 dark:bg-pink-600/70"></div>
        <div className="absolute left-9 top-0 bottom-0 w-px bg-pink-300 dark:bg-pink-600/70 opacity-60"></div>

        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-slate-400 dark:text-slate-500 font-handwriting text-2xl">Your diary is empty.</p>
                <p className="text-slate-400 dark:text-slate-500 mt-2">Add a study session above to begin!</p>
            </div>
          ) : (
            entries.map(entry => (
              <div key={entry.id} className="flex items-start gap-4 pl-8 relative group">
                  <div className="absolute left-[-0.5rem] top-2.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-pink-500"></div>
                  <div className="flex-grow">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-lg text-purple-800 dark:text-purple-300">{entry.subject}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formatDateShort(entry.date)} • {entry.timeSlot} • {entry.hours}h</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <p className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{timeAgo(entry.createdAt)}</p>
                           <button onClick={() => onDeleteEntry(entry.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                     <p className="mt-2 font-semibold text-slate-700 dark:text-slate-300">{entry.chapter}</p>
                     <p className="mt-1 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{entry.details}</p>
                  </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Diary;