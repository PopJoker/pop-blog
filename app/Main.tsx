'use client'

import { motion, Variants } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

// 定義動畫變體
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  },
}

export default function Home({ posts }) {
  return (
    <div className="relative overflow-hidden">
      {/* 🔮 背景光暈優化 */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[100px]"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-gray-200 dark:divide-gray-700"
      >
        {/* 🚀 標題區塊 */}
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <motion.h1
            variants={itemVariants}
            className="text-4xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-5xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100"
          >
            Latest Updates
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg leading-7 text-gray-500 dark:text-gray-400"
          >
            {siteMetadata.description}
          </motion.p>
        </div>

        {/* 📝 文章列表 */}
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {!posts.length && <p className="py-10 text-center text-gray-500">No posts found.</p>}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <motion.li
                key={slug}
                variants={itemVariants}
                viewport={{ once: true }}
                className="group py-12 transition-all duration-300"
              >
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">Published on</dt>
                      <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3">
                      <div className="space-y-6">
                        <div>
                          <motion.h2
                            whileHover={{ x: 4 }}
                            className="text-2xl leading-8 font-bold tracking-tight"
                          >
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 transition-colors duration-300 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                            >
                              {title}
                            </Link>
                          </motion.h2>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose line-clamp-2 max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base leading-6 font-medium">
                        <Link
                          href={`/blog/${slug}`}
                          className="group inline-flex items-center text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more
                          <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                            &rarr;
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>

      {/* 🔗 Footer 區域 */}
      <footer className="mt-8 space-y-12">
        {posts.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base leading-6 font-medium">
            <Link
              href="/blog"
              className="text-primary-500 transition-all hover:text-primary-600 dark:hover:text-primary-400"
              aria-label="All posts"
            >
              All Posts &rarr;
            </Link>
          </div>
        )}

        {siteMetadata.newsletter?.provider && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center rounded-2xl bg-gray-50 p-8 dark:bg-gray-800/50"
          >
            <NewsletterForm />
          </motion.div>
        )}
      </footer>
    </div>
  )
}