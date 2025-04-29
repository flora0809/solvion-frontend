"use client"

import React, { useState, useEffect } from "react"
import PointCard from "@/components/feature/PointCard"
import HistoryList from "@/components/feature/HistoryList"
import { getLatestHistoryData } from "@/data/historyData"
import { HistoryItem } from "@/types/history"
import styles from "./page.module.scss"
import Link from "next/link"

// 결제 금액 설정 - 여기서 한 번만 정의하고 다른 컴포넌트에 전달
export const DEDUCT_AMOUNT = 15000 // 15000원으로 설정

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])

  // 내역 데이터 로드 및 업데이트
  useEffect(() => {
    // 초기 데이터 로드
    updateHistoryData()

    // localStorage 변경을 감지하기 위한 주기적 업데이트
    const intervalId = setInterval(updateHistoryData, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // 최신 내역 데이터 업데이트 함수
  const updateHistoryData = () => {
    const latestData = getLatestHistoryData(2) // 항상 최신 2개만 가져오기
    setHistoryItems(latestData)
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div className={styles.page}>
      <PointCard
        variant="home"
        initialPoints="1,000,000"
        qrLinkPath="/qr"
        // 고정된 금액 전달
        deductAmount={DEDUCT_AMOUNT}
      />
      <div className={styles.menuIcons}>
        <div className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_charge.webp)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>충전</span>
        </div>
        <Link href="/history" className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_history.webp)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>내역</span>
        </Link>
        <Link href="/coupon" className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_coupon.webp)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>쿠폰함</span>
        </Link>
        <Link href="/reward" className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_reward.webp)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>리워드포인트</span>
        </Link>
      </div>
      {(() => {
        const eventInfo = {
          imagePath: "/images/Home_Event_250423.png",
          title: "SOLVION 신규가입하면<br> 선착순 5,000 포인트 받아요",
          link: "/event",
          actionText: "받으러가기",
        }
        return (
          <Link href={eventInfo.link} className={styles.eventCard}>
            <div
              className={styles.eventImage}
              style={{
                backgroundImage: `url(${eventInfo.imagePath})`,
                backgroundSize: "100%",
                backgroundPosition: "center right",
              }}
            />
            <div className={styles.eventContent}>
              <span className={styles.eventLabel}>EVENT</span>
              <h3
                className={styles.eventTitle}
                dangerouslySetInnerHTML={{ __html: eventInfo.title }}
              />
              <div className={styles.eventAction}>{eventInfo.actionText} →</div>
            </div>
          </Link>
        )
      })()}
      <div className={styles.recentSection}>
        <HistoryList
          items={historyItems}
          title="최근기록"
          showCalendar={true}
          pageType="main"
          maxItems={2} // 항상 최대 2개만 표시
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  )
}
