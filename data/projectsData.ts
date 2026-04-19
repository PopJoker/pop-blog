interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  tags: string[] // 將 unknown 改為字串陣列
}

const projectsData: Project[] = [
  // {
  //   title: 'A Search Engine',
  //   description: `What if you could look up any information in the world? Webpages, images, videos
  //   and more. Google has many features to help you find exactly what you're looking
  //   for.`,
  //   imgSrc: '/static/images/google.png',
  //   href: 'https://www.google.com',
  //   tags: ['Next.js', 'Tailwind CSS', 'Search Engine', 'Web API'],
  // },
  {
    title: 'Meney',
    description: `待更新 - 這是一個關於金融科技或預算管理的創新實驗，專注於使用者體驗與數據視覺化。`,
    imgSrc: '/static/images/Meney_Slogan.png',
    href: '/blog/meney',
    tags: ['code', 'flutter', 'supabase'],
  },
]

export default projectsData