'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet-draw';
import { useMapStore } from '@/stores/mapStore';
import { useVesselStore } from '@/stores/vesselStore';
import { MAP_TILES, CLUSTER_OPTIONS, ICON_SIZES } from '@/lib/constants';
import { MapType } from '@/types/map';
import { Vessel } from '@/types/vessel';
import { getVesselColor } from '@/lib/utils';
import { MapControls } from './MapControls';
import { CoordinateDisplay } from './CoordinateDisplay';
import { LayerSwitcher } from './LayerSwitcher';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

interface MapContentProps {
  fullscreen?: boolean;
}

export default function MapContent({ fullscreen = false }: MapContentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const vesselMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const markerVesselsRef = useRef<Map<string, Vessel>>(new Map());

  const center = useMapStore((state) => state.center);
  const zoom = useMapStore((state) => state.zoom);
  const settings = useMapStore((state) => state.settings);
  const setCenter = useMapStore((state) => state.setCenter);
  const setZoom = useMapStore((state) => state.setZoom);
  const vessels = useVesselStore((state) => state.vessels);
  const selectedVessel = useVesselStore((state) => state.selectedVessel);
  const selectVessel = useVesselStore((state) => state.selectVessel);
  const filteredVessels = useVesselStore((state) => state.filteredVessels);

  // Create vessel icon
  const createVesselIcon = useCallback((vessel: Vessel) => {
    const size = ICON_SIZES[settings.iconSize];
    const color = getVesselColor(vessel.shipType);
    const rotation = settings.showTrueHeading ? vessel.heading : vessel.course;

    return L.divIcon({
      className: 'vessel-marker',
      html: `
        <div style="
          width: ${size.width}px;
          height: ${size.height}px;
          transform: rotate(${rotation}deg);
        ">
          <svg viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="1">
            <path d="M12 2L4 20h16L12 2z"/>
          </svg>
        </div>
      `,
      iconSize: [size.width, size.height],
      iconAnchor: [size.width / 2, size.height / 2],
    });
  }, [settings.iconSize, settings.showTrueHeading]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: false,
    });

    // Add tile layer
    const tileUrl = getTileUrl(settings.mapType);
    L.tileLayer(tileUrl.url, {
      attribution: tileUrl.attribution,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add scale control
    L.control.scale({ position: 'bottomleft' }).addTo(map);

    // Initialize marker cluster group
    const markers = L.markerClusterGroup({
      ...CLUSTER_OPTIONS,
      disableClusteringAtZoom: settings.clusteringEnabled ? undefined : 0,
    });
    map.addLayer(markers);
    markersRef.current = markers;

    // Event handlers
    map.on('moveend', () => {
      const center = map.getCenter();
      setCenter({ lat: center.lat, lng: center.lng });
      setZoom(map.getZoom());
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update tile layer when map type changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const tileUrl = getTileUrl(settings.mapType);

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    L.tileLayer(tileUrl.url, {
      attribution: tileUrl.attribution,
    }).addTo(map);
  }, [settings.mapType]);

  // Update vessel markers
  useEffect(() => {
    if (! markersRef.current) return;

    const filtered = filteredVessels();
    const existingIds = new Set(vesselMarkersRef.current.keys());
    const newIds = new Set(filtered.map((v) => v.id));

    // Remove markers for vessels no longer in view
    existingIds.forEach((id) => {
      if (!newIds.has(id)) {
        const marker = vesselMarkersRef.current.get(id);
        if (marker) {
          markersRef.current?.removeLayer(marker);
          vesselMarkersRef.current.delete(id);
          markerVesselsRef.current.delete(id);
        }
      }
    });

    // Add or update markers
    filtered.forEach((vessel) => {
      const existingMarker = vesselMarkersRef.current.get(vessel.id);
      const previousVessel = markerVesselsRef.current.get(vessel.id);

      if (existingMarker) {
        if (
          !previousVessel ||
          previousVessel.latitude !== vessel.latitude ||
          previousVessel.longitude !== vessel.longitude
        ) {
          existingMarker.setLatLng([vessel.latitude, vessel.longitude]);
        }

        if (
          !previousVessel ||
          previousVessel.heading !== vessel.heading ||
          previousVessel.course !== vessel.course ||
          previousVessel.shipType !== vessel.shipType ||
          previousVessel.lastUpdate !== vessel.lastUpdate
        ) {
          existingMarker.setIcon(createVesselIcon(vessel));
          existingMarker.setPopupContent(createPopupContent(vessel));
        }
      } else {
        // Create new marker
        const marker = L.marker([vessel.latitude, vessel.longitude], {
          icon: createVesselIcon(vessel),
        });

        marker.on('click', () => {
          selectVessel(vessel);
        });

        // Add popup
        marker.bindPopup(createPopupContent(vessel), {
          className: 'vessel-popup',
          maxWidth: 350,
        });

        markersRef.current?.addLayer(marker);
        vesselMarkersRef.current.set(vessel.id, marker);
      }
      markerVesselsRef.current.set(vessel.id, vessel);
    });
  }, [vessels, filteredVessels, createVesselIcon, selectVessel]);

  // Pan to selected vessel
  useEffect(() => {
    if (!mapRef.current || !selectedVessel) return;

    mapRef.current.panTo([selectedVessel.latitude, selectedVessel.longitude], {
      animate: true,
    });

    // Open popup for selected vessel
    const marker = vesselMarkersRef.current.get(selectedVessel.id);
    if (marker) {
      marker.openPopup();
    }
  }, [selectedVessel]);

  return (
    <div className={`relative h-full w-full ${fullscreen ? 'map-fullscreen' : ''}`}>
      <div ref={mapContainerRef} className="h-full w-full" />
      <MapControls map={mapRef.current} />
      <CoordinateDisplay map={mapRef.current} />
      <LayerSwitcher />
    </div>
  );
}

function getTileUrl(mapType: MapType) {
  switch (mapType) {
    case MapType.GOOGLE_STREETS:
      return MAP_TILES.googleStreets;
    case MapType.GOOGLE_SATELLITE:
      return MAP_TILES.googleSatellite;
    case MapType.GOOGLE_HYBRID:
      return MAP_TILES.googleHybrid;
    case MapType.MARINE_CHARTS:
      return MAP_TILES.marineCharts;
    default:
      return MAP_TILES.openstreetmap;
  }
}

function createPopupContent(vessel: Vessel): string {
  return `
    <div class="vessel-popup">
      <div class="vessel-popup-header">
        <div class="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <svg class="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L4 20h16L12 2z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white">${vessel.name}</h3>
          <p class="text-sm text-gray-500">MMSI: ${vessel.mmsi}</p>
        </div>
      </div>
      <div class="vessel-popup-content">
        <div class="vessel-popup-row">
          <span class="vessel-popup-label">Type</span>
          <span class="vessel-popup-value">${vessel.shipType}</span>
        </div>
        <div class="vessel-popup-row">
          <span class="vessel-popup-label">Speed</span>
          <span class="vessel-popup-value">${vessel.speed.toFixed(1)} kn</span>
        </div>
        <div class="vessel-popup-row">
          <span class="vessel-popup-label">Course</span>
          <span class="vessel-popup-value">${vessel.course.toFixed(1)}°</span>
        </div>
        <div class="vessel-popup-row">
          <span class="vessel-popup-label">Heading</span>
          <span class="vessel-popup-value">${vessel.heading.toFixed(1)}°</span>
        </div>
        ${vessel.destination ? `
          <div class="vessel-popup-row">
            <span class="vessel-popup-label">Destination</span>
            <span class="vessel-popup-value">${vessel.destination}</span>
          </div>
        ` : ''}
      </div>
      <div class="vessel-popup-actions">
        <button class="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          Track
        </button>
        <button class="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">
          Details
        </button>
      </div>
    </div>
  `;
}