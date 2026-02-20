'use client';

import { Vessel } from '@/types/vessel';
import { Badge } from '@/components/ui/Badge';
import { getVesselColor, getNavigationStatusText, formatSpeed, formatCourse, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VesselCardProps {
  vessel: Vessel;
  onClick?: () => void;
  isSelected?: boolean;
}

export function VesselCard({ vessel, onClick, isSelected }: VesselCardProps) {
  const statusVariant = vessel.speed > 0.5 ? 'success' : vessel.navStatus === 5 ? 'info' : 'warning';

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        isSelected && 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Vessel icon */}
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: getVesselColor(vessel.shipType) + '20' }}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill={getVesselColor(vessel.shipType)}
            style={{ transform: `rotate(${vessel.heading}deg)` }}
          >
            <path d="M12 2L4 20h16L12 2z" />
          </svg>
        </div>

        {/* Vessel info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {vessel.name}
            </h3>
            <Badge variant={statusVariant} size="sm">
              {vessel.speed > 0.5 ? 'Moving' : 'Stationary'}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            MMSI: {vessel.mmsi}
          </p>

          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">SPD:</span> {formatSpeed(vessel.speed)}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">COG:</span> {formatCourse(vessel.course)}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              <span className="text-gray-400">HDG:</span> {formatCourse(vessel.heading)}
            </span>
          </div>

          {vessel.destination && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
              → {vessel.destination}
            </p>
          )}

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Updated: {formatDate(vessel.lastUpdate)}
          </p>
        </div>
      </div>
    </div>
  );
}