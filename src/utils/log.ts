/* eslint-disable no-console */

import type newrelic from 'newrelic';
import type { LogEvent } from 'newrelic';
type NewRelicAgent = typeof newrelic;

type BrowserNewRelic = Pick<NewRelicAgent, 'noticeError'> & {
  log: (
    message: string,
    options?: Pick<LogEvent, 'level' | 'timestamp'> & {
      customAttributes?: Record<string, unknown>;
    },
  ) => void;
};

declare global {
  interface Window {
    newrelic?: BrowserNewRelic;
  }
}

function getServerAgent(): NewRelicAgent | null {
  // The `window` global is undefined in Node.js — use that as the server guard.
  if (typeof window !== 'undefined') return null;
  // eslint-disable-next-line no-restricted-syntax
  if (!process.env.NEW_RELIC_LICENSE_KEY) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('newrelic') as NewRelicAgent;
  } catch {
    return null;
  }
}

const log = {
  info: (message: string) => {
    console.info(message);
    try {
      const agent = getServerAgent();
      if (agent) {
        agent.recordLogEvent({ message, level: 'info' });
      } else {
        window.newrelic?.log(message, { level: 'INFO' });
      }
    } catch { }
  },

  warning: (message: string) => {
    console.warn(message);
    try {
      const agent = getServerAgent();
      if (agent) {
        agent.recordLogEvent({ message, level: 'warn' });
      } else {
        window.newrelic?.log(message, { level: 'WARN' });
      }
    } catch { }
  },

  error: (message: string, error: unknown, expected?: boolean) => {
    console.error(message, error);
    try {
      const err = error instanceof Error ? error : new Error(message);
      const agent = getServerAgent();
      if (agent) {
        agent.noticeError(err, expected);
      } else {
        window.newrelic?.noticeError(err);
      }
    } catch { }
  },
};

export default log;
