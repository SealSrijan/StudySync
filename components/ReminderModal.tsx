import React, { useState, useEffect, useRef } from 'react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReminder: (reminder: { title: string; date: string }) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onAddReminder }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setTitle('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      alert('Please fill in both title and date.');
      return;
    }
    onAddReminder({ title, date });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-pink-100 dark:border-slate-700 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        tabIndex={-1}
      >
        <h2 className="text-lg font-semibold text-pink-700 dark:text-pink-300 mb-4">Add New Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reminder-title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="reminder-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"
              placeholder="e.g., Physics exam"
            />
          </div>
          <div>
            <label htmlFor="reminder-date" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="reminder-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full p-2 rounded-lg border bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
