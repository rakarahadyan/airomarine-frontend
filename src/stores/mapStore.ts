import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapSettings, MapType, DrawingSettings, Coordinates } from '@/types/map';
import { DrawingShape } from '@/types/poi';
import { DRAWING_DEFAULTS, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';

interface MapStore {
  // Map state
  center: Coordinates;
  zoom: number;
  settings: MapSettings;
  drawingSettings: DrawingSettings;
  
  // Drawing state
  shapes: DrawingShape[];
  isDrawing: boolean;
  currentDrawingTool: 'polygon' | 'circle' | 'marker' | 'polyline' | 'rectangle' | null;
  
  // Actions
  setCenter: (center: Coordinates) => void;
  setZoom: (zoom: number) => void;
  setMapType: (type: MapType) => void;
  updateSettings: (settings: Partial<MapSettings>) => void;
  updateDrawingSettings: (settings: Partial<DrawingSettings>) => void;
  
  // Drawing actions
  addShape: (shape: DrawingShape) => void;
  removeShape: (id: string) => void;
  updateShape: (id: string, shape: Partial<DrawingShape>) => void;
  clearShapes: () => void;
  setDrawingTool: (tool: MapStore['currentDrawingTool']) => void;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const useMapStore = create<MapStore>()(
  persist(
    (set) => ({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      settings: {
        mapType: MapType.OPENSTREETMAP,
        iconSize: 'medium',
        fontSize: 'medium',
        clusteringEnabled: true,
        clusterRadius: 50,
        showRealSizeVessels: false,
        showTrueHeading: true,
        showCOG: true,
        refreshRate: 1000,
      },
      drawingSettings: DRAWING_DEFAULTS,
      shapes: [],
      isDrawing: false,
      currentDrawingTool: null,

      setCenter: (center) => set({ center }),
      setZoom: (zoom) => set({ zoom }),
      setMapType: (type) =>
        set((state) => ({
          settings: { ...state.settings, mapType: type },
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateDrawingSettings: (newSettings) =>
        set((state) => ({
          drawingSettings: { ...state.drawingSettings, ...newSettings },
        })),

      addShape: (shape) =>
        set((state) => ({
          shapes: [...state.shapes, shape],
        })),
      removeShape: (id) =>
        set((state) => ({
          shapes: state.shapes.filter((s) => s.id !== id),
        })),
      updateShape: (id, shapeData) =>
        set((state) => ({
          shapes: state.shapes.map((s) =>
            s.id === id ? { ...s, ...shapeData } : s
          ),
        })),
      clearShapes: () => set({ shapes: [] }),
      setDrawingTool: (tool) => set({ currentDrawingTool: tool }),
      setIsDrawing: (isDrawing) => set({ isDrawing }),
    }),
    {
      name: 'map-storage',
      partialize: (state) => ({
        settings: state.settings,
        drawingSettings: state.drawingSettings,
        shapes: state.shapes,
      }),
    }
  )
);