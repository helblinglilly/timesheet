"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type TickContextType = {
  tick: number;
  retick: () => void;
};

const TickContext = createContext<TickContextType | undefined>(undefined);

export const TickProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  const retrigger = useCallback(() => {
    setTick(tick => tick + 1);
  }, []);

  return (
    <TickContext.Provider value={{ tick, retick: retrigger }}>
      {children}
    </TickContext.Provider>
  );
};

export const useTick = () => {
  const context = useContext(TickContext);
  if (!context) throw new Error('useTick must be used within a TickProvider');
  return context;
};
