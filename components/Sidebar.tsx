
import React from 'react';
import type { Reminder } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface SidebarProps {
  summary: {
    bySubject: { [key: string]: number };
    total: number;
  };
  reminders: Reminder[];
  onAddReminder: () => void;
  onDeleteReminder: (id: string) => void;
}

const formatDateShort = (isoDate: string) => {
    const d = new Date(isoDate);
    // Adjust for timezone offset to prevent date from shifting
    const userTimezoneOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() + userTimezoneOffset).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Fix: Create a dedicated props interface for WeeklySummary to ensure strong type inference.
interface WeeklySummaryProps {
  summary: {
    bySubject: Record<string, number>;
    total: number;
  };
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-pink-100 dark:border-slate-700">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-sm font-semibold text-pink-700 dark:text-pink-300">Weekly Summary</h3>
        <p className="text-xs text-pink-400 dark:text-slate-400">Last 7 days</p>
      </div>
      <div className="text-xl font-bold text-pink-600 dark:text-pink-300">{summary.total.toFixed(1)}h</div>
    </div>
    <div className="space-y-3">
      {Object.keys(summary.bySubject).length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No data for this week yet.</p>
      ) : (
        // Fix: Use Object.keys to iterate over summary.bySubject for proper type inference of `hours` as a number.
        // This resolves TypeScript errors on `.toFixed()` and arithmetic operations.
        Object.keys(summary.bySubject).map((subject) => {
          const hours = summary.bySubject[subject];
          return (
            <div key={subject} className="text-xs">
              <div className="flex justify-between font-medium">
                <span>{subject}</span>
                <span>{hours.toFixed(1)}h</span>
              </div>
              <div className="w-full bg-pink-100 dark:bg-slate-700 rounded-full h-2 mt-1">
                <div className="h-2 rounded-full bg-pink-400 dark:bg-pink-600" style={{ width: `${(hours / (summary.total || 1)) * 100}%` }} />
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

const Reminders: React.FC<{ reminders: Reminder[], onAddReminder: () => void, onDeleteReminder: (id: string) => void }> = ({ reminders, onAddReminder, onDeleteReminder }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-pink-100 dark:border-slate-700">
    <div className="flex justify-between items-center mb-3">
      <div>
        <h3 className="text-sm font-semibold text-pink-700 dark:text-pink-300">Reminders</h3>
        <p className="text-xs text-pink-400 dark:text-slate-400">Important dates</p>
      </div>
      <button
        onClick={onAddReminder}
        className="px-2 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-md text-xs flex items-center gap-1 transition"
      >
        <PlusIcon className="w-3 h-3"/> Add
      </button>
    </div>
    <div className="space-y-2 text-xs">
      {reminders.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">No reminders set.</p>
      ) : (
        reminders.map((r) => (
          <div key={r.id} className="flex justify-between items-center group p-1.5 rounded-md hover:bg-pink-50 dark:hover:bg-slate-700/50">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{r.title}</p>
              <p className="text-pink-500 dark:text-pink-400/80">{formatDateShort(r.date)}</p>
            </div>
            <button onClick={() => onDeleteReminder(r.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);


const Sidebar: React.FC<SidebarProps> = ({ summary, reminders, onAddReminder, onDeleteReminder }) => {
  return (
    <aside className="space-y-6">
      <WeeklySummary summary={summary} />
      <Reminders reminders={reminders} onAddReminder={onAddReminder} onDeleteReminder={onDeleteReminder} />
    </aside>
  );
};

export default Sidebar;