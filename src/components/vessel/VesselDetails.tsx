'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { Vessel } from '@/types/vessel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  getVesselColor,
  getNavigationStatusText,
  formatSpeed,
  formatCourse,
  formatDate,
  formatCoordinates,
} from '@/lib/utils';

interface VesselDetailsProps {
  vessel: Vessel;
  onClose: () => void;
  onTrack?: () => void;
}

export function VesselDetails({ vessel, onClose, onTrack }: VesselDetailsProps) {
  const statusVariant = vessel.speed > 0.5 ? 'success' : vessel.navStatus === 5 ? 'info' : 'warning';

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: getVesselColor(vessel.shipType) + '20' }}
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill={getVesselColor(vessel.shipType)}
            >
              <path d="M12 2L4 20h16L12 2z" />
            </svg>
          </div>
          <div>
            <CardTitle>{vessel.name}</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              MMSI: {vessel.mmsi}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>
            {vessel.speed > 0.5 ? 'Moving' : 'Stationary'}
          </Badge>
          <Badge variant="default">
            {getNavigationStatusText(vessel.navStatus)}
          </Badge>
        </div>

        {/* Position */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Position
          </h4>
          <p className="font-mono text-sm text-gray-900 dark:text-white">
            {formatCoordinates(vessel.latitude, vessel.longitude, true)}
          </p>
        </div>

        {/* Navigation data */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Speed</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatSpeed(vessel.speed)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCourse(vessel.course)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Heading</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCourse(vessel.heading)}
            </p>
          </div>
        </div>

        {/* Vessel details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Type</span>
            <span className="text-gray-900 dark:text-white capitalize">{vessel.shipType}</span>
          </div>
          {vessel.callSign && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Call Sign</span>
              <span className="text-gray-900 dark:text-white">{vessel.callSign}</span>
            </div>
          )}
          {vessel.imo && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">IMO</span>
              <span className="text-gray-900 dark:text-white">{vessel.imo}</span>
            </div>
          )}
          {vessel.destination && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Destination</span>
              <span className="text-gray-900 dark:text-white">{vessel.destination}</span>
            </div>
          )}
          {vessel.eta && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">ETA</span>
              <span className="text-gray-900 dark:text-white">{vessel.eta}</span>
            </div>
          )}
          {vessel.length && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Dimensions</span>
              <span className="text-gray-900 dark:text-white">
                {vessel.length}m × {vessel.width}m
              </span>
            </div>
          )}
          {vessel.draught && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Draught</span>
              <span className="text-gray-900 dark:text-white">{vessel.draught}m</span>
            </div>
          )}
        </div>

        {/* Last update */}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Last updated: {formatDate(vessel.lastUpdate)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onTrack} className="flex-1">
            Track Vessel
          </Button>
          <Button variant="outline" className="flex-1">
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}