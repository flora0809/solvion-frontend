// src/types/history.ts

export type HistoryType = "payment" | "reward" | "all"

export interface HistoryItem {
  id: string
  date: string // ISO 형식 날짜 문자열
  title: string
  subtitle?: string
  amount: number
  type: "debit" | "credit" // 출금(사용-차변) 또는 입금(적립-대변)
  category?: string
  icon?: string // 아이콘 경로 또는 컴포넌트 이름
}

export interface HistoryListProps {
  items: HistoryItem[]
  title?: string
  showCalendar?: boolean
  pageType?: "main" | "history"
  showFilter?: boolean
  historyType?: HistoryType
  maxItems?: number
  onDateChange?: (date: Date) => void
  selectedDate?: Date
  className?: string
  titlePosition?: "inside" | "separate"
}
