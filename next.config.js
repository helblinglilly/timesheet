/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // We're using middleware for i18n routing
  // instead of built-in i18n support
  output: "standalone",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent the newrelic Node.js agent from being bundled into client-side code.
      // The dynamic require('newrelic') in log.ts is already guarded by a
      // typeof window !== 'undefined' check, so it will never run on the client.
      config.externals = [...(config.externals ?? []), 'newrelic'];
    }
    return config;
  },
};

export default config;
