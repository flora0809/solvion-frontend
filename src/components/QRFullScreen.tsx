// src/components/QRFullScreen.tsx
"use client"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { createPortal } from "react-dom"

// SVG 파일 import
import ConerSvg from "@/assets/icons/Coner.svg"

// QR 풀스크린 컴포넌트 속성 정의
interface QRFullScreenProps {
  qrValue: string
  isOpen: boolean
  onClose: () => void
}

const QRFullScreen: React.FC<QRFullScreenProps> = ({
  qrValue,
  isOpen,
  onClose,
}) => {
  const [closing, setClosing] = useState(false)
  const [qrSize, setQrSize] = useState(280)
  const [mounted, setMounted] = useState(false)

  // 클라이언트 사이드에서만 렌더링하기 위한 처리
  useEffect(() => {
    setMounted(true)
    // 모달이 열릴 때 body 스크롤 방지
    if (isOpen) document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // 화면 크기에 따라 QR 크기 조정
  useEffect(() => {
    const handleResize = () => {
      // 모바일과 데스크톱에 따라 다른 크기 설정
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

  // 닫기 애니메이션 처리
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      onClose()
      setClosing(false)
    }, 300)
  }

  // 배경 클릭으로 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // 햅틱 피드백 함수
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(50)
      } catch (e) {
        console.log("Haptic feedback not supported")
      }
    }
  }

  // 컴포넌트 마운트 확인 또는 모달이 닫혀있으면 null 반환
  if (!mounted || !isOpen) return null

  // React Portal을 사용하여 모달을 body에 직접 렌더링
  return createPortal(
    <div
      className={`qr-fullscreen-overlay ${closing ? "closing" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className={`qr-fullscreen-content ${closing ? "closing" : ""}`}>
        <div className="qr-container-large">
          <ConerSvg className="corner corner-tl" />
          <ConerSvg className="corner corner-tr" />
          <ConerSvg className="corner corner-br" />
          <ConerSvg className="corner corner-bl" />
          {/* 스캔 라인 추가 */}
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
          <div className="scanning-text">Scanning...</div>
        </div>
        <button
          className="qr-close-button btn"
          onClick={() => {
            triggerHaptic()
            handleClose()
          }}
        >
          취소
        </button>
      </div>
    </div>,
    document.body
  )
}

export default QRFullScreen
