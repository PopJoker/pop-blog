'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import SpotlightCard from '@/components/components/SpotlightCard' // 使用剛改好的組件
import siteMetadata from '@/data/siteMetadata'

const skills = [
  // Languages & Full Stack
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Dart',
  'Flutter',
  'Go', // 處理串流後端時接觸到的 Go

  // Database & Logic Architecture
  'PostgreSQL',
  'Supabase',
  'Prisma ORM',
  'Zustand',
  'Riverpod',
  'RESTful API Design',
  'CRUD logic optimization',

  // Industrial Engineering & IoT (軟硬整合核心)
  'PLC通訊 (Mitsubishi / Siemens 等)',
  'HMI設計 (人機介面開發)',
  'Modbus / TCP', // 工業設備常見通訊協定
  'RTSP / WebRTC / go2rtc',
  'FFmpeg (串流轉碼與優化)',
  'Equipment Automation', // 設備自動化邏輯

  // System & DevOps
  'Docker & Containerization',
  'Git / GitHub Actions (CI/CD)',
  'Vercel / Netlify Deployment',
  'Linux CLI',

  // Documentation & UI
  'Tailwind CSS',
  'Framer Motion',
  'Contentlayer / MDX',
  'Technical Writing', // 你在 Dev Blog 上的產出能力
]

const experiences = [
  {
    year: '2025 - Present',
    company: '格斯科技 (GUS Technology)',
    role: 'RD Software Engineer',
    desc: '負責開發與維護各種應用程式與系統 Server，專注於全端架構與效能優化。',
  },
  {
    year: '2024 - 2025',
    company: '瑞健股份有限公司 (SHL Group)',
    role: 'Equipment Engineer',
    desc: '累積 HMI 設計經驗與建立穩固的 PLC 通訊基礎，將硬體邏輯軟體化。',
  },
  {
    year: '2024',
    company: '宜蘭大學',
    role: '電子工程系畢業',
    desc: '奠定電子電路與程式語言基礎。',
  },
]

