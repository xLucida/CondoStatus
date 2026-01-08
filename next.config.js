const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js', 'pdfjs-dist', 'canvas'],
  },
  webpack: (config, { isServer }) => {
    // Enable top-level await for pdfjs-dist
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    
    // Handle encoding alias for server-side
    config.resolve.alias.encoding = false;
    
    // Externalize canvas for server-side to use native bindings
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas');
      }
    }
    return config;
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  hideSourceMaps: true,
};

// Only wrap with Sentry if DSN is configured
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
