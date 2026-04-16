const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = () => {
  return {
    output: process.env.EXPORT ? 'export' : undefined,
    basePath: process.env.BASE_PATH || undefined,
    reactStrictMode: true,
    trailingSlash: true,
    turbopack: {
      root: process.cwd(),
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized: process.env.UNOPTIMIZED ? true : undefined,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;",
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
          ],
        },
      ]
    },
    webpack: (config, options) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  }
}
