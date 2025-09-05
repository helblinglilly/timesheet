'use client';

import React from 'react';
import { useTimesheetConfig } from '~/hooks/useTimesheetConfig';

export const Title = () => {
  const { config } = useTimesheetConfig();

  return (
    <h1 className="text-2xl font-semibold">{config.name}</h1>
  );
};
