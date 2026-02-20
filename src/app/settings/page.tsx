'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMapStore } from '@/stores/mapStore';
import { MapType } from '@/types/map';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { settings, updateSettings, toggleSidebar } = useSettingsStore();
  const { updateSettings: updateMapSettings, settings: mapSettings } = useMapStore();

  const [localRefreshRate, setLocalRefreshRate] = useState(settings.notifications?.soundEnabled ? settings.notifications.soundEnabled : false);

  const handleSave = () => {
    // Persist settings are handled by the zustand persist middleware automatically
    updateMapSettings({ refreshRate: mapSettings.refreshRate });
    // you can extend this to call backend if needed
    alert('Settings saved locally (persisted in localStorage).');
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sidebar collapsed</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Toggle sidebar collapsed state</p>
                </div>
                <Toggle
                  enabled={settings.sidebarCollapsed}
                  onChange={() => toggleSidebar()}
                  label=""
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Show coordinates in DMS</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Display coordinates in degrees/minutes/seconds</p>
                </div>
                <Toggle
                  enabled={settings.showCoordinatesInDMS}
                  onChange={(v) => updateSettings({ showCoordinatesInDMS: v })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="id">Bahasa (ID)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Map Type</label>
                <select
                  value={settings.mapType}
                  onChange={(e) => updateSettings({ mapType: e.target.value as MapType })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={MapType.OPENSTREETMAP}>OpenStreetMap</option>
                  <option value={MapType.GOOGLE_STREETS}>Google Streets</option>
                  <option value={MapType.GOOGLE_SATELLITE}>Google Satellite</option>
                  <option value={MapType.GOOGLE_HYBRID}>Google Hybrid</option>
                  <option value={MapType.MARINE_CHARTS}>Marine Charts</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon size</label>
                <select
                  value={settings.iconSize}
                  onChange={(e) => updateSettings({ iconSize: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Refresh Rate (ms)</label>
                <Input
                  type="number"
                  value={String(settings.refreshRate)}
                  onChange={(e) => updateSettings({ refreshRate: Math.max(250, Number(e.target.value) || 1000) })}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 250 ms recommended for demo; set higher for production.</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable clustering</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cluster vessel markers at low zoom</p>
                </div>
                <Toggle
                  enabled={settings.clusteringEnabled}
                  onChange={(v) => updateSettings({ clusteringEnabled: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Vessel Alerts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Notify when vessels enter/leave areas</p>
                </div>
                <Toggle
                  enabled={settings.notifications.vesselAlerts}
                  onChange={(v) => updateSettings({ notifications: { ...settings.notifications, vesselAlerts: v } })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">System Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">General system messages</p>
                </div>
                <Toggle
                  enabled={settings.notifications.systemNotifications}
                  onChange={(v) => updateSettings({ notifications: { ...settings.notifications, systemNotifications: v } })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sound</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Play sounds for alerts</p>
                </div>
                <Toggle
                  enabled={settings.notifications.soundEnabled}
                  onChange={(v) => updateSettings({ notifications: { ...settings.notifications, soundEnabled: v } })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave}>Save Settings</Button>
          <Button variant="outline" onClick={() => {
            // reset to defaults by simple page reload (or you can implement reset logic)
            location.reload();
          }}>
            Reset (reload)
          </Button>
        </div>
      </div>
    </div>
  );
}