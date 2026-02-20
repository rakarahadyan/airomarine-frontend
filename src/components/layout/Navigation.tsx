'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useSettingsStore } from '@/stores/settingsStore';
import { cn } from '@/lib/utils';

interface NavigationProps {
  children: React.ReactNode;
}

export function Navigation({ children }: NavigationProps) {
  const { settings } = useSettingsStore();
  const collapsed = settings.sidebarCollapsed;
  const pathname = usePathname();

  const isAuthRoute = pathname?.startsWith('/auth');

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main
        className={cn(
          'transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}