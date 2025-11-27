'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const router = useRouter();
  const { login: setAuth, logout: clearAuth, isAuthenticated, user } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authApi.login(username, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setAuth(data. user, data.token);
      router. push('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem('token');
      clearAuth();
      router. push('/login');
    },
    onError: () => {
      // Even if logout fails, clear local state
      localStorage. removeItem('token');
      clearAuth();
      router.push('/login');
    },
  });

  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    retry: false,
  });

  const login = useCallback(
    (username: string, password: string) => {
      loginMutation.mutate({ username, password });
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: loginMutation.isPending || isLoadingUser,
    isLoggingOut: logoutMutation.isPending,
    error: loginMutation.error,
    login,
    logout,
  };
}