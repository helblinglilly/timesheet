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

export async function withNewRelicWebTransaction<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const agent = getAgent();

  if (!agent) {
    return fn();
  }

  return await new Promise<T>((resolve, reject) => {
    agent.startWebTransaction(name, () => {
      const transaction = agent.getTransaction();
      (async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (err) {
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          reject(err);
        } finally {
          transaction.end();
        }
      })().catch((err) => {
        // Catch any unexpected errors in the async IIFE
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(err);
        transaction.end();
      });
    });
  });
}
