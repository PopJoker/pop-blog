'use client'

import { motion, Variants } from 'framer-motion'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useEffect, useState, useMemo } from 'react'
import readingTimeEstimator from 'reading-time'
import SpotlightCard from '@/components/components/SpotlightCard'

const MAX_DISPLAY = 6

// 簡化動畫曲線，對手機端更友好
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
}

function useTypewriter(slogans: string[]) {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = slogans[index]
    let timeout: NodeJS.Timeout

    // 調節速度，避免過高頻率的 State 更新
    const typingSpeed = isDeleting ? 30 : 60

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 3000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length - 1))
        }, typingSpeed)
      } else {
        setIsDeleting(false)
        setIndex((prev) => (prev + 1) % slogans.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, index, slogans])

  return displayText
}

export default function Home({ posts }) {
  const featuredPosts = posts.slice(0, 2)
  const recentPosts = posts.slice(2, MAX_DISPLAY)
  const [copyLabel, setCopyLabel] = useState('mavericktu0@gmail.com')

  const slogans = useMemo(
    () => [
      '把想法做成可被看見的作品',
      '用程式打造有價值的體驗',
      '定義/實踐/進化',
      '不預測未來，我們編寫它',
      '創意值得一個更強大的載體',
    ],
    []
  )

  const displayText = useTypewriter(slogans)

  const handleCopy = () => {
    navigator.clipboard.writeText('mavericktu0@gmail.com')
    setCopyLabel('已複製 Email！')
    setTimeout(() => setCopyLabel('mavericktu0@gmail.com'), 2000)
  }

  return (
    <div className="mb-20 space-y-10 overflow-x-hidden">
      {/* 🚀 HERO */}
      <section className="relative pt-24 pb-20">
        <div className="absolute inset-0 -z-10">
          {/* 只在桌面端執行複雜動畫，手機端使用靜態漸層 */}
          <motion.div
            className="fixed -top-32 -left-32 hidden h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-3xl md:block"
            animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex transform-gpu flex-col items-center text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 mb-4 rounded-full px-3 py-1 text-sm font-medium"
          >
            PopJ0ker Workshop
          </motion.div>

          <h1 className="min-h-[1.2em] px-4 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="transform-gpu bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-500">
              {displayText}
              <span className="ml-1 inline-block h-[0.8em] w-1 animate-pulse bg-gray-400 align-middle dark:bg-gray-500" />
            </span>
          </h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl px-6 text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            {siteMetadata.description}
          </motion.p>

          {/* ⚡ CTA */}
          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95 dark:bg-white dark:text-black"
            >
              Read Blog
            </Link>

            <Link
              href="https://discord.gg/b5QSSdu3VW"
              className="flex items-center gap-2 rounded-full border border-[#5865F2] px-6 py-3 text-sm font-semibold text-[#5865F2] transition-colors active:bg-[#5865F2] active:text-white"
            >
              Discord
            </Link>
          </motion.div>

          <button
            onClick={handleCopy}
            className="hover:text-primary-500 mt-6 flex items-center gap-2 text-xs text-gray-500 transition-colors"
          >
            <span>或來信談談：</span>
            <span className="font-mono underline underline-offset-4">{copyLabel}</span>
          </button>
        </motion.div>
      </section>

      {/* 🌟 Featured & Recent */}
      <div className="transform-gpu space-y-16 px-4 md:px-0">
        <section className="space-y-8">
          <h2 className="text-3xl font-bold">Featured Posts</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Updates</h2>
            <Link href="/blog" className="text-primary-500 text-sm font-semibold">
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {recentPosts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function PostCard({ post, index }) {
  const { slug, date, title, summary, body } = post
  const stats = useMemo(() => readingTimeEstimator(body?.raw || summary || ''), [body, summary])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.03 }}
      // 手機端關閉 Hover 縮放以提升反應速度
      whileHover={typeof window !== 'undefined' && window.innerWidth > 768 ? { scale: 1.02 } : {}}
      className="transform-gpu"
    >
      <SpotlightCard className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="relative z-10 flex h-full flex-col">
          <div className="text-sm text-gray-500">
            {formatDate(date)} • {stats.text}
          </div>

          <Link href={`/blog/${slug}`} className="flex-grow">
            <h3 className="group-hover:text-primary-500 mt-3 text-xl font-bold transition-colors">
              {title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{summary}</p>
          </Link>

          <div className="mt-4 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <span>Read Article</span>
            <span className="ml-1">→</span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
