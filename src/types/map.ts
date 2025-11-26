export interface MapSettings {
  mapType: MapType;
  iconSize: 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
  clusteringEnabled: boolean;
  clusterRadius: number;
  showRealSizeVessels: boolean;
  showTrueHeading: boolean;
  showCOG: boolean;
  refreshRate: number; // in milliseconds
}

export enum MapType {
  GOOGLE_STREETS = 'google_streets',
  GOOGLE_SATELLITE = 'google_satellite',
  GOOGLE_HYBRID = 'google_hybrid',
  OPENSTREETMAP = 'openstreetmap',
  MARINE_CHARTS = 'marine_charts',
  OFFLINE = 'offline',
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CoordinateDMS {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface DrawingSettings {
  polygonColor: string;
  polygonFillColor: string;
  polygonFillOpacity: number;
  circleColor: string;
  circleFillColor: string;
  circleFillOpacity: number;
  polylineColor: string;
  polylineWeight: number;
  markerColor: string;
}