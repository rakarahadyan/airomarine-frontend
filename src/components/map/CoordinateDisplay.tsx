'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatCoordinates } from '@/lib/utils';

interface CoordinateDisplayProps {
  map: L.Map | null;
}

export function CoordinateDisplay({ map }: CoordinateDisplayProps) {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (! map) return;

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('mousemove', handleMouseMove);

    return () => {
      map.off('mousemove', handleMouseMove);
    };
  }, [map]);

  return (
    <div className="coordinate-display">
      <span className="text-gray-700 dark:text-gray-300">
        {formatCoordinates(coordinates.lat, coordinates.lng, settings.showCoordinatesInDMS)}
      </span>
    </div>
  );
}