'use client';

import { useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { vesselApi } from '@/lib/api';
import { useVesselStore } from '@/stores/vesselStore';
import { useMapStore } from '@/stores/mapStore';
import { Vessel } from '@/types/vessel';

export function useVessels() {
  const queryClient = useQueryClient();
  const { setVessels, setLoading, setError } = useVesselStore();
  const { settings } = useMapStore();

  const {
    data: vessels,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['vessels'],
    queryFn: vesselApi.getAll,
    refetchInterval: settings.refreshRate,
    staleTime: settings.refreshRate - 100,
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