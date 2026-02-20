export const MAP_TILES = {
  openstreetmap: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
  },
  googleStreets: {
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '© Google Maps',
  },
  googleSatellite: {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: '© Google Maps',
  },
  googleHybrid: {
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '© Google Maps',
  },
  marineCharts: {
    url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',
    attribution: '© OpenSeaMap contributors',
  },
};

export const DEFAULT_CENTER = {
  lat: -6.2088,
  lng: 106.8456,
};

export const DEFAULT_ZOOM = 10;

export const VESSEL_REFRESH_RATE = 1000; // 1 second

export const CLUSTER_OPTIONS = {
  maxClusterRadius: 50,
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
};

export const ICON_SIZES = {
  small: { width: 20, height: 20 },
  medium: { width: 30, height: 30 },
  large: { width: 40, height: 40 },
};

export const DRAWING_DEFAULTS = {
  polygonColor: '#3388ff',
  polygonFillColor: '#3388ff',
  polygonFillOpacity: 0.2,
  circleColor: '#3388ff',
  circleFillColor: '#3388ff',
  circleFillOpacity: 0.2,
  polylineColor: '#3388ff',
  polylineWeight: 3,
  markerColor: '#3388ff',
};