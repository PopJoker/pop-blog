'use client'

import React, { useRef, useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

// --- GooeyNav 類型定義 ---
interface NavItem {
  label: string
  href: string
}

interface GooeyNavProps {
  items: NavItem[]
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: string[]
  initialActiveIndex?: number
}

interface ParticleConfig {
  start: [number, number]
  end: [number, number]
  time: number
  scale: number
  color: string
  rotate: number
}

// --- GooeyNav 組件實現 ---
const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 12,
  particleDistances = [80, 10],
  particleR = 100,
  timeVariance = 300,
  // 這裡預設給一組過渡色，亮暗色模式都通用
  colors = ['#818cf8', '#c084fc', '#94a3b8', '#e0e7ff'],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex)

  const noise = (n: number = 1): number => n / 2 - Math.random() * n

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  const createParticle = (i: number, t: number, d: [number, number], r: number): ParticleConfig => {
    const rotate = noise(r / 10)
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    }
  }

  const makeParticles = (element: HTMLElement) => {
    const d = particleDistances
    const r = particleR
    const bubbleTime = animationTime * 2 + timeVariance
    element.style.setProperty('--time', `${bubbleTime}ms`)

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2)
      const p = createParticle(i, t, d, r)
      element.classList.remove('active')

      setTimeout(() => {
        const particle = document.createElement('span')
        const point = document.createElement('span')
        particle.classList.add('particle')
        particle.style.setProperty('--start-x', `${p.start[0]}px`)
        particle.style.setProperty('--start-y', `${p.start[1]}px`)
        particle.style.setProperty('--end-x', `${p.end[0]}px`)
        particle.style.setProperty('--end-y', `${p.end[1]}px`)
        particle.style.setProperty('--time', `${p.time}ms`)
        particle.style.setProperty('--scale', `${p.scale}`)
        particle.style.setProperty('--color', p.color)
        particle.style.setProperty('--rotate', `${p.rotate}deg`)

        point.classList.add('point')
        particle.appendChild(point)
        element.appendChild(particle)

        requestAnimationFrame(() => element.classList.add('active'))
        setTimeout(() => {
          try {
            element.removeChild(particle)
          } catch (e) {
            // 忽略節點已被移除的情況
          }
        }, t)
      }, 30)
    }
  }

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const pos = element.getBoundingClientRect()

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    }

    Object.assign(filterRef.current.style, styles)
    Object.assign(textRef.current.style, styles)
    textRef.current.innerText = (element as HTMLElement).innerText
  }

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex]
    if (activeLi) {
      updateEffectPosition(activeLi as HTMLElement)
      textRef.current?.classList.add('active')
    }
  }, [activeIndex])

  return (
    <div className="relative" ref={containerRef}>
      <style>{`
        .effect { position: absolute; opacity: 1; pointer-events: none; display: grid; place-items: center; z-index: 1; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        
        /* 亮色模式：文字深灰，暗色模式：文字白色 */
        .effect.text { color: #00000000; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }
        .dark .effect.text { color: #ffffff00; }

        .effect.filter { filter: blur(4px) contrast(20); mix-blend-mode: normal; }
        .dark .effect.filter { mix-blend-mode: hard-light; }

        .effect.filter::after {
            content: "";
            position: absolute;
            inset: -1px; /* 稍微溢出解決邊緣未填滿問題 */
            background: #82acff; /* 亮色模式：淺灰色或淺紫色 (#e0e7ff) */
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
            transition: background 0.3s ease;
        }

        /* 暗色模式下的背景色 */
        .dark .effect.filter::after {
            background: #030f7e;
        }

        .effect.active::after { animation: pill 0.3s ease forwards; }
        @keyframes pill { to { transform: scale(1); opacity: 1; } }
        
        .particle { position: absolute; top: 50%; left: 50%; animation: particle var(--time) ease forwards; }
        .point { display: block; width: 12px; height: 12px; border-radius: 9999px; background: var(--color); animation: point var(--time) ease forwards; }
        
        @keyframes particle { 
          0% { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; }
          100% { transform: rotate(var(--rotate)) translate(var(--end-x), var(--end-y)); opacity: 0; }
        }
        @keyframes point { 0% { transform: scale(0); } 50% { transform: scale(var(--scale)); } 100% { transform: scale(0); } }
      `}</style>

      <nav className="relative z-10">
        <ul
          ref={navRef}
          className="m-0 flex flex-col space-y-2 p-0 sm:flex-row sm:space-y-0 sm:space-x-2"
        >
          {items.map((item, index) => (
            <li key={item.label} className="relative">
              <Link
                href={item.href}
                className={`block px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeIndex === index
                    ? 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100' // 隱藏原本文字，讓 effect.text 顯示
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={(e) => {
                  updateEffectPosition(e.currentTarget.parentElement!)
                  makeParticles(filterRef.current!)
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  )
}

// --- 主 Header 組件 ---
const Header = () => {
  let headerClass =
    'flex items-center w-full justify-between px-5 sm:px-6 lg:px-10 py-4 backdrop-blur-xl bg-white/60 dark:bg-gray-950/40 border-b border-black/5 dark:border-white/10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  const navItems = headerNavLinks
    .filter((link) => link.href !== '/')
    .map((link) => ({
      label: link.title,
      href: link.href,
    }))

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-6">
            <Logo />
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>

      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="hidden sm:block">
          <GooeyNav items={navItems} />
        </div>

        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
