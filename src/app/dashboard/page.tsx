'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { MapContainer } from '@/components/map/MapContainer';
import { VesselList } from '@/components/vessel/VesselList';
import { VesselDetails } from '@/components/vessel/VesselDetails';
import { useVesselStore } from '@/stores/vesselStore';
import { useVessels } from '@/hooks/useVessels';
import { useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  // const [showVesselPanel, setShowVesselPanel] = useState(true);
  const { selectedVessel, selectVessel } = useVesselStore();
  
  // Initialize data fetching and WebSocket
  // useVessels();
  // useWebSocket();

  return (
    <div className="h-screen flex flex-col">
      <Header title="Airomarine" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Vessel list panel */}
        {/* <div
          className={cn(
            'w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden',
            ! showVesselPanel && 'w-0'
          )}
        >
          <VesselList />
        </div> */}

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer className="h-full w-full" />
          
          {/* Toggle vessel panel button */}
          {/* <button
            onClick={() => setShowVesselPanel(!showVesselPanel)}
            className="absolute top-4 left-4 z-[1001] p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showVesselPanel ? '◀' : '▶'}
          </button> */}
        </div>

        {/* Vessel details panel */}
        {selectedVessel && (
          <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <VesselDetails
                vessel={selectedVessel}
                onClose={() => selectVessel(null)}
                onTrack={() => {
                  console.log('Track vessel:', selectedVessel.id);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}