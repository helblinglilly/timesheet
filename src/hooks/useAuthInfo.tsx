
'use client';

import React, { createContext, useContext } from 'react';
import { api } from '~/trpc/react';

interface AuthInfoContextType {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  isLoading: boolean;
}

const Context = createContext<AuthInfoContextType | undefined>(undefined);

export function AuthInfoProvider({
  user: serverUser,
  children,
}: {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  children: React.ReactNode;
}) {
  // Use server-side user data as initialData, but allow client-side refetching
  const { data: user, isLoading } = api.account.getFullUserDetails.useQuery(
    undefined, // no input needed, uses auth from context
    {
      enabled: !!serverUser, // Only query if we have a user (signed in)
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    }
  );

  return (
    <Context.Provider value={{ user, isLoading }}>
      {children}
    </Context.Provider>
  );
}

export function useAuthInfo() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAuthInfo must be used within AuthInfoProvider');
  return ctx;
}
