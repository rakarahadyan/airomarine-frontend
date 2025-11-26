'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Squares2X2Icon, CheckIcon } from '@heroicons/react/24/outline';
import { useMapStore } from '@/stores/mapStore';
import { MapType } from '@/types/map';
import { cn } from '@/lib/utils';

const mapTypes = [
  { id: MapType.OPENSTREETMAP, name: 'OpenStreetMap', description: 'Standard map' },
  { id: MapType.GOOGLE_STREETS, name: 'Google Streets', description: 'Google road map' },
  { id: MapType.GOOGLE_SATELLITE, name: 'Google Satellite', description: 'Satellite imagery' },
  { id: MapType. GOOGLE_HYBRID, name: 'Google Hybrid', description: 'Satellite with labels' },
  { id: MapType. MARINE_CHARTS, name: 'Marine Charts', description: 'OpenSeaMap nautical' },
];

export function LayerSwitcher() {
  const { settings, setMapType } = useMapStore();

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Menu as="div" className="relative">
        <Menu.Button className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Squares2X2Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Map Type
              </p>
              {mapTypes.map((type) => (
                <Menu.Item key={type.id}>
                  {({ active }) => (
                    <button
                      onClick={() => setMapType(type.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left',
                        active && 'bg-gray-100 dark:bg-gray-700',
                        settings.mapType === type.id && 'bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {type.description}
                        </p>
                      </div>
                      {settings.mapType === type.id && (
                        <CheckIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  )}
                </Menu. Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}