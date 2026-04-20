'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'

// 💡 技能數據 (可以根據你的情況修改)
const skills = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'UI/UX Design',
  'Node.js',
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)

  // 鼠標追蹤動畫邏輯 (用於頭像傾斜)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg'])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    x.set(mouseX / width - 0.5)
    y.set(mouseY / height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100"
        >
          About Me
        </motion.h1>
      </div>

      <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-8">
        {/* 左側：個人資料卡片 */}
        <div className="flex flex-col items-center pt-8">
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="relative h-48 w-48 transition-all duration-200 ease-out"
          >
            {/* 頭像裝飾背景 */}
            <div className="from-primary-500 absolute inset-0 rounded-full bg-gradient-to-tr to-blue-400 opacity-20 blur-2xl" />

            <div className="relative overflow-hidden rounded-full border-4 border-white shadow-2xl dark:border-gray-800">
              <Image
                src="/static/images/avatar.png" // 💡 換成你的頭像
                alt="avatar"
                width={192}
                height={192}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Maverick Tu
          </h3>
          <div className="text-gray-500 dark:text-gray-400">Full-stack Developer</div>
          <div className="text-gray-500 dark:text-gray-400">格斯科技公司 RD-SE / 自由接案</div>

          <div className="flex space-x-3 pt-6">
            <SocialIcon kind="mail" href={`mailto:your-email@gmail.com`} />
            <SocialIcon kind="github" href="https://github.com" />
            <SocialIcon kind="linkedin" href="https://linkedin.com" />
          </div>
        </div>

        {/* 右側：文案內容 */}
        <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p>
              你好！我是一位熱衷於打造精緻網頁體驗的開發者。我喜歡將複雜的邏輯轉化為直覺且優雅的介面。
            </p>
            <p>
              除了編寫代碼，我對 UI/UX
              設計與動態特效也有深厚的興趣。我相信優秀的網站不僅要能正常運作，更要能與使用者產生情感上的共鳴。
            </p>

            {/* 💡 技能標籤雲 */}
            <h4 className="mt-8 mb-4">技術棧</h4>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    y: -5,
                  }}
                  className="cursor-default rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            <h4 className="mt-8">我的經歷</h4>
            <ul>
              <li>2025 - Present: 在格斯科技公司公司擔任研發軟體工程師</li>
              <li>2024 - 2025: 瑞健股份有限公司擔任設備工程師</li>
              <li>2024: 畢業於宜蘭大學電子工程系</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
