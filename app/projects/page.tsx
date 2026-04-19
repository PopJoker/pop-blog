'use client' // 為了動畫效果，我們將此頁轉為 Client Component

import projectsData from '@/data/projectsData'
import Card from '@/components/Card'
import { motion } from 'framer-motion'

// 容器動畫設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 每個專案卡片間隔 0.1 秒出現
    },
  },
}

// 單個卡片動畫設定
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
          >
            Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-7 text-gray-500 dark:text-gray-400"
          >
            這裡紀錄了我的開發作品與技術實驗，每個專案都是一次成長的印記。
          </motion.p>
        </div>

        <div className="container py-12">
          <motion.div
            className="-m-4 flex flex-wrap"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projectsData.map((d) => (
              <motion.div
                key={d.title}
                variants={itemVariants}
                // 把原本在 Card 上的佈局類名移到這裡
                className="p-4 md:w-1/2 w-full"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }} // 直接用 framer-motion 做 hover 縮放更平滑
                  className="h-full"
                >
                  <Card
                    title={d.title}
                    description={d.description}
                    imgSrc={d.imgSrc}
                    href={d.href}
                    tags={d.tags}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}