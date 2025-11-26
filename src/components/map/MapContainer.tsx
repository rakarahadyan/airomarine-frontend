'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/Loading';

// Dynamic import untuk menghindari SSR issues dengan Leaflet
const MapContent = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <Loading size="lg" />
    </div>
  ),
});

interface MapContainerProps {
  className?: string;
  fullscreen?: boolean;
}

export function MapContainer({ className, fullscreen = false }: MapContainerProps) {
  return (
    <div className={className}>
      <MapContent fullscreen={fullscreen} />
    </div>
  );
}