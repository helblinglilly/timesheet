'use client';

import React, { createContext, useContext } from 'react';

interface TimesheetDayContextType {
  timesheetId: string;
  day: string;
}

const Context = createContext<TimesheetDayContextType | undefined>(undefined);

export function TimesheetDayProvider({
  timesheetId,
  day,
  children,
}: TimesheetDayContextType & { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ timesheetId, day }}>
      {children}
    </Context.Provider>
  );
}

export function useTimesheetDay() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useTimesheetDay must be used within TimesheetDayProvider');
  return ctx;
}
