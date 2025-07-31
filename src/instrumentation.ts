export async function register(){
  // This runs before the env
  // eslint-disable-next-line no-restricted-syntax
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('newrelic')
  }
}
