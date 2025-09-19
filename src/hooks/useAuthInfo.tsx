'use client';

import React, { createContext, useContext } from 'react';

interface AuthInfoContextType {
  user?: {
    id: string;
    email: string;
  };
}

const Context = createContext<AuthInfoContextType | undefined>(undefined);

export function AuthInfoProvider({
  user,
  children,
}: AuthInfoContextType & { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ user }}>
      {children}
    </Context.Provider>
  );
}

export function useAuthInfo() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useAuthInfo must be used within AuthInfoProvider');
  return ctx;
}
