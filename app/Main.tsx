'use client'

import { motion } from 'framer-motion'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* 🔥 標題動畫 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >

            <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
              Latest
            </h1>
            <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
              {siteMetadata.description}
            </p>
          </motion.div>

          {/* 🔥 文章列表 */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {!posts.length && 'No posts found.'}

            {posts.slice(0, MAX_DISPLAY).map((post, i) => {
              const { slug, date, title, summary, tags } = post
              return (
                <motion.li
                  key={slug}
                  className="py-12"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <article>
                    <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>

                      <div className="space-y-5 xl:col-span-3">
                        <div className="space-y-6">
                          <div>
                            {/* 🔥 標題 hover 動畫 */}
                            <motion.h2
                              whileHover={{ y: -2 }}
                              transition={{ duration: 0.2 }}
                              className="text-2xl leading-8 font-bold tracking-tight"
                            >
                              <Link
                                href={`/blog/${slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {title}
                              </Link>
                            </motion.h2>

                            <div className="flex flex-wrap">
                              {tags.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>

                          <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                            {summary}
                          </div>
                        </div>

                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/blog/${slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.li>
              )
            })}
          </ul>
        </div>

        {/* 🔥 All posts 按鈕動畫 */}
        {posts.length > MAX_DISPLAY && (
          <motion.div
            className="flex justify-end text-base leading-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/blog"
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              All Posts &rarr;
            </Link>
          </motion.div>
        )}

        {/* 🔥 Newsletter 動畫 */}
        {siteMetadata.newsletter?.provider && (
          <motion.div
            className="flex items-center justify-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <NewsletterForm />
          </motion.div>
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-[-100px] right-1/3 w-[500px] h-[500px] bg-purple-500/10 blur-[120px]" />
      </div>
    </div>
  )
}