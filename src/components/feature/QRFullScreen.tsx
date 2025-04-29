"use client"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import ConerSvg from "@/assets/icons/Coner.svg"
import { DEDUCT_AMOUNT } from "@/app/page" // 메인 페이지에서 정의한 상수 임포트

interface QRFullScreenProps {
  qrValue: string
  isOpen: boolean
  onClose: () => void
  deductAmount?: number
}

const QRFullScreen: React.FC<QRFullScreenProps> = ({
  qrValue,
  isOpen,
  onClose,
  deductAmount = DEDUCT_AMOUNT, // 기본값을 DEDUCT_AMOUNT 상수로 설정
}) => {
  const router = useRouter()
  const [closing, setClosing] = useState(false)
  const [qrSize, setQrSize] = useState(280)
  const [mounted, setMounted] = useState(false)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleResize = () => {
      const size =
        window.innerWidth <= 768
          ? Math.min(window.innerWidth * 0.7, 280)
          : Math.min(window.innerWidth * 0.3, 350)
      setQrSize(size)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const triggerHaptic = (pattern: number | number[] = 50) => {
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern)
      } catch (e) {
        console.log("Haptic feedback not supported")
      }
    }
  }

  const handleQRClick = () => {
    if (scanning) return
    setScanning(true)
    triggerHaptic([50, 30, 50])

    // 사용할 결제 금액 (props로 전달된 값 또는 기본값)
    const paymentAmount = deductAmount || DEDUCT_AMOUNT

    setTimeout(() => {
      setClosing(true)
      setTimeout(() => {
        onClose()
        setClosing(false)
        setScanning(false)

        // 천 단위 쉼표 포맷팅 적용
        const formattedAmount = paymentAmount.toLocaleString("ko-KR")

        // success 페이지로 이동 - 차감 및 내역 추가 지시
        router.push(
          `/success?title=포인트 결제 성공!&amount=${formattedAmount}&unit=SLVN Point&performDeduct=true`
        )
      }, 300)
    }, 800)
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div
      className={`qr-fullscreen-overlay ${closing ? "closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={`qr-fullscreen-content ${closing ? "closing" : ""}`}>
        <div
          className={`qr-container-large ${scanning ? "scanning" : ""}`}
          onClick={handleQRClick}
        >
          <ConerSvg className="corner corner-tl" />
          <ConerSvg className="corner corner-tr" />
          <ConerSvg className="corner corner-br" />
          <ConerSvg className="corner corner-bl" />
          <div className="scan-line"></div>
          <QRCode
            className="qr-code"
            value={qrValue}
            size={qrSize}
            level="M"
            fgColor="#000"
            bgColor="#fff"
          />
        </div>
        <div className="qr-overlay-status">
          <div className="scanning-text">
            {scanning ? "Processing..." : "Scanning..."}
          </div>
        </div>
        <button
          className="qr-close-button btn"
          onClick={() => {
            triggerHaptic()
            handleClose()
          }}
          disabled={scanning}
        >
          취소
        </button>
      </div>
    </div>,
    document.body
  )
}

export default QRFullScreen
