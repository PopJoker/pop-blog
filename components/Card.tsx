'use client'

import { useRef, useState } from 'react'
import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, tags }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (e.clientY - rect.top - centerY) / 20
    const rotateY = (centerX - (e.clientX - rect.left)) / 20

    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => setOpacity(1)
  const handleMouseLeave = () => {
    setOpacity(0)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div className="group h-full w-full p-4">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full overflow-hidden rounded-xl bg-white dark:bg-gray-800"
      >
        {/* 內層容器 (用來遮掉跑馬燈中心，只留下邊緣 2px) */}
        <div className="relative z-10 h-full w-full overflow-hidden rounded-[calc(0.75rem-1px)] bg-blue-200 dark:bg-blue-950">
          {/* 聚光燈背景層 (Spotlight) */}
          <div
            className="pointer-events-none absolute -inset-px z-0 transition duration-300"
            style={{
              opacity,
              background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
            }}
          />

          {imgSrc && (
            <div
              className="relative z-10 overflow-hidden"
              style={{ transform: 'translateZ(50px)' }}
            >
              {/* 💡 2. 技術棧標籤 (Tech Stack Badges) */}
              <div className="absolute top-3 right-3 z-20 flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {href ? (
                <Link href={href} aria-label={`Link to ${title}`}>
                  <Image
                    alt={title}
                    src={imgSrc}
                    className="object-cover object-center transition-transform duration-500 hover:scale-105 md:h-36 lg:h-48"
                    width={544}
                    height={306}
                  />
                </Link>
              ) : (
                <Image
                  alt={title}
                  src={imgSrc}
                  className="object-cover object-center md:h-36 lg:h-48"
                  width={544}
                  height={306}
                />
              )}
            </div>
          )}

          <div className="relative z-10 p-6" style={{ transform: 'translateZ(30px)' }}>
            <h2 className="mb-3 text-2xl leading-8 font-bold tracking-tight">
              {href ? (
                <Link
                  href={href}
                  aria-label={`Link to ${title}`}
                  className="hover:text-primary-500 dark:hover:text-primary-400"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </h2>
            <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
            {href && (
              <Link
                href={href}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-base leading-6 font-medium"
                aria-label={`Link to ${title}`}
              >
                Learn more &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
