import newrelic from 'newrelic';

/**
 * Wraps the provided async function in a New Relic web transaction.
 *
 * @param name - The name of the transaction (will appear in New Relic).
 * @param fn - The async function to execute within the transaction.
 * @returns The result of the async function.
 */
export async function withNewRelicWebTransaction<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    newrelic.startWebTransaction(name, () => {
      const transaction = newrelic.getTransaction();
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
