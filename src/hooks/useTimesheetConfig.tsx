"use client";

import React, { createContext, useContext } from "react";
import type { TimesheetConfig } from "~/pocketbase/data.types";

type TimesheetDayContextType = {
  config: TimesheetConfig
};

const Context = createContext<TimesheetDayContextType | undefined>(undefined);

export function TimesheetConfigProvider({
  config,
  children,
}: TimesheetDayContextType & { children: React.ReactNode }) {
  return (
    <Context.Provider value={{ config }}>
      {children}
    </Context.Provider>
  );
}

export function useTimesheetConfig() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useTimesheetConfig must be used within TimesheetDayProvider");
  return ctx;
}
