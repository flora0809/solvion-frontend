// src/components/HistoryList.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import ReactDOM from "react-dom"
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  addWeeks,
  subWeeks,
  getYear,
  getMonth,
} from "date-fns"
import { HistoryListProps, HistoryItem } from "@/types/history"
import Link from "next/link"

// SVG 아이콘 임포트
import CloseIcon from "@/assets/icons/Close.svg"
import UpIcon from "@/assets/icons/Up.svg"
import DownIcon from "@/assets/icons/Down.svg"
import ArrowLeftIcon from "@/assets/icons/Arrow_L.svg"
import ArrowRightIcon from "@/assets/icons/Arrow_R.svg"
import PlusIcon from "@/assets/icons/Plus.svg"
import FilterIcon from "@/assets/icons/Filter.svg"

// 모달 포털 컴포넌트 - body에 직접 마운트하기 위한 컴포넌트
const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 클라이언트 사이드에서만 렌더링 (Next.js SSR 고려)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // 모달이 열릴 때 body의 스크롤 방지
    document.body.style.overflow = "hidden"

    // 정리 함수
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return mounted ? ReactDOM.createPortal(children, document.body) : null
}

// 모달 컴포넌트
const MonthSelectorModal: React.FC<{
  isMobile: boolean
  isClosing: boolean
  onClose: () => void
  selectedYear: number
  selectedMonth: number
  onYearChange: (diff: number) => void
  onMonthSelect: (month: number) => void
  months: string[]
  date: Date
  monthSelectorRef: React.RefObject<HTMLDivElement | null>
}> = ({
  isMobile,
  isClosing,
  onClose,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthSelect,
  months,
  date,
  monthSelectorRef,
}) => {
  if (isMobile) {
    return (
      <ModalPortal>
        <div
          className={`month-selector-backdrop ${isClosing ? "closing" : ""}`}
          onClick={(e) => {
            // 백드롭 클릭시 닫기 (이벤트 버블링 방지)
            if (e.target === e.currentTarget) {
              onClose()
            }
          }}
          style={{ zIndex: 9000 }}
        >
          <div
            className={`month-selector-bottomsheet ${
              isClosing ? "closing" : ""
            }`}
            ref={monthSelectorRef}
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 9001 }}
          >
            <div className="bottomsheet-header">
              <button
                className="svg-btn svg-btn-accent"
                onClick={onClose}
                aria-label="닫기"
              >
                <div>
                  <CloseIcon />
                </div>
              </button>
            </div>

            <div className="selector-controls">
              <div className="year-selector">
                <button
                  className="year-nav-btn"
                  onClick={() => onYearChange(1)}
                  aria-label="다음 연도"
                >
                  <UpIcon className="icon-sm" />
                </button>
                <span className="year-display">{selectedYear}</span>
                <button
                  className="year-nav-btn"
                  onClick={() => onYearChange(-1)}
                  aria-label="이전 연도"
                >
                  <DownIcon className="icon-sm" />
                </button>
              </div>
            </div>

            <div className="mobile-month-grid">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`mobile-month-btn ${
                    selectedMonth === index ? "selected" : ""
                  }`}
                  onClick={() => {
                    // 모바일에서 월 클릭 시 바로 적용 및 닫기
                    onMonthSelect(index)
                  }}
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ModalPortal>
    )
  }

  // 데스크톱 버전
  return (
    <div
      className="month-selector"
      ref={monthSelectorRef}
      style={{ zIndex: 9000 }}
    >
      <div className="month-selector-header">
        <button
          className="year-nav prev svg-btn svg-btn-default"
          onClick={() => onYearChange(-1)}
          aria-label="이전 년도"
        >
          <div>
            <ArrowLeftIcon />
          </div>
        </button>
        <span className="current-year">{date.getFullYear()}</span>
        <button
          className="year-nav next svg-btn svg-btn-default"
          onClick={() => onYearChange(1)}
          aria-label="다음 년도"
        >
          <div>
            <ArrowRightIcon />
          </div>
        </button>
      </div>
      <div className="month-grid">
        {months.map((month: string, index: number) => (
          <button
            key={month}
            className={`month-btn ${
              date.getMonth() === index ? "selected" : ""
            }`}
            onClick={() => {
              // 데스크톱에서는 바로 월 변경 및 모달 닫기
              onMonthSelect(index)
            }}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  )
}

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

  // 애니메이션 관련 상태 추가
  const [isClosingModal, setIsClosingModal] = useState<boolean>(false)
  // 바텀시트 애니메이션 관련 상태 - 마운트시에만 한 번 실행하도록
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true)

  // 새로 추가된 상태들
  const [isMobile, setIsMobile] = useState<boolean>(true)
  const [selectedYear, setSelectedYear] = useState<number>(getYear(date))
  const [selectedMonth, setSelectedMonth] = useState<number>(getMonth(date))
  const monthSelectorRef = useRef<HTMLDivElement>(null)

  // 백업용 상태 추가: 연도 버튼 클릭 시 배경 깜박임 방지
  const prevYearRef = useRef<number>(selectedYear)

  // showMonthSelector가 false가 될 때만 isInitialRender를 false로 설정
  useEffect(() => {
    if (showMonthSelector === false && isInitialRender) {
      setIsInitialRender(false)
    }
  }, [showMonthSelector, isInitialRender])

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

  // 모바일 디바이스 체크
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  // 현재 주의 날짜들 계산
  useEffect(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }) // 월요일부터 시작
    const days = []
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i))
    }
    setCurrentWeekDays(days)

    // 선택된 년/월 동기화
    setSelectedYear(getYear(date))
    setSelectedMonth(getMonth(date))

    // 연도 참조 업데이트
    prevYearRef.current = getYear(date)
  }, [date])

  // 모달 클로징 애니메이션 처리
  useEffect(() => {
    if (isClosingModal) {
      const timer = setTimeout(() => {
        setShowMonthSelector(false)
        setIsClosingModal(false)
      }, 300) // 애니메이션 지속 시간

      return () => clearTimeout(timer)
    }
  }, [isClosingModal])

  // 햅틱 피드백 함수
  const triggerHaptic = (pattern: number | number[] = 50) => {
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern)
      } catch (e) {
        // 진동 API 지원하지 않는 기기에서 예외 처리
        console.log("Haptic feedback not supported")
      }
    }
  }

  // 모달 닫기 함수 (애니메이션 포함)
  const closeMonthSelector = () => {
    if (isMobile) {
      triggerHaptic(50)
      setIsClosingModal(true)
    } else {
      setShowMonthSelector(false)
    }
  }

  // 날짜 변경 핸들러
  const handleDateChange = (newDate: Date) => {
    triggerHaptic()
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 이전 주로 이동
  const goToPreviousWeek = () => {
    triggerHaptic()
    const newDate = subWeeks(date, 1)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 다음 주로 이동
  const goToNextWeek = () => {
    triggerHaptic()
    const newDate = addWeeks(date, 1)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
  }

  // 월 선택 핸들러
  const handleMonthChange = (year: number, month: number) => {
    triggerHaptic([50, 50])
    const newDate = new Date(year, month)
    setDate(newDate)
    if (onDateChange) {
      onDateChange(newDate)
    }
    closeMonthSelector()
  }

  // 선택기 내에서 월 선택 핸들러 - 수정된 버전: 클릭 시 바로 적용되도록
  const handleMonthSelect = (month: number) => {
    triggerHaptic()

    // 모바일과 데스크톱 모두 동일하게 바로 적용
    handleMonthChange(selectedYear, month)
  }

  // 연도 선택 핸들러 - 수정: 배경 깜박임 방지
  const handleYearChange = (yearDiff: number) => {
    triggerHaptic()

    // 이전 연도 값 백업
    const newYear = selectedYear + yearDiff

    // 상태 업데이트 전에 참조 값 변경
    prevYearRef.current = newYear

    // 새로운 연도값으로 상태 업데이트
    setSelectedYear(newYear)

    // 모바일에서는 연도만 변경
    if (!isMobile) {
      // 데스크톱 모드에서는 연도 변경 즉시 반영
      const newDate = new Date(date)
      newDate.setFullYear(date.getFullYear() + yearDiff)
      setDate(newDate)
      if (onDateChange) {
        onDateChange(newDate)
      }
    }
  }

  // 월 선택 토글
  const toggleMonthSelector = () => {
    triggerHaptic()

    if (showMonthSelector) {
      closeMonthSelector()
    } else {
      // 월 선택기가 열릴 때 선택된 년/월 동기화
      setSelectedYear(getYear(date))
      setSelectedMonth(getMonth(date))
      setShowMonthSelector(true)
    }
  }

  // 필터 변경 핸들러
  const handleFilterChange = (filter: string) => {
    triggerHaptic()
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
            <div>
              <PlusIcon />
            </div>
          </Link>
        )}
        {showFilter && (
          <button className="filter-button svg-btn svg-btn-default">
            필터
            <div>
              <FilterIcon />
            </div>
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
          <div
            className={`dropdown-arrow ${showMonthSelector ? "active" : ""}`}
          >
            <DownIcon />
          </div>
        </div>
        <div className="navigation-buttons">
          {/* 이전 주 버튼 - SVG 버튼 스타일 적용 */}
          <button
            className="svg-btn svg-btn-default"
            onClick={goToPreviousWeek}
            aria-label="이전 주"
          >
            <div>
              <ArrowLeftIcon />
            </div>
          </button>
          {/* 다음 주 버튼 - SVG 버튼 스타일 적용 */}
          <button
            className="svg-btn svg-btn-default"
            onClick={goToNextWeek}
            aria-label="다음 주"
          >
            <div>
              <ArrowRightIcon />
            </div>
          </button>
        </div>
      </div>

      {/* 모달 렌더링 - React Portal 사용 */}
      {(showMonthSelector || isClosingModal) && (
        <MonthSelectorModal
          isMobile={isMobile}
          isClosing={isClosingModal}
          onClose={closeMonthSelector}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={handleYearChange}
          onMonthSelect={handleMonthSelect}
          months={months}
          date={date}
          monthSelectorRef={monthSelectorRef}
        />
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
