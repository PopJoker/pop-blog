// 移除 'use client'，讓這一頁變回 Server Component
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import GitHubCard from '@/components/GitHubCard' // 引用剛才建立的檔案

// 現在 metadata 可以正常導出了！
export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold">GitHub Contributions</h2>
          <GitHubCard username="PopJoker" />
        </div>
      </AuthorLayout>
    </>
  )
}
