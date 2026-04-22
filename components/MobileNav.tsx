'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import { Fragment, useState, useEffect, useRef } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

interface NavLink {
  title: string
  href: string
}

interface FlowingItemProps {
  link: NavLink
  onClick: () => void
}

const FlowingItem = ({ link, onClick }: FlowingItemProps) => {
  return (
    <div className="group relative w-full overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <Link
        href={link.href}
        onClick={onClick}
        className="relative z-10 block w-full px-6 py-8 text-4xl font-black tracking-tighter text-gray-900 uppercase italic transition-colors duration-300 group-hover:text-white dark:text-gray-100"
      >
        <span className="relative z-20">{link.title}</span>

        {/* 優化點：移除 GSAP 監聽與無限動畫。
          改用純 CSS Hover 觸發，且預設隱藏跑馬燈，只有 Hover 時才啟動渲染。
        */}
        <div className="bg-primary-500 pointer-events-none absolute inset-0 z-10 flex translate-x-[-101%] items-center opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
          {/* 只在桌面端或強大設備顯示動畫，手機端保持靜態或簡單背景即可 */}
          <div className="group-hover:animate-infinite-scroll flex py-2 whitespace-nowrap">
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

  const handleLinkClick = () => {
    // 縮短延遲，500ms 太久會讓低端設備感覺點擊沒反應
    setTimeout(() => {
      onToggleNav()
    }, 200)
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
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
          >
            {/* 物理移除 backdrop-blur-sm，改用純色半透明 */}
            <div className="fixed inset-0 bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in duration-200 transform"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <DialogPanel
              className="fixed inset-0 z-70 flex flex-col bg-white dark:bg-gray-950"
              style={{ willChange: 'transform' }} // 告訴瀏覽器準備硬體加速
            >
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
