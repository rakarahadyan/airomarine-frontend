import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  showCoordinatesInDMS: boolean;
  language: string;
  notifications: {
    vesselAlerts: boolean;
    systemNotifications: boolean;
    soundEnabled: boolean;
  };
}

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  setTheme: (theme: AppSettings['theme']) => void;
  updateNotifications: (notifications: Partial<AppSettings['notifications']>) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        sidebarCollapsed: false,
        showCoordinatesInDMS: false,
        language: 'id',
        notifications: {
          vesselAlerts: true,
          systemNotifications: true,
          soundEnabled: false,
        },
      },

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      toggleSidebar: () =>
        set((state) => ({
          settings: {
            ...state. settings,
            sidebarCollapsed: !state.settings. sidebarCollapsed,
          },
        })),

      setTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),

      updateNotifications: (notifications) =>
        set((state) => ({
          settings: {
            ...state. settings,
            notifications: { ...state. settings.notifications, ... notifications },
          },
        })),
    }),
    {
      name: 'app-settings',
    }
  )
);