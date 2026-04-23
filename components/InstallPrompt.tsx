'use client'

import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react' // 建議安裝 lucide-react 以獲得更好的視覺效果

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
    // 檢查是否曾經關閉過 (24小時內不再顯示)
    const isDismissed = localStorage.getItem('pwa-install-dismissed')
    const lastDismissed = isDismissed ? parseInt(isDismissed, 10) : 0
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000

    const ua = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsIOS(isIOSDevice)
    setIsInStandalone(isStandalone)

    if (isStandalone) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      if (now - lastDismissed > oneDay) {
        setShow(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS 邏輯
    if (isIOSDevice && !isStandalone && now - lastDismissed > oneDay) {
      setShow(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    setShow(false)
  }

  if (!show || isInStandalone) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-6 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 duration-500">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-5 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90">
        {/* 關閉按鈕 */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className="bg-primary-500 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-lg">
            <Download size={24} />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {isIOS ? '安裝到 iPhone' : '安裝 Pop Blog'}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {isIOS ? (
                <span className="flex flex-wrap items-center gap-1">
                  點擊瀏覽器下方的 <Share size={14} className="inline text-blue-500" />
                  然後選擇「加入主畫面」
                </span>
              ) : (
                '將部落格加入主畫面，享受如 App 般的流暢閱讀體驗。'
              )}
            </p>

            {!isIOS && (
              <button
                onClick={handleInstall}
                className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white transition-all hover:bg-gray-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-100"
              >
                立即安裝
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
