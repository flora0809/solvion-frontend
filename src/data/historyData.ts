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
