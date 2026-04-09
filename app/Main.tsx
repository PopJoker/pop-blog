'use client'

import { motion, Variants } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import readingTimeEstimator from 'reading-time' // 建議改用 import
import { useState } from 'react'

const MAX_DISPLAY = 6

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const, // This 'as const' is the key fix
    },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function Home({ posts }) {
  const featuredPosts = posts.slice(0, 2)
  const recentPosts = posts.slice(2, MAX_DISPLAY)
  const [copyLabel, setCopyLabel] = useState('mavericktu0@gmail.com')
  const discordLink = 'https://discord.gg/b5QSSdu3VW'
  const handleCopy = () => {
    navigator.clipboard.writeText('mavericktu0@gmail.com')
    setCopyLabel('已複製 Email！')
    setTimeout(() => setCopyLabel('mavericktu0@gmail.com'), 2000)
  }

  return (
    <div className="mb-20 space-y-24">
      {/* 🚀 Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 mb-4 rounded-full px-3 py-1 text-sm font-medium"
          >
            PopJ0ker.exe
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl dark:from-white dark:via-gray-200 dark:to-gray-500"
          >
            把想法轉化成
            <br />
            可被看見的作品
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            {siteMetadata.description}
            <br />
            <br />
            在工作的推動下，我的技術領域持續擴展。從最初的 App 與 Web 應用開發出發，逐步接觸 PLC
            控制系統，並延伸至韌體、硬體與通訊開發，進一步參與 Server 建置與系統架構設計與重構。
            這段歷程讓我從單一領域的工程師，逐漸成長為具備跨系統整合能力的開發者。
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex flex-col items-center gap-6">
            {/* 按鈕組：現在有三個主要動作 */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/blog"
                className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Read Blog
              </Link>

              <Link
                href="/about"
                className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                About Me
              </Link>

              {/* 👾 Discord 按鈕 */}
              <Link
                href={discordLink}
                className="flex items-center gap-2 rounded-full border border-[#5865F2] px-6 py-3 text-sm font-semibold text-[#5865F2] transition-all hover:bg-[#5865F2] hover:text-white dark:border-[#5865F2]"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  {/* 這次是有眼睛的版本 👀 */}
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
                Discord
              </Link>
            </div>

            {/* 下方 Email 快速複製小工具 */}
            <div
              onClick={handleCopy}
              className="group hover:text-primary-500 flex cursor-pointer items-center gap-2 text-xs text-gray-500 transition-colors"
            >
              <span>或來信談談：</span>
              <span className="font-mono underline underline-offset-4">{copyLabel}</span>
              <svg
                className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 🌟 Featured Posts */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Featured Posts</h2>
            <p className="text-gray-500 dark:text-gray-400">Hand-picked stories worth your time.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} featured />
          ))}
        </div>
      </section>

      {/* 📝 Recent Posts */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Recent Updates</h2>
          <Link href="/blog" className="group text-primary-500 text-sm font-semibold">
            View all posts{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}

function PostCard({ post, featured = false }) {
  const { slug, date, title, summary, tags, body } = post

  // 修正：優先使用 body 內容計算，如果都沒有則給預設值避免錯誤
  const contentToEstimate = body?.raw || summary || ''
  const stats = readingTimeEstimator(contentToEstimate)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group hover:border-primary-500/50 hover:shadow-primary-500/10 relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900/50 ${
        featured ? 'min-h-[320px] md:p-8' : 'min-h-[240px]'
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{post.readingTime.text}</span>
          </div>
          <div className="flex gap-2">
            {tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="text-primary-500 text-xs font-medium tracking-wider uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <Link href={`/blog/${slug}`} className="mt-4 block">
          <h3
            className={`${featured ? 'text-2xl' : 'text-xl'} leading-tight font-bold text-gray-900 dark:text-gray-100`}
          >
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </Link>
      </div>

      <div className="mt-6 flex items-center">
        <Link href={`/blog/${slug}`} className="text-sm font-bold text-gray-900 dark:text-white">
          Read Article{' '}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </motion.div>
  )
}
