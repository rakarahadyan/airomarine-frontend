'use client';

import { useState } from 'react';
import L from 'leaflet';
import {
  PlusIcon,
  MinusIcon,
  MapIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CursorArrowRaysIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useMapStore } from '@/stores/mapStore';

interface MapControlsProps {
  map: L.Map | null;
}

export function MapControls({ map }: MapControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { currentDrawingTool, setDrawingTool, setIsDrawing } = useMapStore();

  const handleZoomIn = () => {
    map?.zoomIn();
  };

  const handleZoomOut = () => {
    map?.zoomOut();
  };

  const handleResetView = () => {
    map?.setView([-6.2088, 106.8456], 10);
  };

  const toggleFullscreen = () => {
    if (! document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const drawingTools = [
    { id: 'polygon', icon: '⬡', label: 'Polygon' },
    { id: 'circle', icon: '○', label: 'Circle' },
    { id: 'rectangle', icon: '▢', label: 'Rectangle' },
    { id: 'polyline', icon: '⟋', label: 'Polyline' },
    { id: 'marker', icon: '📍', label: 'Marker' },
  ] as const;

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      {/* Zoom controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          title="Zoom in"
        >
          <PlusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Zoom out"
        >
          <MinusIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* View controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleResetView}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
          title="Reset view"
        >
          <MapIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ArrowsPointingOutIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Drawing tools */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {drawingTools.map((tool, index) => (
          <button
            key={tool.id}
            onClick={() => {
              if (currentDrawingTool === tool.id) {
                setDrawingTool(null);
                setIsDrawing(false);
              } else {
                setDrawingTool(tool.id);
                setIsDrawing(true);
              }
            }}
            className={cn(
              'p-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full',
              index < drawingTools.length - 1 && 'border-b border-gray-200 dark:border-gray-700',
              currentDrawingTool === tool.id && 'bg-blue-100 dark:bg-blue-900'
            )}
            title={tool.label}
          >
            <span className="text-lg">{tool.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}