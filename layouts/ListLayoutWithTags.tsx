'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

// 模擬 React Bits 的 Spotlight Card 效果
const SpotlightCard = ({ children, className = '' }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return

    const div = divRef.current
    const rect = div.getBoundingClientRect()

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => setOpacity(0)

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/50 ${className}`}
    >
      {/* 💡 第一層：背景柔光 (Ambient Glow) */}
      <div
        className="pointer-events-none absolute -inset-px z-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.06), transparent 40%)`,
        }}
      />

      {/* 💡 第二層：邊框精確高光 (Border Spotlight) */}
      {/* 利用 mask-image 只讓邊框部分顯示出 gradient */}
      <div
        className="pointer-events-none absolute -inset-px z-10 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(300px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.4), transparent 80%)`,
          WebkitMaskImage: `linear-gradient(white, white) content-box, linear-gradient(white, white)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px', // 這裡的寬度決定了高光邊框的粗細
        }}
      />

      {/* 內容物需確保在光效之上 */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-10 pb-8 md:space-y-5">
      <nav className="flex items-center justify-between">
        {!prevPage ? (
          <button className="cursor-auto text-sm disabled:opacity-50" disabled>
            上一個
          </button>
        ) : (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            className="hover:text-primary-500 text-sm transition-colors"
          >
            ← Previous
          </Link>
        )}
        <span className="text-sm font-medium text-gray-500">
          {currentPage} / {totalPages}
        </span>
        {!nextPage ? (
          <button className="cursor-auto text-sm disabled:opacity-50" disabled>
            下一個
          </button>
        ) : (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            className="hover:text-primary-500 text-sm transition-colors"
          >
            Next →
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-16">
        {/* Sidebar Tags */}
        <aside className="hidden w-64 flex-none lg:block">
          <div className="sticky top-24 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-800/30">
            <h3 className="text-primary-500 mb-4 text-xs font-bold tracking-widest uppercase">
              文章分類
            </h3>
            <nav className="space-y-1">
              <Link
                href="/blog"
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/blog'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                全部文章 ({posts.length})
              </Link>
              {sortedTags.map((t) => (
                <Link
                  key={t}
                  href={`/tags/${slug(t)}`}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    decodeURI(pathname.split('/tags/')[1]) === slug(t)
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {`${t} (${tagCounts[t]})`}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Post List */}
        <main className="flex-1">
          <ul className="space-y-8">
            {displayPosts.map((post, index) => {
              const { path, date, title, summary, tags } = post
              return (
                <motion.li
                  key={path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <SpotlightCard>
                    <article className="space-y-4">
                      <div className="space-y-2">
                        <dl className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <dt className="sr-only">Published on</dt>
                          <dd className="font-medium">
                            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                          </dd>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">/</span>
                          <dd>{post.readingTime.text}</dd>
                        </dl>
                        <h2 className="text-2xl leading-8 font-bold tracking-tight">
                          <Link
                            href={`/${path}`}
                            className="hover:text-primary-500 dark:hover:text-primary-400 text-gray-900 transition-colors dark:text-gray-100"
                          >
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {tags?.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <div className="prose line-clamp-3 max-w-none text-gray-600 dark:text-gray-400">
                        {summary}
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/${path}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center text-sm font-semibold"
                          aria-label={`Read "${title}"`}
                        >
                          閱讀更多 <span className="ml-1">→</span>
                        </Link>
                      </div>
                    </article>
                  </SpotlightCard>
                </motion.li>
              )
            })}
          </ul>
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </main>
      </div>
    </div>
  )
}