export default function About() {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div className="relative pb-20">
      {/* 背景裝飾光暈 */}
      <div className="bg-primary-500/10 absolute top-0 -left-20 -z-10 h-72 w-72 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-20 -z-10 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="pt-10 pb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-gray-100"
        >
          About <span className="text-primary-500">Me</span>
        </motion.h1>
      </div>

      <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:space-y-0 xl:gap-x-12">
        {/* 左側：精緻個人卡片 */}
        <div className="relative mb-6 flex justify-center py-10">
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              x.set(0)
              y.set(0)
            }}
            style={{
              rotateX,
              rotateY,
              perspective: 1000,
              transformStyle: 'preserve-3d',
            }}
            className="group relative w-full max-w-[320px] will-change-transform"
          >
            {/* ✨ 加強版背光 - 透過毛玻璃滲透出來顏色會更美 */}
            <div
              className="from-primary-500/30 absolute -inset-8 rounded-[3rem] bg-gradient-to-br via-purple-500/20 to-blue-500/30 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
              style={{ transform: 'translateZ(-60px)' }}
            />

            {/* 🧊 毛玻璃主體容器 */}
            <SpotlightCard className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-md dark:border-gray-700/30 dark:bg-gray-950/40">
              <div
                className="flex flex-col items-center text-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 👤 頭像部分 */}
                {/* 👤 頭像部分 */}
                <div
                  className="relative mb-8"
                  style={{
                    transform: 'translateZ(50px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="relative h-32 w-32">
                    {/* 👻 敘利亞鼠的靈魂：利用 grayscale 和 blur 營造死掉感 */}
                    <span
                      className="absolute top-0 left-0 text-5xl opacity-0 transition-all duration-700 ease-out group-hover:-translate-x-14 group-hover:-translate-y-10 group-hover:rotate-[-25deg] group-hover:opacity-60"
                      style={{
                        transform: 'translateZ(-40px)',
                        filter: 'grayscale(1) blur(1.5px) drop-shadow(0 0 10px white)',
                      }}
                    >
                      🐹
                    </span>

                    {/* 白金鼠 */}
                    <span
                      className="absolute top-0 right-0 text-5xl opacity-0 transition-all duration-500 ease-out group-hover:translate-x-14 group-hover:-translate-y-8 group-hover:rotate-[20deg] group-hover:opacity-100"
                      style={{
                        transform: 'translateZ(-35px)',
                        filter:
                          'sepia(0.5) brightness(1.1) drop-shadow(0 0 5px rgba(255,255,255,0.5))',
                      }}
                    >
                      🐹
                    </span>

                    {/* 原有的頭像本體層 (維持不變) */}
                    <div className="from-primary-500 absolute -inset-2 rounded-2xl bg-gradient-to-tr to-blue-400 opacity-30 blur-md transition-opacity duration-500 group-hover:opacity-60" />
                    <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-white/60 shadow-2xl dark:border-gray-700/50">
                      <Image
                        src="/static/images/avatar.png"
                        alt="avatar"
                        width={128}
                        height={128}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* 📝 文字內容層 */}
                <div style={{ transform: 'translateZ(35px)', transformStyle: 'preserve-3d' }}>
                  <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                    Maverick Tu
                  </h3>
                  <p className="bg-primary-500/10 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400 mt-1.5 inline-block rounded-full px-3 py-0.5 text-xs font-bold tracking-widest uppercase">
                    Full-stack Developer
                  </p>

                  <div className="mt-6 space-y-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <p className="flex items-center justify-center gap-2">
                      <span className="drop-shadow-sm">📍</span> Taoyuan, Taiwan
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <span className="drop-shadow-sm">🎓</span> NIU Electronic Engineering
                    </p>
                  </div>
                </div>

                {/* 🔗 社群圖標：半透明毛玻璃底座 */}
                <div
                  className="group mt-8 flex flex-col items-center" // 💡 加上 group 讓內層可以連動
                  style={{
                    transform: 'translateZ(20px)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* 💡 發亮文字：加上 transition 和 hover 效果 */}
                  <p className="group-hover:text-primary-500 mb-3 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)] dark:text-gray-500">
                    Drop me a line & Let's talk
                  </p>

                  {/* 🔗 社群圖標容器 */}
                  <div
                    className="group-hover:border-primary-500/30 flex flex-wrap justify-center gap-x-4 gap-y-3 rounded-2xl border border-white/50 bg-white/30 px-5 py-4 shadow-sm backdrop-blur-sm transition-all duration-500 group-hover:bg-white/50 dark:border-gray-700/30 dark:bg-gray-800/30 dark:group-hover:bg-gray-800/50"
                    style={{
                      transform: 'translateZ(10px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {[
                      { kind: 'mail', href: `mailto:${siteMetadata.email}` },
                      { kind: 'github', href: siteMetadata.github },
                      { kind: 'facebook', href: siteMetadata.facebook },
                      { kind: 'youtube', href: siteMetadata.youtube },
                      { kind: 'linkedin', href: siteMetadata.linkedin },
                      { kind: 'twitter', href: siteMetadata.twitter },
                      { kind: 'bluesky', href: siteMetadata.bluesky },
                      { kind: 'x', href: siteMetadata.x },
                      { kind: 'instagram', href: siteMetadata.instagram },
                      { kind: 'threads', href: siteMetadata.threads },
                      { kind: 'medium', href: siteMetadata.medium },
                    ].map(
                      (social) =>
                        social.href && (
                          <span
                            key={social.kind}
                            className="hover:text-primary-500 transition-all duration-300 hover:-translate-y-1 hover:scale-125 active:scale-95"
                            style={{ transform: 'translateZ(15px)' }}
                          >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <SocialIcon kind={social.kind as any} href={social.href} size={6} />
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* 右側：故事與經歷 */}
        <div className="xl:col-span-2">
          <section className="prose dark:prose-invert max-w-none pt-8">
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              我是 Maverick，一名從<span className="text-primary-500 font-semibold">電子工程</span>
              背景跨足到<span className="text-primary-500 font-semibold">軟體開發</span>的工程師。
              我熱衷於連接硬體與雲端，並將數據轉化為美觀、易用的介面。
            </p>

            {/* 技能區域 */}
            <div className="my-10">
              <h3 className="mb-6 flex items-center text-2xl font-bold">
                <span className="bg-primary-500 mr-4 h-px w-8"></span>
                技術棧
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-gray-200 bg-white/50 px-4 py-2 text-sm font-medium backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* 時間軸經歷 */}
            <div className="my-10">
              <h3 className="mb-8 flex items-center text-2xl font-bold">
                <span className="bg-primary-500 mr-4 h-px w-8"></span>
                工作經歷
              </h3>
              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="relative pl-8 before:absolute before:top-2 before:left-0 before:h-full before:w-[2px] before:bg-gray-200 dark:before:bg-gray-800"
                  >
                    <div className="bg-primary-500 absolute top-2 left-[-5px] h-3 w-3 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    <span className="text-primary-500 text-sm font-bold tracking-widest uppercase">
                      {exp.year}
                    </span>
                    <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                      {exp.role} @ {exp.company}
                    </h4>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{exp.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
