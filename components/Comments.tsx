'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { motion } from 'framer-motion'

export default function Comments({ slug }: { slug: string }) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)

  const commentsConfig = siteMetadata.comments as { giscusConfig: Record<string, string> }
  const { giscusConfig } = commentsConfig

  const currentTheme =
    theme === 'dark' || resolvedTheme === 'dark' ? giscusConfig.darkTheme : giscusConfig.theme

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !commentRef.current) return

    commentRef.current.innerHTML = ''

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
  }, [
    mounted,
    currentTheme,
    slug,
    giscusConfig.category,
    giscusConfig.categoryId,
    giscusConfig.repo,
    giscusConfig.repositoryId,
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
          <h2 className="mb-8 text-lg font-bold text-gray-900 dark:text-gray-100">交流討論</h2>
          <div ref={commentRef} className="giscus" />
        </div>
      </div>
    </motion.div>
  )
}
