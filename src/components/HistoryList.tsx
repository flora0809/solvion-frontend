// src/components/HistoryList.tsx
"use client"

import React, { useState, useEffect } from "react"
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  addWeeks,
  subWeeks,
} from "date-fns"
import { HistoryListProps, HistoryItem } from "@/types/history"
import Link from "next/link"

const HistoryList: React.FC<HistoryListProps> = ({
  items,
  title = "최근기록",
  showCalendar = true,
  pageType = "main", // "main" 또는 "history"
  showFilter = false,
  historyType = "all",
  maxItems,
  onDateChange,
  selectedDate = new Date(),
  className = "",
}) => {
  const [date, setDate] = useState<Date>(selectedDate)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [showAllItems, setShowAllItems] = useState<boolean>(false)
  const [currentWeekDays, setCurrentWeekDays] = useState<Date[]>([])
  const [showMonthSelector, setShowMonthSelector] = useState<boolean>(false)

  // 요일 표시
  const weekdays: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // 월 배열 - 영문으로 변경
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // 현재 주의 날짜들 계산
  useEffect(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // 월요일부터 시작
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i))
    }
    setCurrentWeekDays(days)
  }, [date])

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date) => {
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    const newDate = subWeeks(date, 1)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 다음 주로 이동
  const goToNextWeek = () => {
    const newDate = addWeeks(date, 1)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 월 선택 핸들러
  const handleMonthChange = (year: number, month: number) => {
    const newDate = new Date(year, month)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
    setShowMonthSelector(false)
  }

  // 월 선택 토글
  const toggleMonthSelector = () => {
    setShowMonthSelector(!showMonthSelector)
  }

  // 필터 변경 핸들러
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  // 항목 제한 처리
  const displayItems =
    showAllItems || !maxItems ? items : items.slice(0, maxItems)

  // 항목 필터링
  const filteredItems =
    activeFilter === "all"
      ? displayItems
      : displayItems.filter((item) => {
          if (activeFilter === "credit") return item.type === "credit"
          if (activeFilter === "debit") return item.type === "debit"
          return true
        })

  // 금액 포맷팅 함수
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(Math.abs(amount))
  }

  // 필터 옵션
  const filterOptions = [
    { id: "all", label: "전체" },
    { id: "credit", label: "적립" },
    { id: "debit", label: "사용" },
  ]

  // 제목 컴포넌트
  const TitleComponent = () => (
    <div className="history-header">
      <h2 className="history-title">{title}</h2>
      <div className="header-actions">
        {/* 더보기 버튼 - SVG 버튼 스타일 적용 */}
        {pageType === "main" && (
          <Link href="/history" className="svg-btn svg-btn-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="26"
              viewBox="0 0 25 26"
              fill="none"
            >
              <circle
                opacity={0.5}
                cx={12.5}
                cy={13}
                r={12}
                stroke="#CFC5B6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 4"
              />
              <path
                d="M17.5 12H13.5V8C13.5 7.44772 13.0523 7 12.5 7C11.9477 7 11.5 7.44772 11.5 8V12H7.5C6.94772 12 6.5 12.4477 6.5 13C6.5 13.5523 6.94772 14 7.5 14H11.5V18C11.5 18.5523 11.9477 19 12.5 19C13.0523 19 13.5 18.5523 13.5 18V14H17.5C18.0523 14 18.5 13.5523 18.5 13C18.5 12.4477 18.0523 12 17.5 12Z"
                fill="#b8971d"
              />
            </svg>
          </Link>
        )}
        {showFilter && (
          <button className="filter-button svg-btn svg-btn-default">
            필터
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )

  // 캘린더 컴포넌트
  const CalendarComponent = () => (
    <div className="mini-calendar">
      <div className="calendar-header">
        <div className="month-selector-trigger" onClick={toggleMonthSelector}>
          <div className="month-display">
            {/* 영문 월 표시로 변경 */}
            {months[date.getMonth()]} {date.getFullYear()}
          </div>
          {/* 하단 화살표 추가 */}
          <svg
            className="dropdown-arrow"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path
              d="M1 1L6 5L11 1"
              stroke="#9e831e"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="navigation-buttons">
          {/* 이전 주 버튼 - SVG 버튼 스타일 적용 */}
          <button
            className="svg-btn svg-btn-default"
            onClick={goToPreviousWeek}
            aria-label="이전 주"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              viewBox="0 0 26 26"
              fill="none"
            >
              <g clipPath="url(#clip0_146_249)">
                <path
                  d="M25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25C19.6274 25 25 19.6274 25 13Z"
                  stroke="#666562"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 4"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5303 18.5303C15.8232 18.2374 15.8232 17.7626 15.5303 17.4697L11.0607 13L15.5303 8.53033C15.8232 8.23744 15.8232 7.76256 15.5303 7.46967C15.2374 7.17678 14.7626 7.17678 14.4697 7.46967L9.46967 12.4697C9.17678 12.7626 9.17678 13.2374 9.46967 13.5303L14.4697 18.5303C14.7626 18.8232 15.2374 18.8232 15.5303 18.5303Z"
                  fill="#92918F"
                />
              </g>
              <defs>
                <clipPath id="clip0_146_249">
                  <rect width={26} height={26} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
          {/* 다음 주 버튼 - SVG 버튼 스타일 적용 */}
          <button
            className="svg-btn svg-btn-default"
            onClick={goToNextWeek}
            aria-label="다음 주"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              viewBox="0 0 26 26"
              fill="none"
            >
              <g clipPath="url(#clip0_146_249)">
                <path
                  d="M25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25C19.6274 25 25 19.6274 25 13Z"
                  stroke="#666562"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 4"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.4697 7.46967C10.1768 7.76256 10.1768 8.23744 10.4697 8.53033L14.9393 13L10.4697 17.4697C10.1768 17.7626 10.1768 18.2374 10.4697 18.5303C10.7626 18.8232 11.2374 18.8232 11.5303 18.5303L16.5303 13.5303C16.8232 13.2374 16.8232 12.7626 16.5303 12.4697L11.5303 7.46967C11.2374 7.17678 10.7626 7.17678 10.4697 7.46967Z"
                  fill="#92918F"
                />
              </g>
              <defs>
                <clipPath id="clip0_146_249">
                  <rect width={26} height={26} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      {/* 월 선택 모달 */}
      {showMonthSelector && (
        <div className="month-selector">
          <div className="month-selector-header">
            <button
              className="year-nav prev svg-btn svg-btn-default svg-btn-sm"
              onClick={() => {
                const newDate = new Date(date)
                newDate.setFullYear(date.getFullYear() - 1)
                setDate(newDate)
              }}
              aria-label="이전 년도"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="current-year">{date.getFullYear()}</span>
            <button
              className="year-nav next svg-btn svg-btn-default svg-btn-sm"
              onClick={() => {
                const newDate = new Date(date)
                newDate.setFullYear(date.getFullYear() + 1)
                setDate(newDate)
              }}
              aria-label="다음 년도"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="month-grid">
            {months.map((month: string, index: number) => (
              <button
                key={month}
                className={`month-btn ${
                  date.getMonth() === index ? "selected" : ""
                }`}
                onClick={() => handleMonthChange(date.getFullYear(), index)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="weekdays-row">
        {weekdays.map((day: string, index: number) => (
          <div
            key={index}
            className={`weekday ${
              currentWeekDays[index] &&
              isSameDay(currentWeekDays[index], selectedDate)
                ? "selected"
                : ""
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="days-row">
        {currentWeekDays.map((day, index) => (
          <button
            key={index}
            className={`day-button ${
              isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            onClick={() => handleDateChange(day)}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
    </div>
  )

  // 필터 컴포넌트
  const FilterComponent = () => (
    <div className="filter-options">
      {filterOptions.map((option) => (
        <button
          key={option.id}
          className={`filter-chip ${
            activeFilter === option.id ? "active" : ""
          }`}
          onClick={() => handleFilterChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )

  // 내역 항목 리스트 컴포넌트
  const HistoryItemsComponent = () => (
    <div className="history-items">
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div key={item.id} className="history-item">
            <div className="item-icon">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${item.icon || "/images/default.svg"})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              />
            </div>
            <div className="item-content">
              <div className={`amount-value ${item.type}`}>
                {item.type === "credit" ? "+" : "-"}
                {formatAmount(item.amount)}{" "}
                {historyType === "reward" ? "P" : ""}
              </div>
              <div className="item-title">{item.title}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-history">내역이 없습니다.</div>
      )}
    </div>
  )

  // 메인 페이지 레이아웃
  if (pageType === "main") {
    return (
      <div className={`history-list ${className}`}>
        {/* 타이틀 (메인 페이지에서는 별도로 표시) */}
        <div className="title-box">
          <TitleComponent />
        </div>

        {/* 내용 박스 (캘린더 + 내역 리스트) */}
        <div className="content-box">
          {showCalendar && <CalendarComponent />}
          <HistoryItemsComponent />
        </div>
      </div>
    )
  }

  // 내역 페이지 레이아웃
  return (
    <div className={`history-list ${className}`}>
      {/* 캘린더 (내역 페이지에서는 상단에 별도로 표시) */}
      {showCalendar && (
        <div className="calendar-box">
          <CalendarComponent />
        </div>
      )}

      {/* 내용 박스 (타이틀 + 필터 + 내역 리스트) */}
      <div className="content-box">
        <TitleComponent />
        {showFilter && <FilterComponent />}
        <HistoryItemsComponent />
      </div>
    </div>
  )
}

export default HistoryList
