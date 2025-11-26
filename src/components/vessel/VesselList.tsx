'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VesselCard } from './VesselCard';
import { useVesselStore } from '@/stores/vesselStore';
import { VesselType } from '@/types/vessel';

export function VesselList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<VesselType[]>([]);

  const { filteredVessels, setFilter, selectVessel } = useVesselStore();
  const vessels = filteredVessels();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ searchQuery: value });
  };

  const handleTypeFilter = (type: VesselType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    setFilter({ types: newTypes. length > 0 ? newTypes : undefined });
  };

  const vesselTypes = Object.values(VesselType);

  return (
    <div className="h-full flex flex-col">
      {/* Search and filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search vessels..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="flex-1"
          />
          <Button
            variant={showFilters ?  'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vessel Types
            </p>
            <div className="flex flex-wrap gap-2">
              {vesselTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vessel count */}
      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        {vessels.length} vessels found
      </div>

      {/* Vessel list */}
      <div className="flex-1 overflow-y-auto">
        {vessels.length === 0 ?  (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No vessels found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {vessels.map((vessel) => (
              <VesselCard
                key={vessel. id}
                vessel={vessel}
                onClick={() => selectVessel(vessel)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}