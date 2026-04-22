import { Inter } from 'next/font/google'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode } from 'react'
import Header from './Header'
import { LazyMotion, domAnimation, m } from 'framer-motion'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
  // 關鍵優化：確保字體交換時不會有明顯閃爍
  display: 'swap',
})

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      {/* 1. 使用 LazyMotion 包裹，並只載入必要的 domAnimation 功能 */}
      <LazyMotion features={domAnimation}>
        <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
          <Header />
          {/* 2. 使用 m.main 代替原本的 main 或 motion.main，減少運算負擔 */}
          <m.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-auto"
          >
            {children}
          </m.main>
          <Footer />
        </div>
      </LazyMotion>
    </SectionContainer>
  )
}

export default LayoutWrapper
