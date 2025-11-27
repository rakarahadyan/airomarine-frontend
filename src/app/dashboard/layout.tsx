'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { useAuthStore } from '@/stores/authStore';
import { LoadingPage } from '@/components/ui/Loading';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // For development, skip auth check
    // In production, uncomment the following:
    // if (! isLoading && !isAuthenticated) {
    //   router.push('/login');
    // }
  }, [isAuthenticated, isLoading, router]);

  // For development, show content without auth
  // In production, add proper auth check
  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  return <Navigation>{children}</Navigation>;
}