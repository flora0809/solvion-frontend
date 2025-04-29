// src/data/historyData.ts
import { HistoryItem } from "@/types/history"

// 현재 날짜 기준 더미 데이터 생성
const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const twoDaysAgo = new Date(today)
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
const threeDaysAgo = new Date(today)
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

// localStorage 키 상수
const HISTORY_STORAGE_KEY = "solvion_payment_history"

// 결제 내역 추가 함수
export const addPaymentHistory = (amount: number) => {
  try {
    if (typeof window === "undefined") return null

    const newPayment: HistoryItem = {
      id: Date.now().toString(), // 고유 ID 생성
      date: new Date().toISOString(),
      title: "GS25 포인트 결제",
      subtitle: "QR 결제",
      amount: amount,
      type: "debit", // 사용(차감)
      icon: "/images/list_gs25.webp",
    }

    // 기존 결제 내역 가져오기
    let history: HistoryItem[] = []
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)

    if (storedHistory) {
      try {
        history = JSON.parse(storedHistory)
      } catch (e) {
        console.error("결제 내역 파싱 오류:", e)
      }
    }

    // 새 결제 내역 추가
    history.unshift(newPayment) // 배열 맨 앞에 추가

    // localStorage에 저장
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history))

    console.log("[History] 결제 내역 추가 완료:", newPayment)
    return newPayment
  } catch (error) {
    console.error("결제 내역 추가 오류:", error)
    return null
  }
}

// 결제 내역 가져오기
export const getPaymentHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return []

  try {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (storedHistory) {
      return JSON.parse(storedHistory)
    }
  } catch (e) {
    console.error("결제 내역 가져오기 오류:", e)
  }

  return []
}

// 기본 더미 데이터 (로컬 스토리지의 결제 내역은 이 앞에 동적으로 추가됨)
export const mainHistoryData: HistoryItem[] = [
  {
    id: "2",
    date: yesterday.toISOString(),
    title: "SOLVION 포인트 충전",
    subtitle: "정기 충전",
    amount: 100000,
    type: "credit",
    icon: "/images/list_wallet.webp",
  },
  {
    id: "3",
    date: twoDaysAgo.toISOString(),
    title: "친구 초대 보너스",
    subtitle: "친구 초대 이벤트",
    amount: 10000,
    type: "credit",
    icon: "/images/list_friend.webp",
  },
]

export const rewardHistoryData: HistoryItem[] = [
  {
    id: "1",
    date: today.toISOString(),
    title: "리워드 포인트 적립",
    subtitle: "쇼핑 적립",
    amount: 500,
    type: "credit",
    category: "reward",
    icon: "/images/reward.webp",
  },
  {
    id: "2",
    date: yesterday.toISOString(),
    title: "첫 결제 보너스",
    subtitle: "보너스 적립",
    amount: 1000,
    type: "credit",
    category: "reward",
    icon: "/images/bonus.webp",
  },
  {
    id: "3",
    date: twoDaysAgo.toISOString(),
    title: "친구 초대 보너스",
    subtitle: "초대 이벤트",
    amount: 2000,
    type: "credit",
    category: "reward",
    icon: "/images/invite.webp",
  },
  {
    id: "4",
    date: threeDaysAgo.toISOString(),
    title: "출석 이벤트 보상",
    subtitle: "7일 연속 출석",
    amount: 3000,
    type: "credit",
    category: "reward",
    icon: "/images/attendance.webp",
  },
]

// 전체 내역 데이터 - 로컬 스토리지의 결제 내역 포함
export const getFullHistoryData = (): HistoryItem[] => {
  const paymentHistory = getPaymentHistory()
  return [
    ...paymentHistory, // 로컬 스토리지의 결제 내역 먼저 추가
    ...mainHistoryData,
    ...rewardHistoryData,
    {
      id: "5",
      date: threeDaysAgo.toISOString(),
      title: "신규 회원 혜택",
      subtitle: "가입 보너스",
      amount: 15000,
      type: "credit",
      icon: "/images/newcomer.webp",
    },
    {
      id: "6",
      date: threeDaysAgo.toISOString(),
      title: "프로모션 적립",
      subtitle: "여름 이벤트",
      amount: 6000,
      type: "credit",
      icon: "/images/promotion.webp",
    },
  ]
}

// 메인페이지에서 사용할 최신 내역 데이터 가져오기 (최대 2개)
export const getLatestHistoryData = (limit: number = 2): HistoryItem[] => {
  const paymentHistory = getPaymentHistory()
  const combinedHistory = [...paymentHistory, ...mainHistoryData]

  // 날짜 기준으로 정렬 (최신순)
  combinedHistory.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return combinedHistory.slice(0, limit)
}
