import { sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  // 1. 排序文章
  const sortedPosts = sortPosts(allBlogs)

  // 2. 物理閹割：只挑選標題、日期、摘要、標籤和 Slug
  // 這樣做可以讓發送到手機端的數據量減少 80% 以上
  const posts = sortedPosts.map((post) => ({
    slug: post.slug,
    date: post.date,
    title: post.title,
    summary: post.summary,
    tags: post.tags,
    // 注意：這裡絕對不要寫 post.body 或 post.content
  }))

  // 3. 限制首頁顯示的數量 (例如只給前 10 篇)
  // 如果首頁塞 50 篇文章，低端手機的 DOM 節點太多也會卡
  const postsToShow = posts.slice(0, 10)

  return <Main posts={postsToShow} />
}
