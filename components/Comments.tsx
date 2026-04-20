'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { motion } from 'framer-motion'

export default function Comments({ slug }: { slug: string }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)

  // 1. 修复 Error: Unexpected any.
  // 这里不再使用 as any，而是直接安全访问。如果 siteMetadata 结构正确，TypeScript 应该能推断。
  // 如果还有报错，可以使用 (siteMetadata.comments as Record<string, any>) 绕过
  const commentsConfig = siteMetadata.comments as { giscusConfig: Record<string, string> }
  const { giscusConfig } = commentsConfig

  const currentTheme =
    theme === 'dark' || resolvedTheme === 'dark' ? giscusConfig.darkTheme : giscusConfig.theme

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !commentRef.current) return

    // 每次主题或 Slug 改变时，先清空旧的留言区
    commentRef.current.innerHTML = ''

    // 手动建立 Giscus 脚本
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', giscusConfig.repo)
    script.setAttribute('data-repo-id', giscusConfig.repositoryId)
    script.setAttribute('data-category', giscusConfig.category)
    script.setAttribute('data-category-id', giscusConfig.categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-lang', 'zh-TW')
    script.setAttribute('data-theme', currentTheme)
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    commentRef.current.appendChild(script)

    // 2. 修复 Warning: React Hook useEffect has missing dependencies.
    // 按照报错提示，把 giscusConfig 的相关属性都放进依赖数组
  }, [
    mounted,
    currentTheme,
    slug,
    giscusConfig.category,
    giscusConfig.categoryId,
    giscusConfig.repo,
    giscusConfig.repositoryId
  ])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12 border-t border-gray-100 pt-12 dark:border-gray-800"
    >
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 xl:p-8 dark:border-gray-800 dark:bg-gray-900/50">
          <h2 className="mb-8 text-lg font-bold text-gray-900 dark:text-gray-100">交流讨论</h2>
          <div ref={commentRef} className="giscus" />
        </div>
      </div>
    </motion.div>
  )
}