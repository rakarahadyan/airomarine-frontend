import { create } from 'zustand';
import { Vessel, VesselFilter, VesselType, NavigationStatus } from '@/types/vessel';

interface VesselStore {
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  filter: VesselFilter;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setVessels: (vessels: Vessel[]) => void;
  addVessel: (vessel: Vessel) => void;
  updateVessel: (vessel: Vessel) => void;
  removeVessel: (vesselId: string) => void;
  selectVessel: (vessel: Vessel | null) => void;
  setFilter: (filter: Partial<VesselFilter>) => void;
  clearFilter: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed
  filteredVessels: () => Vessel[];
}

export const useVesselStore = create<VesselStore>((set, get) => ({
  vessels: [],
  selectedVessel: null,
  filter: {},
  isLoading: false,
  error: null,

  setVessels: (vessels) => set({ vessels }),

  addVessel: (vessel) =>
    set((state) => ({
      vessels: state.vessels.some((current) => current.id === vessel.id)
        ? state.vessels.map((current) => current.id === vessel.id ? vessel : current)
        : [...state.vessels, vessel],
    })),
  
  updateVessel: (vessel) =>
    set((state) => ({
      vessels: state.vessels.map((v) =>
        v.id === vessel.id ?  vessel : v
      ),
      selectedVessel:
        state.selectedVessel?.id === vessel.id ?  vessel : state.selectedVessel,
    })),

  removeVessel: (vesselId) =>
    set((state) => ({
      vessels: state.vessels.filter((vessel) => vessel.id !== vesselId),
      selectedVessel:
        state.selectedVessel?.id === vesselId ? null : state.selectedVessel,
    })),

  selectVessel: (vessel) => set({ selectedVessel: vessel }),
  
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
  
  clearFilter: () => set({ filter: {} }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  filteredVessels: () => {
    const { vessels, filter } = get();
    
    return vessels.filter((vessel) => {
      // Filter by type
      if (filter.types && filter.types.length > 0) {
        if (!filter.types.includes(vessel.shipType)) {
          return false;
        }
      }

      // Filter by status
      if (filter.status && filter.status.length > 0) {
        if (! filter.status.includes(vessel.navStatus)) {
          return false;
        }
      }

      // Filter by search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesName = vessel.name.toLowerCase().includes(query);
        const matchesMMSI = vessel.mmsi.includes(query);
        const matchesCallSign = vessel.callSign?.toLowerCase().includes(query);
        if (!matchesName && !matchesMMSI && !matchesCallSign) {
          return false;
        }
      }

      // Filter by bounds
      if (filter.bounds) {
        const { north, south, east, west } = filter.bounds;
        if (
          vessel.latitude < south ||
          vessel.latitude > north ||
          vessel.longitude < west ||
          vessel.longitude > east
        ) {
          return false;
        }
      }

      return true;
    });
  },
}));