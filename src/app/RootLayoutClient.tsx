'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({
  children,
}: RootLayoutClientProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
