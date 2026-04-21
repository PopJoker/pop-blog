'use client'

import {
  motion,
  Variants,
  useReducedMotion,
} from 'framer-motion'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useEffect, useState, useMemo } from 'react'
import readingTimeEstimator from 'reading-time'
import SpotlightCard from '@/components/components/SpotlightCard'

const MAX_DISPLAY = 6

// 🚀 動效優化：移除 Blur 與複雜濾鏡，改用硬體加速
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
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
    const typingSpeed = isDeleting ? 30 : 60

    if (!isDeleting) {
      if (displayText.length < current.length) {
        timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1))
        }, typingSpeed)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 4000)
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
  const featuredPosts = useMemo(() => posts.slice(0, 2), [posts])
  const recentPosts = useMemo(() => posts.slice(2, MAX_DISPLAY), [posts])
  const shouldReduceMotion = useReducedMotion()

  const [copyLabel, setCopyLabel] = useState('mavericktu0@gmail.com')

  const handleCopy = () => {
    navigator.clipboard.writeText('mavericktu0@gmail.com')
    setCopyLabel('已複製 Email！')
    setTimeout(() => setCopyLabel('mavericktu0@gmail.com'), 2000)
  }

  const discordLink = 'https://discord.gg/b5QSSdu3VW'
  const slogans = [
    '把想法做成可被看見的作品',
    '用程式打造有價值的體驗',
    '定義/實踐/進化',
    '不預測未來，我們編寫它',
    '創意值得一個更強大的載體',
  ]

  const displayText = useTypewriter(slogans)

  return (
    <div className="mb-20 space-y-10">
      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* 🌈 背景優化：移除 blur-3xl 這種極耗能的動態濾鏡，改用透明度與輕微位移 */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] transform-gpu"
            animate={shouldReduceMotion ? {} : {
              x: [0, 20, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[100px] transform-gpu"
            animate={shouldReduceMotion ? {} : {
              x: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-4 rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium text-primary-500 dark:bg-primary-500/20"
          >
            PopJ0ker Workshop
          </motion.div>

          <h1 className="px-4 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="relative inline-block min-h-[1.2em] w-full">
              {displayText.split('').map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.015 }}
                  className="inline-block bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-500"
                  style={{ willChange: 'opacity, transform' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.span
                className="ml-1 inline-block h-[0.8em] w-1 bg-gray-400 transform-gpu dark:bg-gray-500"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </span>
          </h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            {siteMetadata.description}
          </motion.p>

          {/* ⚡ CTA BUTTONS */}
          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap justify-center gap-4 px-4">
            <Link
              href="/blog"
              className="group relative overflow-hidden rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-transform active:scale-95 dark:bg-white dark:text-black"
            >
              <span className="relative z-10">Read Blog</span>
              {!shouldReduceMotion && (
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40">
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-md" />
                </span>
              )}
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              About Me
            </Link>

            {/* ✅ Discord 按鈕回歸 */}
            <Link
              href={discordLink}
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#5865F2] px-6 py-3 text-sm font-semibold text-[#5865F2] transition-all hover:scale-105 hover:text-white active:scale-95"
            >
              <span className="absolute inset-0 w-0 bg-[#5865F2] transition-all duration-300 group-hover:w-full" />
              <svg className="relative z-10 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
              </svg>
              <span className="relative z-10">Discord</span>
            </Link>
          </motion.div>

          <button
            onClick={handleCopy}
            className="group mt-8 flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-primary-500"
          >
            <span>或來信談談：</span>
            <span className="font-mono underline underline-offset-4">{copyLabel}</span>
          </button>
        </motion.div>
      </section>

      {/* 🌟 POSTS SECTION */}
      <div className="space-y-16">
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
            <Link href="/blog" className="text-sm font-semibold text-primary-500 hover:underline">
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
  const stats = readingTimeEstimator(body?.raw || summary || '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="transform-gpu"
    >
      <SpotlightCard className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <div className="text-sm text-gray-500">
              {formatDate(date)} • {stats.text}
            </div>
            <Link href={`/blog/${slug}`} className="group">
              <h3 className="mt-3 text-xl font-bold transition-colors group-hover:text-primary-500">
                {title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{summary}</p>
            </Link>
          </div>
          <div className="mt-4 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <span>Read Article</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
