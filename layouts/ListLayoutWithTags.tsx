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
import { useRef, useState } from 'react'

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
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return

    const div = divRef.current
    const rect = div.getBoundingClientRect()

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleMouseEnter = () => {
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-8 py-6 transition-all duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--primary-rgb), 0.1), transparent 40%)`,
        }}
      />
      {children}
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
      <nav className="flex justify-between items-center">
        {!prevPage ? (
          <button className="cursor-auto disabled:opacity-50 text-sm" disabled>上一個</button>
        ) : (
          <Link href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`} className="hover:text-primary-500 transition-colors text-sm">
            ← Previous
          </Link>
        )}
        <span className="text-sm font-medium text-gray-500">
          {currentPage} / {totalPages}
        </span>
        {!nextPage ? (
          <button className="cursor-auto disabled:opacity-50 text-sm" disabled>下一個</button>
        ) : (
          <Link href={`/${basePath}/page/${currentPage + 1}`} className="hover:text-primary-500 transition-colors text-sm">
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
          className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-16">
        {/* Sidebar Tags */}
        <aside className="hidden lg:block w-64 flex-none">
          <div className="sticky top-24 rounded-2xl bg-gray-50/50 p-6 dark:bg-gray-800/30 backdrop-blur-md border border-gray-100 dark:border-gray-800">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-primary-500">
              文章分類
            </h3>
            <nav className="space-y-1">
              <Link
                href="/blog"
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === '/blog'
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
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${decodeURI(pathname.split('/tags/')[1]) === slug(t)
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
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link href={`/${path}`} className="text-gray-900 transition-colors hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400">
                            {title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {tags?.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-600 dark:text-gray-400 line-clamp-3">
                        {summary}
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/${path}`}
                          className="text-sm font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center"
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