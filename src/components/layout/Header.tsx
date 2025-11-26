'use client';

import { useState } from 'react';
import {
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useSettingsStore } from '@/stores/settingsStore';
import { useVesselStore } from '@/stores/vesselStore';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { settings, setTheme } = useSettingsStore();
  const { setFilter } = useVesselStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ searchQuery });
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document. documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>

        {/* Search and actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <Input
              type="search"
              placeholder="Search vessels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target. value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="w-64"
            />
          </form>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
          >
            {settings. theme === 'dark' ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}