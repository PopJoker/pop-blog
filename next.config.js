const { withContentlayer } = require('next-contentlayer2') // Use 'next-contentlayer' if not using the fork
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 強制開啟 export 模式與 basePath
  output: 'export',
  basePath: '/pop-blog',
  reactStrictMode: true,
  trailingSlash: true,
  // Note: Contentlayer does not support Turbopack yet.
  // If you use 'next dev --turbo', Contentlayer won't auto-generate.
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  theme: {
    extend: {
      animation: {
        'infinite-scroll': 'infinite-scroll 10s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
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
    // 💡 修改 2: GitHub Pages 必改！強制關閉圖片優化
    // 這是解決圖片刷不出來的關鍵
    unoptimized: true,
  },
  async headers() {
    // Only apply headers if not exporting to static HTML
    if (process.env.EXPORT) return []

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
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

// Wrap the config with both Contentlayer and BundleAnalyzer
module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
