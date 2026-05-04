const { withContentlayer } = require('next-contentlayer2')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  reactStrictMode: true,
  trailingSlash: true,

  // 1. Turbopack 配置保留
  turbopack: {
    root: process.cwd(),
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // ❌ 删除了原本在这里的 theme 属性
  // 因为 theme 应该写在 tailwind.config.js 里，而不是 next.config.js

  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    unoptimized: true,
  },

  // ❌ 删除了 async headers() 整个函数
  // 因为你开启了 output: 'export'，Next.js 不允许在静态导出中使用 headers

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = withBundleAnalyzer(withContentlayer(nextConfig))
