import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // 確保 siteUrl 沒有結尾斜線
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => {
      // 確保 path 開頭沒有斜線，避免拼出雙斜線 //
      const cleanPath = post.path.startsWith('/') ? post.path.slice(1) : post.path
      const dateStr = post.lastmod || post.date
      
      return {
        url: `${siteUrl}/${cleanPath}`,
        // 轉成純 YYYY-MM-DD 格式，避免 ISO 毫秒與時區格式解析異常
        lastModified: dateStr ? new Date(dateStr).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }
    })

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: route ? `${siteUrl}/${route}` : siteUrl,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
