'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInStandalone, setIsInStandalone] = useState(false)

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase()

    const isIOSDevice =
      /iphone|ipad|ipod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    setIsIOS(isIOSDevice)
    setIsInStandalone(isStandalone)

    // Android 安裝事件
    const handler = (e: Event) => {
      e.preventDefault()
      const event = e as BeforeInstallPromptEvent
      setDeferredPrompt(event)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS 顯示提示
    if (isIOSDevice && !isStandalone) {
      setShow(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setShow(false)
  }

  if (!show || isInStandalone) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 rounded-2xl bg-black/90 p-4 text-white shadow-lg backdrop-blur">
      <div className="flex flex-col gap-2">
        {!isIOS ? (
          <>
            <div className="text-sm font-semibold">📱 安裝 Pop Blog</div>
            <div className="text-xs text-gray-300">加入主畫面，像 App 一樣使用更順暢</div>
            <button
              onClick={handleInstall}
              className="mt-2 rounded-xl bg-white py-2 text-sm font-bold text-black"
            >
              立即安裝
            </button>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold">📱 安裝到主畫面</div>
            <div className="text-xs text-gray-300">點擊 Safari 下方「分享」→「加入主畫面」</div>
          </>
        )}

        <button onClick={() => setShow(false)} className="mt-1 text-xs text-gray-400">
          關閉
        </button>
      </div>
    </div>
  )
}
