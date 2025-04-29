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

export const mainHistoryData: HistoryItem[] = [
  {
    id: "1",
    date: today.toISOString(),
    title: "SOLVION 결제 충전",
    subtitle: "빠른 충전",
    amount: 3000000,
    type: "credit",
    icon: "/images/list_wallet.webp",
  },
  {
    id: "2",
    date: today.toISOString(),
    title: "GS25 포인트 결제",
    subtitle: "신규 가입 보너스",
    amount: 5000,
    type: "debit",
    icon: "/images/list_gs25.webp",
  },
  {
    id: "3",
    date: yesterday.toISOString(),
    title: "SOLVION 포인트 충전",
    subtitle: "정기 충전",
    amount: 100000,
    type: "credit",
    icon: "/images/list_charge.webp",
  },
  {
    id: "4",
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

// 전체 내역을 위한 더 많은 데이터
export const fullHistoryData: HistoryItem[] = [
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

// 최신 내역 데이터 가져오기 함수
export const getLatestHistoryData = (limit = 2): HistoryItem[] => {
  try {
    // localStorage에 저장된 결제 내역이 있으면 가져오기
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("solvion_payment_history")

      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory) as HistoryItem[]

          // 기존 데이터와 합치기
          const combinedData = [...parsedHistory, ...mainHistoryData]

          // 날짜순 정렬
          const sortedData = combinedData.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )

          // 중복 제거 (id 기준)
          const uniqueData = sortedData.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
          )

          return uniqueData.slice(0, limit)
        } catch (e) {
          console.error("내역 파싱 오류:", e)
        }
      }
    }

    // 로컬스토리지에 데이터가 없으면 기본 데이터 반환
    return mainHistoryData.slice(0, limit)
  } catch (error) {
    console.error("내역 데이터 로드 오류:", error)
    return mainHistoryData.slice(0, limit)
  }
}

// 결제 내역 추가 함수
export const addPaymentHistory = (amount: number): HistoryItem | null => {
  try {
    if (typeof window === "undefined") return null

    // 새 결제 내역 생성
    const newPayment: HistoryItem = {
      id: `payment_${Date.now()}`,
      date: new Date().toISOString(),
      title: "포인트 결제",
      subtitle: "QR 결제",
      amount: amount,
      type: "debit",
      icon: "/images/list_payment.webp",
    }

    // 기존 내역 가져오기
    let storedHistory: HistoryItem[] = []
    const storedData = localStorage.getItem("solvion_payment_history")

    if (storedData) {
      try {
        storedHistory = JSON.parse(storedData)
      } catch (e) {
        console.error("내역 파싱 오류:", e)
      }
    }

    // 새 내역 추가
    const updatedHistory = [newPayment, ...storedHistory]

    // localStorage에 저장
    localStorage.setItem(
      "solvion_payment_history",
      JSON.stringify(updatedHistory)
    )

    return newPayment
  } catch (error) {
    console.error("결제 내역 추가 오류:", error)
    return null
  }
}
