
'use client';

import React, { createContext, useContext } from 'react';
import type { DomainConfig } from '~/features/domain';



const Context = createContext<DomainConfig | undefined>(undefined);

export function DomainConfigProvider({
  values,
  children,
}: {
  values: DomainConfig,
  children: React.ReactNode;
}) {
  return (
    <Context.Provider value={values}>
      {children}
    </Context.Provider>
  );
}

export function useDomainConfig() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useDomainConfig must be used within DomainConfigProvider');
  return ctx;
}
