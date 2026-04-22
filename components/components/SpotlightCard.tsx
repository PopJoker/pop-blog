'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(99, 102, 241, 0.15)',
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isMobile, setIsMobile] = useState(false)

  // 偵測是否為手機/觸控裝置
  useEffect(() => {
    const checkMobile = () => {
      // 簡單判斷：寬度小於 768px 或 支援觸控
      setIsMobile(window.innerWidth < 768 || navigator.maxTouchPoints > 0)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // 如果是手機端，直接跳過坐標更新
    if (isMobile) return

    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const background = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      ${spotlightColor},
      transparent 80%
    )
  `

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden transform-gpu ${className}`}
    >
      {/* 只在非手機端渲染聚光燈層 */}
      {!isMobile && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background }}
        />
      )}

      {/* content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}