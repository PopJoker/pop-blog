import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl.replace(/\/$/, '')

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => {
      const cleanPath = post.path.startsWith('/') ? post.path.slice(1) : post.path
      const dateStr = post.lastmod || post.date
      const formattedDate = dateStr
        ? new Date(dateStr).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]

      return {
        url: `${siteUrl}/${cleanPath}`,
        lastModified: formattedDate,
      }
    })

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: route ? `${siteUrl}/${route}` : siteUrl,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
