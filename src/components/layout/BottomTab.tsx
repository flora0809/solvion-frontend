"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"

// 실제 SVG 파일 이름에 맞게 import
import CategoryIcon from "@/assets/icons/Category.svg"
import DocumentIcon from "@/assets/icons/Document.svg"
import PlusIcon from "@/assets/icons/Plus.svg"
import SearchIcon from "@/assets/icons/Search.svg"
import NoticeIcon from "@/assets/icons/Notice.svg"

export default function BottomTab() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  const lastScrollTop = useRef(0)
  const scrollTimer = useRef<NodeJS.Timeout | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 성공 페이지에서는 탭바를 숨김
  const hideTabOnPages = ["/success"]
  const shouldHideTab = hideTabOnPages.some((page) =>
    pathname?.startsWith(page)
  )

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const resetTabVisibilityTimer = () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => {
        setVisible(true)
      }, 1500)
    }

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const isAtBottom =
        window.innerHeight + scrollTop >=
        document.documentElement.scrollHeight - 30
      const isAtTop = scrollTop < 50

      if (isAtBottom || isAtTop) {
        setVisible(true)
        if (scrollTimer.current) clearTimeout(scrollTimer.current)
        return
      }

      if (Math.abs(scrollTop - lastScrollTop.current) > 5) {
        setVisible(false)
        if (!isMobile) resetTabVisibilityTimer()
      }

      lastScrollTop.current = scrollTop
    }

    let isScrolling = false
    const throttledScroll = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          handleScroll()
          isScrolling = false
        })
        isScrolling = true
      }
    }

    window.addEventListener("scroll", throttledScroll)
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [isMobile])

  // 조기 반환을 훅 호출 이후로 이동
  if (shouldHideTab) {
    return null
  }

  return (
    <nav className={`bottom-tab ${visible ? "" : "hidden"}`}>
      <Link href="/" className={`tab-item ${isActive("/") ? "active" : ""}`}>
        <div className="tab-icon">
          <CategoryIcon />
        </div>
      </Link>

      <Link
        href="/history"
        className={`tab-item ${isActive("/history") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <DocumentIcon />
        </div>
      </Link>

      <Link href="/scan" className="tab-item tab-item-center">
        <div className="tab-icon-center">
          <PlusIcon className="plus-icon" />
        </div>
      </Link>

      <Link
        href="/coupon"
        className={`tab-item ${isActive("/coupon") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <NoticeIcon />
        </div>
      </Link>

      <Link
        href="/reward"
        className={`tab-item ${isActive("/reward") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <SearchIcon />
        </div>
      </Link>
    </nav>
  )
}
