'use client'

import { GitHubCalendar } from 'react-github-calendar'

export default function GitHubCard({ username }: { username: string }) {
    const selectThreeMonths = (contributions) => {
        return contributions.slice(-365)
    }

    return (
        <div className="w-full">
            {/* 標題欄：維持小字，減少下邊距 */}
            <div className="mb-1 flex items-center justify-between px-1">
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                    GitHub Activity
                </span>
                <span className="text-[10px] text-gray-400">Past Year</span>
            </div>

            {/* 移除 leading-[0]，改用 min-h 自動適應高度 */}
            <div className="flex justify-center overflow-hidden py-1">
                <GitHubCalendar
                    username={username}
                    transformData={selectThreeMonths}
                    blockSize={8}
                    blockMargin={2}
                    theme={{
                        light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                        dark: ['#1d2128', '#0e4429', '#006d32', '#26a641', '#39d353'],
                    }}
                />
            </div>
        </div>
    )
}
