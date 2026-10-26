'use client';

import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vesselApi } from '@/lib/api';
import { useVesselStore } from '@/stores/vesselStore';
import { useMapStore } from '@/stores/mapStore';

export function useVessels(isRealtimeConnected = false) {
  const setVessels = useVesselStore((state) => state.setVessels);
  const setLoading = useVesselStore((state) => state.setLoading);
  const setError = useVesselStore((state) => state.setError);
  const refreshRate = useMapStore((state) => state.settings.refreshRate);

  const {
    data: vessels,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vessels'],
    queryFn: () => vesselApi.getAll(),
    refetchInterval: isRealtimeConnected ? false : refreshRate,
    staleTime: Math.max(refreshRate - 100, 0),
  });

  useEffect(() => {
    if (vessels) {
      setVessels(vessels);
    }
  }, [vessels, setVessels]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch vessels');
    }
  }, [error, setError]);

  const refreshVessels = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    vessels: vessels || [],
    isLoading,
    error,
    refreshVessels,
  };
}

export function useVesselTrack(vesselId: string, from: Date, to: Date) {
  return useQuery({
    queryKey: ['vessel-track', vesselId, from.toISOString(), to.toISOString()],
    queryFn: () => vesselApi.getTrack(vesselId, from, to),
    enabled: !!vesselId,
  });
}

export function useVessel(vesselId: string) {
  return useQuery({
    queryKey: ['vessel', vesselId],
    queryFn: () => vesselApi.getById(vesselId),
    enabled: !!vesselId,
  });
}