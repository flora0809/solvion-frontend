"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import ShimmerCheck from "@/components/ui/ShimmerCheck"
import styles from "./page.module.scss"

// 내부 컴포넌트
function SuccessContent() {
  // 모든 훅은 컴포넌트 최상위 레벨에서 호출
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(0)
  const [animate, setAnimate] = useState(false)

  // URL 파라미터에서 값 추출
  const title = searchParams
    ? searchParams.get("title") || "포인트 결제 성공!"
    : "포인트 결제 성공!"
  const amount = searchParams ? searchParams.get("amount") || "500" : "500"
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

  // 초기화 효과
  useEffect(() => {
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
  }, [iconType, redirectTime])

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
