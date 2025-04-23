"use client"

import React, { useState } from "react"
import PointCard from "@/components/PointCard"
import HistoryList from "@/components/HistoryList"
import { mainHistoryData } from "@/data/historyData"
import styles from "./page.module.scss"
import Link from "next/link"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date)
      // 필요에 따라 선택된 날짜에 대한 처리 로직 추가
    }
  }

  return (
    <div className={styles.page}>
      <PointCard variant="home" points="100M" qrLinkPath="/qr" />

      {/* 하단 메뉴 아이콘 */}
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

      {/* 이벤트 배너 */}
      {(() => {
        // 이벤트 변수
        const eventInfo = {
          imagePath: "/images/Home_Event_250423.png", // 이미지 경로
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

      {/* 최근 기록 섹션  */}
      <div className={styles.recentSection}>
        {/* 메인 페이지에서 사용 */}
        <HistoryList
          items={mainHistoryData}
          title="최근기록"
          showCalendar={true}
          pageType="main"
          maxItems={2}
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        />
        {/* // 내역 페이지에서 사용
        <HistoryList
          items={fullHistoryData}
          title="전체내역"
          showCalendar={true}
          pageType="history" // 내역 페이지에서는 더보기 버튼 없음
          showFilter={true}
          onDateChange={handleDateChange}
          selectedDate={selectedDate}
        /> */}
      </div>
    </div>
  )
}
