'use client'

import { slug } from 'github-slugger'
import Tag from '@/components/Tag'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import tagData from 'app/tag-data.json'
import { motion } from 'framer-motion'

export default function TagsPage() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  // 設定動畫參數
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // 每個標籤延遲 0.05 秒出現
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 },
  }

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
              Tags
            </h1>
          </motion.div>
        </div>

        <motion.div
          className="flex max-w-2xl flex-wrap"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tagKeys.length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <motion.div
                key={t}
                variants={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 mb-2 mr-5"
              >
                <Link
                  href={`/tags/${slug(t)}`}
                  className="group relative flex items-center overflow-hidden rounded-full border border-gray-200 bg-white px-4 py-2 transition-all hover:border-primary-500 hover:text-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-400"
                >
                  <span className="-ml-1 mr-2 text-sm font-semibold uppercase text-gray-600 group-hover:text-primary-500 dark:text-gray-300">
                    {t}
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400">
                    {tagCounts[t]}
                  </span>

                  {/* React Bits 風格的微光背景效果 */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </>
  )
}