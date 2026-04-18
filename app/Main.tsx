'use client'

import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionTemplate,
  useSpring,
  Variants,
} from 'framer-motion'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import { useEffect, useState } from 'react'
import readingTimeEstimator from 'reading-time'

const MAX_DISPLAY = 6

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

export default function Home({ posts }) {
  const featuredPosts = posts.slice(0, 2)
  const recentPosts = posts.slice(2, MAX_DISPLAY)

  const [copyLabel, setCopyLabel] = useState('mavericktu0@gmail.com')

  const handleCopy = () => {
    navigator.clipboard.writeText('mavericktu0@gmail.com')
    setCopyLabel('已複製 Email！')
    setTimeout(() => setCopyLabel('mavericktu0@gmail.com'), 2000)
  }

  const discordLink = 'https://discord.gg/b5QSSdu3VW'

  const slogans = [
    '把想法轉化成可被看見的作品',
    '用程式打造你的第二個大腦',
    '讓設計與工程一起發生',
    '從靈感到實作，只差一個開始',
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const len = slogans.length

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % len)
    }, 8000)

    return () => clearInterval(timer)
  }, [slogans.length])

  return (
    <div className="mb-20 space-y-10">
      {/* 🚀 HERO */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* 🌈 背景（低調 Aurora） */}
        <div className="relative inset-0 -z-10 overflow-hidden">
          <motion.div
            className="fixed -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl"
            animate={{
              x: [0, 80, -40, 0],
              y: [0, 60, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="fixed -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl"
            animate={{
              x: [0, -60, 40, 0],
              y: [0, -40, 60, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10"
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
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
            className="bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 mb-4 rounded-full px-3 py-1 text-sm font-medium"
          >
            PopJ0ker Workshop
          </motion.div>

          {/* ✨ Split Text（核心升級） */}
          <h1 className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl dark:from-white dark:via-gray-200 dark:to-gray-500">
            <AnimatePresence mode="wait">
              <motion.span
                key={slogans[index]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {slogans[index].split('').map((char, i) => (
                  <motion.span
                    key={`${slogans[index]}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.03,
                      duration: 0.4,
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </AnimatePresence>
          </h1>
          {/* <h1 className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl dark:from-white dark:via-gray-200 dark:to-gray-500">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {slogans[index]}
            </motion.span>
          </h1> */}

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400"
          >
            {siteMetadata.description}
          </motion.p>

          {/* ⚡ CTA */}
          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/blog"
              className="group relative overflow-hidden rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:scale-105 dark:bg-white dark:text-black"
            >
              <span className="relative z-10">Read Blog</span>
              <span className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-40">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 blur-md" />
              </span>
            </Link>

            <Link
              href="/about"
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              About Me
            </Link>
            <Link
              href={discordLink}
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#5865F2] px-6 py-3 text-sm font-semibold text-[#5865F2] transition hover:scale-105 hover:text-white"
            >
              {/* 背景動畫 */}
              <span className="absolute inset-0 scale-0 rounded-full bg-[#5865F2] transition-transform duration-300 group-hover:scale-100" />

              {/* icon */}
              <svg className="relative z-10 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.076.076 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
              </svg>

              <span className="relative z-10">Discord</span>
            </Link>
          </motion.div>

          {/* 📩 Email */}
          <button
            onClick={handleCopy}
            className="group hover:text-primary-500 mt-6 flex items-center gap-2 text-xs text-gray-500 transition"
          >
            <span>或來信談談：</span>
            <span className="font-mono underline underline-offset-4">{copyLabel}</span>
          </button>
        </motion.div>
      </section>

      {/* 🌟 Featured */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Featured Posts</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredPosts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} featured />
          ))}
        </div>
      </section>

      {/* 📝 Recent */}
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
  )
}

function PostCard({ post, index, featured = false }) {
  const { slug, date, title, summary, body } = post
  const stats = readingTimeEstimator(body?.raw || summary || '')

  // --- 滑鼠追蹤邏輯開始 ---
  const mouseX = motionValue(0)
  const mouseY = motionValue(0)

  // 使用 spring 讓光效跟隨時更平滑，不會太生硬
  const springConfig = { damping: 20, stiffness: 150 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // 將座標轉換為 CSS 變數或直接應用於 background
  const background = useMotionTemplate`
    radial-gradient(
      650px circle at ${smoothX}px ${smoothY}px,
      rgba(99, 102, 241, 0.15),
      transparent 80%
    )
  `

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }
  // --- 滑鼠追蹤邏輯結束 ---

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onMouseMove={handleMouseMove} // 綁定滑鼠移動事件
      whileHover={{
        scale: 1.02,
        y: -5,
      }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-colors dark:border-gray-800 dark:bg-gray-900/50"
    >
      {/* ✨ 滑鼠跟隨光效 (Spotlight) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      {/* 為了防止光效遮擋文字，內容需放在 relative 層 */}
      <div className="relative z-10">
        <div className="text-sm text-gray-500">
          {formatDate(date)} • {stats.text}
        </div>

        <Link href={`/blog/${slug}`}>
          <h3 className="mt-3 text-xl font-bold transition-colors group-hover:text-indigo-500 dark:group-hover:text-indigo-400">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{summary}</p>
        </Link>

        <div className="mt-4 flex items-center text-sm font-semibold text-gray-900 dark:text-white">
          <span>Read Article</span>
          <motion.span
            className="ml-1"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
