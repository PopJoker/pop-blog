'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import gsap from 'gsap'

interface NavLink {
  title: string
  href: string
}

interface FlowingItemProps {
  link: NavLink
  onClick: () => void
}

// 內部組件：單個流動選單項
const FlowingItem = ({ link, onClick }: FlowingItemProps) => {
  // 1. 指定 Ref 的型別為 HTMLDivElement
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const item = itemRef.current
    const marquee = marqueeRef.current

    // 2. 加入安全檢查，確保 item 和 marquee 存在
    if (!item || !marquee) return

    // 初始隱藏跑馬燈
    gsap.set(marquee, { xPercent: -100, opacity: 0 })

    const onMouseEnter = () => {
      gsap.to(marquee, { xPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
    }
    const onMouseLeave = () => {
      gsap.to(marquee, { xPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.in' })
    }

    item.addEventListener('mouseenter', onMouseEnter)
    item.addEventListener('mouseleave', onMouseLeave)

    return () => {
      item.removeEventListener('mouseenter', onMouseEnter)
      item.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div
      ref={itemRef}
      className="group relative w-full overflow-hidden border-b border-gray-200 dark:border-gray-800"
    >
      <Link
        href={link.href}
        onClick={onClick}
        className="relative z-10 block w-full px-6 py-8 text-4xl font-black tracking-tighter text-gray-900 uppercase italic transition-colors duration-300 group-hover:text-white dark:text-gray-100"
      >
        <span className="relative z-20">{link.title}</span>

        {/* 背景跑馬燈效果 */}
        <div
          ref={marqueeRef}
          className="bg-primary-500 pointer-events-none absolute inset-0 z-10 flex items-center"
        >
          <div className="animate-infinite-scroll flex py-2 whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="mx-4 text-4xl font-black text-white uppercase italic dark:text-blue-950"
              >
                {link.title} —
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  // 3. 同樣為 navRef 指定型別
  const navRef = useRef<HTMLElement>(null)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        if (navRef.current) enableBodyScroll(navRef.current)
      } else {
        if (navRef.current) disableBodyScroll(navRef.current)
      }
      return !status
    })
  }

  // 新增：專門給 Link 使用的關閉邏輯
  const handleLinkClick = () => {
    // 給予 150ms - 200ms 的緩衝，讓點擊回饋感更好
    setTimeout(() => {
      onToggleNav()
    }, 500)
  }

  useEffect(() => {
    return () => clearAllBodyScrollLocks()
  }, [])

  return (
    <>
      <button aria-label="Toggle Menu" onClick={onToggleNav} className="p-2 sm:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-gray-900 dark:text-gray-100"
        >
          <path
            fillRule="evenodd"
            d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 5h14a1 1 0 110 2H3a1 1 0 110-2z"
          />
        </svg>
      </button>

      <Transition appear show={navShow} as={Fragment}>
        <Dialog as="div" onClose={onToggleNav} className="relative z-50">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-500 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-500 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel className="fixed inset-0 z-70 flex flex-col bg-white dark:bg-gray-950">
              <button
                className="absolute top-6 right-6 z-80 p-2 text-gray-900 dark:text-gray-100"
                onClick={onToggleNav}
              >
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <nav ref={navRef} className="flex h-full flex-col justify-center overflow-y-auto">
                {headerNavLinks.map((link) => (
                  <FlowingItem key={link.title} link={link} onClick={handleLinkClick} />
                ))}
              </nav>
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileNav
