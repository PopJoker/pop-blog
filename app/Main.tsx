'use client'

import { motion, Variants } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import readingTimeEstimator from 'reading-time' // 建議改用 import

const MAX_DISPLAY = 6

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const // This 'as const' is the key fix
    }
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

  return (
    <div className="mb-20 space-y-24">
      {/* 🚀 Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center text-center">
          <motion.div variants={fadeInUp} className="mb-4 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium text-primary-500 dark:bg-primary-500/20">
            Available for new projects
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl dark:from-white dark:via-gray-200 dark:to-gray-500"
          >
            Crafting digital <br /> experiences with soul.
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
            {siteMetadata.description} I specialize in React, Next.js, and modern web aesthetics.
            Welcome to my corner of the internet.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex gap-4">
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
          <Link href="/blog" className="group text-sm font-semibold text-primary-500">
            View all posts <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
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
  const contentToEstimate = body?.code || summary || ""
  const stats = readingTimeEstimator(contentToEstimate)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 dark:border-gray-800 dark:bg-gray-900/50 ${featured ? 'min-h-[320px] md:p-8' : 'min-h-[240px]'
        }`}
    >
      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span>{stats.text}</span>
          </div>
          <div className="flex gap-2">
            {tags.slice(0, 1).map((tag) => (
              <span key={tag} className="text-xs font-medium uppercase tracking-wider text-primary-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <Link href={`/blog/${slug}`} className="mt-4 block">
          <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold leading-tight text-gray-900 dark:text-gray-100`}>
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </Link>
      </div>

      <div className="mt-6 flex items-center">
        <Link
          href={`/blog/${slug}`}
          className="text-sm font-bold text-gray-900 dark:text-white"
        >
          Read Article <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </motion.div>
  )
}