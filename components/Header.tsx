import React from 'react';
import type { User } from 'firebase/auth';
import type { Theme } from '../types';
import { BookOpenIcon, MoonIcon, SunIcon } from './Icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, user, onSignOut }) => {
  return (
    <header className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg sticky top-0 z-40 border-b border-pink-100 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shadow-sm text-pink-500 dark:text-pink-400">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-pink-800 dark:text-pink-300">StudySync Diary</h1>
              <p className="text-xs text-pink-500 dark:text-pink-400/80">Your Personal Study Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.isAnonymous ? 'Guest User' : user.email}</p>
                 <button onClick={onSignOut} className="text-xs text-pink-500 dark:text-pink-400 hover:underline">Sign out</button>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-pink-600 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
