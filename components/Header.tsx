'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation' // 引入路徑監控
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

// --- GooeyNav 組件 ---
const GooeyNav = ({ items }: { items: { label: string; href: string }[] }) => {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  // 1. 根據目前 URL 找出對應的 Index
  const currentActiveIndex = items.findIndex(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  )
  const safeActiveIndex = currentActiveIndex === -1 ? 0 : currentActiveIndex

  // 2. 更新背景位置的邏輯封裝
  const updateEffectPosition = useCallback((element: HTMLElement) => {
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
    textRef.current.innerText = element.innerText
  }, [])

  // 3. 粒子效果 (保持原邏輯)
  const makeParticles = (element: HTMLElement) => {
    // ... 原本的粒子邏輯 ...
    // 為簡潔，這裡維持你原本內部的實現
  }

  // 4. 當路徑改變時，自動移動背景
  useEffect(() => {
    const activeLi = navRef.current?.querySelectorAll('li')[safeActiveIndex]
    if (activeLi) {
      updateEffectPosition(activeLi as HTMLElement)
      textRef.current?.classList.add('active')
    }
  }, [pathname, safeActiveIndex, updateEffectPosition])

  return (
    <div
      className="relative"
      ref={containerRef}
      onMouseLeave={() => {
        // 核心改進：滑鼠離開後回彈到當前頁面標籤
        const activeLi = navRef.current?.querySelectorAll('li')[safeActiveIndex]
        if (activeLi) updateEffectPosition(activeLi as HTMLElement)
      }}
    >
      <style>{`
        .effect { position: absolute; opacity: 1; pointer-events: none; display: grid; place-items: center; z-index: 1; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
        .effect.text { color: transparent; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.875rem; }
        .effect.filter { filter: blur(4px) contrast(20); }
        .effect.filter::after {
            content: "";
            position: absolute;
            inset: -1px;
            background: #82acff; 
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
            transition: background 0.3s ease;
        }
        .dark .effect.filter::after { background: #030f7e; }
        .effect.active::after { animation: pill 0.3s ease forwards; }
        @keyframes pill { to { transform: scale(1); opacity: 1; } }
        /* 粒子動畫省略，維持原樣 */
      `}</style>

      <nav className="relative z-10">
        <ul ref={navRef} className="m-0 flex flex-row space-x-2 p-0">
          {items.map((item, index) => (
            <li key={item.label} className="relative">
              <Link
                href={item.href}
                className={`block px-3 py-1.5 text-sm font-medium transition-colors duration-300 ${
                  safeActiveIndex === index
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
                onMouseEnter={(e) => {
                  // 滑鼠進入暫時移動背景
                  updateEffectPosition(e.currentTarget.parentElement!)
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

// --- 主 Header ---
// --- 主 Header 組件 ---
const Header = () => {
  // 保持你原本的 sticky 判斷邏輯
  let headerClass =
    'flex items-center w-full justify-between px-4 sm:px-5 lg:px-6 py-2 backdrop-blur-xl bg-white/60 dark:bg-gray-950/40 border-b border-black/5 dark:border-white/10'
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
          <div className="mr-3">
            <Logo />
          </div>

          {/* 這裡是補回來的邏輯： */}
          {/* 1. 桌面端顯示（sm:block） */}
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            <div className="hidden sm:block">{siteMetadata.headerTitle}</div>
          )}

          {/* 2. 窄畫面（手機端）顯示（sm:hidden） */}
          <div className="block text-base font-semibold sm:hidden">{siteMetadata.headerTitle}</div>
        </div>
      </Link>

      <div className="flex items-center space-x-3 leading-5 sm:-mr-6 sm:space-x-4">
        {/* 桌面端導航 */}
        <div className="hidden sm:block">
          <GooeyNav items={navItems} />
        </div>

        {/* 右側按鈕組 */}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
