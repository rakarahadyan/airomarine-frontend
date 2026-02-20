import { ReactNode } from 'react';
import { Providers } from './providers';
import { Navigation } from '@/components/layout/Navigation';
import './globals.css';

export const metadata = {
  title: 'AiroMarine',
  description: 'Maritime vessel tracking and management system',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navigation>{children}</Navigation>
        </Providers>
      </body>
    </html>
  );
}