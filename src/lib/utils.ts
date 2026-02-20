import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CoordinateDMS } from '@/types/map';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSpeed(speed: number): string {
  return `${speed.toFixed(1)} kn`;
}

export function formatCourse(course: number): string {
  return `${course.toFixed(1)}°`;
}

export function convertToDMS(decimal: number, isLatitude: boolean): CoordinateDMS {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;

  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S';
  } else {
    direction = decimal >= 0 ? 'E' : 'W';
  }

  return { degrees, minutes, seconds, direction };
}

export function formatDMS(dms: CoordinateDMS): string {
  return `${dms.degrees}° ${dms.minutes}' ${dms.seconds.toFixed(2)}" ${dms.direction}`;
}

export function formatCoordinates(lat: number, lng: number, useDMS: boolean = false): string {
  if (useDMS) {
    const latDMS = convertToDMS(lat, true);
    const lngDMS = convertToDMS(lng, false);
    return `${formatDMS(latDMS)}, ${formatDMS(lngDMS)}`;
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function getVesselColor(type: string): string {
  const colors: Record<string, string> = {
    cargo: '#4CAF50',
    tanker: '#F44336',
    passenger: '#2196F3',
    fishing: '#FF9800',
    tug: '#9C27B0',
    military: '#607D8B',
    sailing: '#00BCD4',
    pleasure: '#E91E63',
    high_speed: '#FFEB3B',
    pilot: '#795548',
    sar: '#FF5722',
    other: '#9E9E9E',
  };
  return colors[type] || colors.other;
}

export function getNavigationStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    0: 'Under way using engine',
    1: 'At anchor',
    2: 'Not under command',
    3: 'Restricted maneuverability',
    4: 'Constrained by draught',
    5: 'Moored',
    6: 'Aground',
    7: 'Engaged in fishing',
    8: 'Under way sailing',
    9: 'Reserved for HSC',
    10: 'Reserved for WIG',
    14: 'AIS-SART',
    15: 'Not defined',
  };
  return statusTexts[status] || 'Unknown';
}

export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const dLng = toRad(lng2 - lng1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

  let bearing = toDeg(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convert km to nautical miles
export function kmToNauticalMiles(km: number): number {
  return km * 0.539957;
}