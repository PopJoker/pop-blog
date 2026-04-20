import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    // 移除所有 max-w 限制，改用 w-full
    // px-4 sm:px-6 確保手機版有留白，xl:px-8 確保電腦版兩側不會貼死
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-0">{children}</section>
  )
}
