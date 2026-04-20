/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'PopJ0ker | Dev Blog',
  author: 'Maverick Tu',
  headerTitle: 'PopJ0ker Workshop',
  description: 'Code, Notes, and Dev Journals.',
  language: 'zh-TW',
  theme: 'system',
  siteUrl: 'https://popjoker.github.io/pop-blog', // 已修正為你的網址
  siteRepo: 'https://github.com/PopJoker/pop-blog',
  // 這裡統一使用絕對路徑，確保 GitHub Pages 子目錄能抓到
  siteLogo: `/pop-blog/static/images/logo.png`,
  socialBanner: `/pop-blog/static/images/twitter-card.png`,
  avatar: `/pop-blog/static/images/avatar.png`,
  mastodon: 'https://mastodon.social/@mavericktu0',
  email: 'mavericktu0@gmail.com',
  github: 'https://github.com/PopJoker',
  x: 'https://x.com/JokerPop19',
  facebook: 'https://www.facebook.com/daniel.tu.988',
  youtube: 'https://www.youtube.com/@MaverickTu-i8e',
  linkedin: 'https://www.linkedin.com/in/maverick-tu-b055a13b3/',
  threads: 'https://www.threads.net/@mt.loop.d_b_duble_g',
  instagram: 'https://www.instagram.com/mt.loop.d_b_duble_g/',
  locale: 'zh-TW',
  stickyNav: true,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      lang: 'zh-TW', // 改為繁體中文
      inputPosition: 'top', // 留言框放在上面更直觀
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/pop-blog/search.json',
    },
  },
}

module.exports = siteMetadata
