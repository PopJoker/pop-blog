import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-0"
      /* 優化點：
         1. content-visibility: auto (黑科技)
            讓瀏覽器在渲染時跳過「目前不在視窗內」的容器內容計算，
            這對內容很長的 Blog 頁面非常有幫助，能大幅減少手機端的處理壓力。
         2. contain-intrinsic-size
            給予一個預估高度，防止滾動條跳動，提升低端設備的滑動流暢度。
      */
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '1px 1000px',
      }}
    >
      {children}
    </section>
  )
}
