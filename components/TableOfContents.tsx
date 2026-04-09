'use client'

import { useEffect, useState } from 'react'

export default function TableOfContents({ toc }) {
    const [activeId, setActiveId] = useState('')

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-80px 0% -80% 0%' }
        )

        const headings = document.querySelectorAll('h2, h3')
        headings.forEach((h) => observer.observe(h))

        return () => observer.disconnect()
    }, [])

    if (!toc || toc.length === 0) return null

    return (
        <nav className="pl-4">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                On this page
            </h3>
            <ul className="space-y-3 border-l border-gray-200 dark:border-gray-800">
                {toc.map((item) => (
                    <li
                        key={item.url}
                        style={{ paddingLeft: `${(item.depth - 2) * 1}rem` }}
                        className="pl-4"
                    >
                        <a
                            href={item.url}
                            className={`text-sm transition-colors duration-200 block hover:text-primary-500 ${activeId === item.url.replace('#', '')
                                    ? 'font-medium text-primary-500 border-l-2 border-primary-500 -ml-[18px] pl-[16px]'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            {item.value}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}