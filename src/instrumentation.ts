export async function register() {
  // This is deliberate as it runs before the env file is loaded
  // eslint-disable-next-line no-restricted-syntax
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('newrelic');
  }
}
