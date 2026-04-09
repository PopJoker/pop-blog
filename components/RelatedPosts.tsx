import Link from '@/components/Link'
import Tag from '@/components/Tag'
import { CoreContent } from 'pliny/utils/contentlayer'
import { Blog } from 'contentlayer/generated'

export default function RelatedPosts({ posts }: { posts: CoreContent<Blog>[] }) {
  if (posts.length === 0) return null

  return (
    <div className="pt-10">
      <h2 className="mb-6 text-2xl leading-9 font-bold tracking-tight text-gray-900 dark:text-gray-100">
        相關文章
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="group relative flex flex-col items-start rounded-2xl border border-gray-200 p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
          >
            <time className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(post.date).toLocaleDateString()}
            </time>
            <h3 className="group-hover:text-primary-500 mb-3 text-lg font-bold transition-colors">
              <Link href={`/${post.path}`}>{post.title}</Link>
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags?.slice(0, 2).map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
