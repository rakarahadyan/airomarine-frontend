'use client';

import { useState } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { POI } from '@/types/poi';
import { formatDate } from '@/lib/utils';

interface POIListProps {
  pois: POI[];
  onSelect: (poi: POI) => void;
  onAdd: () => void;
  onEdit: (poi: POI) => void;
  onDelete: (poi: POI) => void;
  onToggleVisibility: (poi: POI) => void;
}

export function POIList({
  pois,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onToggleVisibility,
}: POIListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPOIs = pois.filter(
    (poi) =>
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Points of Interest
          </h2>
          <Button onClick={onAdd} size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add POI
          </Button>
        </div>
        <Input
          type="search"
          placeholder="Search POIs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
        />
      </div>

      {/* POI count */}
      <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        {filteredPOIs.length} POIs
      </div>

      {/* POI list */}
      <div className="flex-1 overflow-y-auto">
        {filteredPOIs.length === 0 ?  (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No POIs found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPOIs.map((poi) => (
              <div
                key={poi.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onSelect(poi)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: poi.color + '20' }}
                  >
                    <span className="text-xl">{poi.icon || '📍'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {poi.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleVisibility(poi);
                        }}
                        className={`p-1 rounded ${
                          poi.isVisible
                            ?  'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {poi.isVisible ?  '👁' : '👁‍🗨'}
                      </button>
                    </div>
                    {poi.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {poi.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDate(poi.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}