'use client'

import { useRef, useState, useCallback } from 'react'
import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, tags }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // 計算滑鼠在卡片內的相對位置
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setPosition({ x, y })

    // 計算旋轉角度：將分母調大 (從 20 改到 35) 讓傾斜更優雅
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 35
    const rotateY = (centerX - x) / 35

    setRotate({ x: rotateX, y: rotateY })
  }, [])

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => {
    setOpacity(0)
    setRotate({ x: 0, y: 0 })
  }

  // 封裝內容，避免重複寫 Link
  const CardContent = (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.2s ease-out', // 稍微增加一點平滑感
        transformStyle: 'preserve-3d',
      }}
      className="group relative h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      {/* 聚光燈背景層 (Spotlight) */}
      <div
        className="pointer-events-none absolute -inset-px z-30 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`,
        }}
      />

      {/* 圖片區域 */}
      {imgSrc && (
        <div
          className="relative h-48 w-full overflow-hidden"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Tech Stack Tags */}
          <div className="absolute top-3 right-3 z-40 flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <Image
            alt={title}
            src={imgSrc}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={544}
            height={306}
          />
          {/* 圖片上的漸層遮罩，讓文字銜接更自然 */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
        </div>
      )}

      {/* 文字內容區 */}
      <div className="p-6" style={{ transform: 'translateZ(40px)' }}>
        <h2 className="group-hover:text-primary-500 dark:group-hover:text-primary-400 mb-2 text-xl font-bold tracking-tight text-gray-900 transition-colors dark:text-gray-100">
          {title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {description}
        </p>

        {href && (
          <div className="text-primary-500 mt-4 flex items-center text-sm font-bold">
            <span>View Project</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="h-full w-full p-4">
      {href ? (
        <Link href={href} aria-label={`Link to ${title}`} className="block h-full">
          {CardContent}
        </Link>
      ) : (
        CardContent
      )}
    </div>
  )
}

export default Card
