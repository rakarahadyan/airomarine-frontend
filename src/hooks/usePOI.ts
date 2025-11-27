'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { poiApi } from '@/lib/api';
import { POI } from '@/types/poi';

export function usePOIs() {
  return useQuery({
    queryKey: ['pois'],
    queryFn: poiApi.getAll,
  });
}

export function usePOICategories() {
  return useQuery({
    queryKey: ['poi-categories'],
    queryFn: poiApi.getCategories,
  });
}

export function useCreatePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<POI>) => poiApi. create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pois'] });
    },
  });
}

export function useUpdatePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<POI> }) =>
      poiApi.update(id, data),
    onSuccess: () => {
      queryClient. invalidateQueries({ queryKey: ['pois'] });
    },
  });
}

export function useDeletePOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => poiApi. delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pois'] });
    },
  });
}