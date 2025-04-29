"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense, useRef } from "react"
import Link from "next/link"
import ShimmerCheck from "@/components/ui/ShimmerCheck"
import styles from "./page.module.scss"
import { addPaymentHistory } from "@/data/historyData" // 결제 내역 추가 함수 임포트

// 상수 직접 정의
const DEFAULT_DEDUCT_AMOUNT = 15000
const POINTS_STORAGE_KEY = "solvion_demo_points"

// 내부 컴포넌트
function SuccessContent() {
  // 모든 훅은 컴포넌트 최상위 레벨에서 호출
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [pointsDeducted, setPointsDeducted] = useState(false)
  const [historyAdded, setHistoryAdded] = useState(false) // 내역 추가 여부

  // 리렌더링으로 인한 중복 차감 및 내역 추가 방지를 위한 ref
  const deductedRef = useRef(false)
  const historyAddedRef = useRef(false)

  // URL 파라미터에서 값 추출
  const title = searchParams
    ? searchParams.get("title") || "포인트 결제 성공!"
    : "포인트 결제 성공!"
  const amount = searchParams ? searchParams.get("amount") || "5,000" : "5,000" // 기본값 5,000으로 설정
  const unit = searchParams
    ? searchParams.get("unit") || "SLVN Point"
    : "SLVN Point"
  const subText = searchParams ? searchParams.get("subText") || "" : ""
  const iconType = searchParams
    ? (searchParams.get("iconType") as
        | "success"
        | "info"
        | "error"
        | "sound") || "success"
    : "success"
  const mainButtonText = searchParams
    ? searchParams.get("mainBtn") || "확인"
    : "확인"
  const mainButtonPath = searchParams
    ? searchParams.get("mainPath") || "/"
    : "/"
  const subButtonText = searchParams
    ? searchParams.get("subBtn") || "상세내역"
    : "상세내역"
  const subButtonPath = searchParams
    ? searchParams.get("subPath") || "/history"
    : "/history"
  const redirectTime = searchParams
    ? parseInt(searchParams.get("redirectTime") || "0")
    : 0
  const redirectPath = searchParams
    ? searchParams.get("redirectPath") || "/"
    : "/"

  // 중요: 차감 수행 여부 플래그 추가
  const performDeduct = searchParams
    ? searchParams.get("performDeduct") === "true"
    : false

  // 포인트 차감 처리 및 내역 추가 함수
  const processPayment = () => {
    // 이미 차감되었거나, 차감이 필요 없는 경우
    if (deductedRef.current || !performDeduct) return

    try {
      if (typeof window === "undefined") return

      // 차감할 금액을 숫자로 변환 (기본값 DEFAULT_DEDUCT_AMOUNT)
      let deductionAmount = DEFAULT_DEDUCT_AMOUNT
      try {
        // URL 파라미터에서 amount 값을 가져와 숫자로 변환
        if (amount) {
          const amountNum = parseInt(amount.replace(/,/g, ""), 10)
          if (!isNaN(amountNum)) {
            deductionAmount = amountNum
          }
        }
      } catch (e) {
        console.error("금액 변환 오류:", e)
      }

      console.log("[Success] 차감할 금액:", deductionAmount)

      // 현재 포인트 가져오기
      const currentPointsStr = localStorage.getItem(POINTS_STORAGE_KEY)
      if (!currentPointsStr) {
        localStorage.setItem(POINTS_STORAGE_KEY, "1,000,000")
        return
      }

      console.log("[Success] 차감 전 포인트 (문자열):", currentPointsStr)

      // 콤마 제거하고 숫자로 변환
      const currentPoints = parseInt(currentPointsStr.replace(/,/g, ""), 10)
      if (isNaN(currentPoints)) {
        console.error("포인트 변환 오류")
        return
      }

      console.log("[Success] 차감 전 포인트 (숫자):", currentPoints)

      // 새 포인트 계산 (최소 0)
      const newPoints = Math.max(0, currentPoints - deductionAmount)
      console.log("[Success] 계산된 새 포인트:", newPoints)

      // 포맷팅 (천 단위 콤마)
      const formattedNewPoints = newPoints.toLocaleString("ko-KR")
      console.log("[Success] 포맷된 새 포인트:", formattedNewPoints)

      // localStorage에 저장
      localStorage.setItem(POINTS_STORAGE_KEY, formattedNewPoints)

      // 차감 완료 표시 - state와 ref 모두 업데이트
      setPointsDeducted(true)
      deductedRef.current = true

      console.log("[Success] 포인트 차감 완료!")

      // 결제 내역 추가
      if (!historyAddedRef.current) {
        const newPayment = addPaymentHistory(deductionAmount)
        if (newPayment) {
          console.log("[Success] 결제 내역 추가 완료:", newPayment)
          setHistoryAdded(true)
          historyAddedRef.current = true
        }
      }
    } catch (error) {
      console.error("포인트 차감 오류:", error)
    }
  }

  // 초기화 효과
  useEffect(() => {
    if (!deductedRef.current && performDeduct) {
      // 포인트 차감 및 내역 추가 처리 - 컴포넌트 마운트 시 한 번만 실행
      processPayment()
    }

    // countdown 초기화
    setCountdown(redirectTime)

    // 나머지 효과들...
    document.body.style.overflow = "hidden"
    setAnimate(true)

    // 햅틱 피드백
    if (window.navigator && window.navigator.vibrate) {
      try {
        if (iconType === "success") {
          window.navigator.vibrate([50, 100, 50])
        } else if (iconType === "error") {
          window.navigator.vibrate([100, 50, 100])
        } else {
          window.navigator.vibrate(50)
        }
      } catch (e) {
        console.log("Haptic feedback not supported")
      }
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, []) // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행되도록 함

  // 자동 리다이렉트 기능
  useEffect(() => {
    if (redirectTime <= 0 || countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, redirectTime])

  // 카운트다운이 0이 되면 리다이렉트
  useEffect(() => {
    if (countdown === 0 && redirectTime > 0) {
      router.push(redirectPath)
    }
  }, [countdown, redirectPath, redirectTime, router])

  // 아이콘 렌더링
  const renderIcon = () => {
    switch (iconType) {
      case "success":
        return (
          <div className={`${styles.completeIcon} ${styles.success}`}>
            <ShimmerCheck />
          </div>
        )
      case "info":
        return <div className={`${styles.completeIcon} ${styles.info}`}></div>
      case "error":
        return <div className={`${styles.completeIcon} ${styles.error}`}></div>
      case "sound":
        return <div className={`${styles.completeIcon} ${styles.sound}`}></div>
      default:
        return (
          <div className={`${styles.completeIcon} ${styles.success}`}></div>
        )
    }
  }

  return (
    <div className={styles.successPage}>
      <div
        className={`${styles.completePage} ${animate ? styles.animateIn : ""}`}
      >
        <div className={styles.completeContainer}>
          {renderIcon()}

          <h1 className={styles.completeTitle}>{title}</h1>

          <div className={styles.completeAmount}>
            <span className={styles.amountValue}>{amount}</span>
            <span className={styles.amountUnit}>{unit}</span>
          </div>

          {/* 신규가입 혜택 배너 */}
          <div className={styles.promotionBanner}>
            <div className={styles.promotionText}>
              SOLVION Pay 신규가입혜택!
            </div>
            <button className={styles.promotionButton}>확인하기</button>
          </div>

          {subText && <p className={styles.completeSubtext}>{subText}</p>}

          {redirectTime > 0 && (
            <div className={styles.redirectCountdown}>
              <span className={styles.countdownNumber}>{countdown}</span>
              <span className={styles.countdownText}>
                초 후 자동으로 이동합니다
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 고정된 하단 버튼 영역 */}
      <div className={styles.completeActions}>
        <Link href={subButtonPath} className="btn btn-secondary">
          {subButtonText}
        </Link>
        <Link href={mainButtonPath} className="btn btn-primary">
          {mainButtonText}
        </Link>
      </div>
    </div>
  )
}

// 메인 컴포넌트
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>로딩 중...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
