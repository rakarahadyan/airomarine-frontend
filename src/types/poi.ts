export interface POI {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  category: POICategory;
  icon?: string;
  color?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface POICategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface KMLLayer {
  id: string;
  name: string;
  fileName: string;
  geoJson: GeoJSON.FeatureCollection;
  isVisible: boolean;
  color?: string;
}

export interface DrawingShape {
  id: string;
  type: 'polygon' | 'circle' | 'marker' | 'polyline' | 'rectangle';
  coordinates: number[][] | number[];
  radius?: number; // For circles
  properties: {
    name?: string;
    color: string;
    fillColor?: string;
    fillOpacity?: number;
    weight?: number;
  };
}