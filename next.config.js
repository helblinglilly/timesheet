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
};

export default config;
