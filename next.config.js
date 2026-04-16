const { withContentlayer } = require('next-contentlayer')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(
  withContentlayer({
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
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;",
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()',
            },
          ],
        },
      ]
    },

    webpack: (config) => {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      return config
    },
  })
)