import 'server-only';
import type newrelic from 'newrelic';

type NewRelicAgent = typeof newrelic;

function getAgent(): NewRelicAgent | null {
  // eslint-disable-next-line no-restricted-syntax
  if (!process.env.NEW_RELIC_LICENSE_KEY) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('newrelic') as NewRelicAgent;
  } catch {
    return null;
  }
}

export function getBrowserTimingHeader(): string {
  try {
    return getAgent()?.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true,
    }) ?? '';
  } catch {
    return '';
  }
}
