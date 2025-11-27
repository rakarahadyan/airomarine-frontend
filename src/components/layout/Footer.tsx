'use client';

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Airomarine</div>
        <div className="text-xs">
          Built with Next.js · Leaflet · Tailwind
        </div>
      </div>
    </footer>
  );
}