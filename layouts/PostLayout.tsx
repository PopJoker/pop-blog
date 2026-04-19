'use client'

import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'
import RelatedPosts from '@/components/RelatedPosts'
import { motion } from 'framer-motion'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  relatedPosts: CoreContent<Blog>[]
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  relatedPosts,
  children,
}: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content
  const basePath = path.split('/')[0]

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-10">
            <div className="space-y-4 text-center">
              <motion.dl
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-10"
              >
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </motion.dl>
              <div>
                {/* 標題進場動畫 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <PageTitle>{title}</PageTitle>
                </motion.div>
              </div>
            </div>
          </header>

          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-12 xl:divide-y-0 dark:divide-gray-700">
            {/* 左側欄：作者與標籤 */}
            <aside className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="ring-primary-500/20 h-10 w-10 rounded-full ring-2"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter.replace(/^https?:\/\/(twitter|x)\.com\//, '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>

              <div className="hidden xl:block">
                <div className="py-8">
                  <h2 className="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    文章標籤
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                      <Tag key={tag} text={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* 中間欄：文章主體 */}
            <div className="divide-y divide-gray-200 xl:col-span-2 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="prose dark:prose-invert max-w-none pt-10 pb-8"
              >
                {children}
              </motion.div>

              <div className="py-6">
                <RelatedPosts posts={relatedPosts} />
              </div>

              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(path)} rel="nofollow" className="hover:text-primary-500">
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link href={editUrl(filePath)} className="hover:text-primary-500">
                  View on GitHub
                </Link>
              </div>

              {siteMetadata.comments && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>

            {/* 右側欄：Sticky TOC */}
            <aside className="hidden xl:block">
              <div className="sticky top-24 pt-11">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30">
                  <h2 className="mb-4 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    目錄導覽
                  </h2>
                  <TableOfContents toc={toc} />
                </div>
              </div>
            </aside>

            {/* 底部導覽 */}
            <footer className="xl:col-start-1 xl:row-start-2">
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:divide-y dark:divide-gray-700">
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 transition-colors">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 transition-colors">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${basePath}`}
                    className="text-primary-500 hover:text-primary-600 inline-flex items-center transition-colors"
                  >
                    <span className="mr-2">←</span> Back to blog
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
