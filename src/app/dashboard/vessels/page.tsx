'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { VesselDetails } from '@/components/vessel/VesselDetails';
import { useVesselStore } from '@/stores/vesselStore';
import { useVessels } from '@/hooks/useVessels';
import { getVesselColor, formatSpeed, formatCourse, formatDate } from '@/lib/utils';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TableCellsIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { Vessel } from '@/types/vessel';

type ViewMode = 'table' | 'grid';

export default function VesselsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const { filteredVessels, setFilter } = useVesselStore();
  const { isLoading } = useVessels();
  
  const vessels = filteredVessels();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ searchQuery: value });
  };

  const handleViewDetails = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setShowDetailsModal(true);
  };

  const handleExport = () => {
    // Export vessels to CSV
    const csv = [
      ['Name', 'MMSI', 'Type', 'Speed', 'Course', 'Latitude', 'Longitude', 'Last Update']. join(','),
      ...vessels.map((v) =>
        [v.name, v. mmsi, v. shipType, v.speed, v. course, v.latitude, v.longitude, v.lastUpdate].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document. createElement('a');
    a.href = url;
    a.download = 'vessels.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Header title="Vessels" />
      
      <div className="p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Vessels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{vessels.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 20h16L12 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moving</p>
                  <p className="text-2xl font-bold text-green-600">
                    {vessels.filter((v) => v. speed > 0.5).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <span className="text-2xl">🚢</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Anchored</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {vessels.filter((v) => v.navStatus === 1).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                  <span className="text-2xl">⚓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Moored</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {vessels.filter((v) => v.navStatus === 5).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <span className="text-2xl">🏗️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search vessels..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
              className="w-64"
            />
            <Button variant="outline">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExport}>
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </Button>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow' : ''
                }`}
              >
                <TableCellsIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table view */}
        {viewMode === 'table' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Vessel</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">MMSI</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Speed</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Course</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Last Update</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map((vessel) => (
                    <tr
                      key={vessel.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: getVesselColor(vessel. shipType) + '20' }}
                          >
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill={getVesselColor(vessel.shipType)}
                            >
                              <path d="M12 2L4 20h16L12 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {vessel.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{vessel.mmsi}</td>
                      <td className="p-4">
                        <Badge variant="default" className="capitalize">
                          {vessel.shipType}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={vessel.speed > 0.5 ? 'success' : 'warning'}>
                          {vessel.speed > 0.5 ? 'Moving' : 'Stationary'}
                        </Badge>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{formatSpeed(vessel.speed)}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{formatCourse(vessel.course)}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(vessel.lastUpdate)}
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetails(vessel)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vessels.map((vessel) => (
              <Card key={vessel. id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(vessel)}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: getVesselColor(vessel.shipType) + '20' }}
                    >
                      <svg
                        className="h-7 w-7"
                        viewBox="0 0 24 24"
                        fill={getVesselColor(vessel.shipType)}
                        style={{ transform: `rotate(${vessel. heading}deg)` }}
                      >
                        <path d="M12 2L4 20h16L12 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {vessel.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vessel.mmsi}
                      </p>
                    </div>
                    <Badge variant={vessel.speed > 0.5 ? 'success' : 'warning'} size="sm">
                      {vessel.speed > 0.5 ?  'Moving' : 'Stop'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Speed</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatSpeed(vessel.speed)}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Course</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCourse(vessel.course)}
                      </p>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Heading</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCourse(vessel.heading)}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
                    Updated: {formatDate(vessel.lastUpdate)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {vessels.length === 0 && ! isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 20h16L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No vessels found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vessel Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        size="lg"
      >
        {selectedVessel && (
          <VesselDetails
            vessel={selectedVessel}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}