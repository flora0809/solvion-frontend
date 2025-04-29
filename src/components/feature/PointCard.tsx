"use client"

import { useEffect, useState, useRef } from "react"
import QRCode from "react-qr-code"
import JsBarcode from "jsbarcode"
import QRFullScreen from "./QRFullScreen"
import { DEDUCT_AMOUNT } from "@/app/page" // 메인 페이지에서 정의한 상수 임포트

interface PointCardProps {
  variant?: "home" | "reward"
  initialPoints?: string
  qrLinkPath?: string
  qrValue?: string
  barcodeValue?: string
  deductAmount?: number // deductAmount 속성 추가
}

// localStorage 키 상수
const POINTS_STORAGE_KEY = "solvion_demo_points"
const HISTORY_STORAGE_KEY = "solvion_payment_history" // 내역 저장 키 추가
const INITIAL_POINTS = "1,000,000"

export default function PointCard({
  variant = "home",
  initialPoints = INITIAL_POINTS,
  qrLinkPath = "/qr",
  qrValue = "https://solvion.app/user/12345",
  barcodeValue = "5241966751362770",
  deductAmount = DEDUCT_AMOUNT, // 기본값 설정
}: PointCardProps) {
  const [isMobile, setIsMobile] = useState(true)
  const [copySuccess, setCopySuccess] = useState(false)
  const barcodeRef = useRef<SVGSVGElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const [qrFullScreen, setQrFullScreen] = useState(false)
  const [qrHovered, setQrHovered] = useState(false)
  const [points, setPoints] = useState(initialPoints)
  const [tapCount, setTapCount] = useState(0)
  const tapTimer = useRef<NodeJS.Timeout | null>(null)

  // localStorage에서 포인트 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedPoints = localStorage.getItem(POINTS_STORAGE_KEY)
        if (storedPoints) {
          setPoints(storedPoints)
        } else {
          localStorage.setItem(POINTS_STORAGE_KEY, initialPoints)
          setPoints(initialPoints)
        }
      } catch (error) {
        console.error("LocalStorage 에러:", error)
      }
    }
  }, [initialPoints])

  // 스토리지 변경 감지
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPoints = localStorage.getItem(POINTS_STORAGE_KEY)
      if (storedPoints) {
        setPoints(storedPoints)
      }
    }
    const interval = setInterval(handleStorageChange, 500)
    return () => clearInterval(interval)
  }, [])

  // 화면 크기 체크
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 668)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // 바코드 생성
  useEffect(() => {
    if (variant === "home" && barcodeRef.current) {
      const height = isMobile ? 38 : 66
      JsBarcode(barcodeRef.current, barcodeValue, {
        format: "CODE128",
        width: 1.5,
        height: height,
        displayValue: false,
        margin: 0,
        background: "#ffffff",
      })
      if (barcodeRef.current) {
        barcodeRef.current.setAttribute("width", "100%")
        barcodeRef.current.setAttribute("preserveAspectRatio", "none")
        if (!barcodeRef.current.getAttribute("viewBox")) {
          const svgWidth = barcodeRef.current.getAttribute("width") || "186"
          const svgHeight =
            barcodeRef.current.getAttribute("height") || height.toString()
          barcodeRef.current.setAttribute(
            "viewBox",
            `0 0 ${parseFloat(svgWidth)} ${parseFloat(svgHeight)}`
          )
        }
      }
    }
  }, [barcodeValue, isMobile, variant])

  const qrSize = isMobile ? 46 : 64
  const barcodeHeight = isMobile ? 38 : 66
  const formattedBarcodeNumber = barcodeValue.replace(
    /(\d{4})(\d{4})(\d{4})(\d{4})/,
    "$1 $2 $3 $4"
  )

  const handleQRClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(50)
      } catch (e) {}
    }
    setQrFullScreen(true)
  }

  const handlePointsTap = () => {
    setTapCount((prev) => prev + 1)
    if (tapTimer.current) clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => {
      if (tapCount === 1) {
        try {
          // 포인트 리셋
          localStorage.setItem(POINTS_STORAGE_KEY, INITIAL_POINTS)
          setPoints(INITIAL_POINTS)

          // 내역도 함께 리셋 (추가)
          localStorage.removeItem(HISTORY_STORAGE_KEY)
          console.log("포인트 및 내역 리셋 완료")

          if (window.navigator && window.navigator.vibrate) {
            try {
              window.navigator.vibrate([50, 100, 50])
            } catch (e) {}
          }
        } catch (error) {
          console.error("리셋 에러:", error)
        }
      }
      setTapCount(0)
    }, 300)
  }

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(barcodeValue)
          .then(() => {
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
          })
          .catch(fallbackCopy)
      } else {
        fallbackCopy()
      }
    } catch (err) {
      fallbackCopy()
    }
  }

  const fallbackCopy = () => {
    try {
      if (textInputRef.current) {
        textInputRef.current.value = barcodeValue
        textInputRef.current.select()
        textInputRef.current.setSelectionRange(0, 99999)
        const successful = document.execCommand("copy")
        if (successful) {
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        } else {
          console.error("복사 실패")
        }
      }
    } catch (err) {
      console.error("복사에 실패했습니다:", err)
    }
  }

  return (
    <>
      <div className="qr-card-wrapper">
        <div className="qr-card">
          <div className="card-top-section">
            <div className="points-info-box">
              <div className="card-header">
                <h2 className="card-title">솔비온 포인트</h2>
              </div>
              <div className="card-points">
                <h3 className="points-value" onClick={handlePointsTap}>
                  {points}
                </h3>
                <div className="points-badge">
                  <span>P</span>
                </div>
              </div>
            </div>
            {variant === "home" && (
              <div className="qr-area">
                <div
                  className={`qr-container ${qrHovered ? "active" : ""}`}
                  onClick={handleQRClick}
                  onMouseEnter={() => setQrHovered(true)}
                  onMouseLeave={() => setQrHovered(false)}
                  onTouchStart={() => setQrHovered(true)}
                  onTouchEnd={() => setTimeout(() => setQrHovered(false), 300)}
                >
                  <div className="qr-wrapper">
                    <div className="qr-border-effect"></div>
                    <QRCode
                      value={qrValue}
                      size={qrSize}
                      level="M"
                      fgColor="#000"
                      bgColor="#fff"
                    />
                    <div className="qr-tap-hint">탭</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {variant === "home" && (
            <div className="barcode-container">
              <div
                className="barcode-wrapper"
                style={{ height: `${barcodeHeight}px` }}
              >
                <svg
                  ref={barcodeRef}
                  className="barcode-svg"
                  style={{ width: "100%", height: `${barcodeHeight}px` }}
                  preserveAspectRatio="none"
                ></svg>
              </div>
              <div className="barcode-info">
                <div className="barcode-number">{formattedBarcodeNumber}</div>
                <button
                  className={`copy-button ${copySuccess ? "success" : ""}`}
                  onClick={handleCopy}
                  aria-label="바코드 번호 복사"
                >
                  {copySuccess ? "완료" : "복사"}
                </button>
                <input
                  ref={textInputRef}
                  type="text"
                  defaultValue={barcodeValue}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                  readOnly
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
          {variant === "reward" && (
            <div className="card-actions">
              <button className="btn btn-primary">포인트 전환하기</button>
              <button className="btn btn-secondary">포인트 적립내역</button>
            </div>
          )}
        </div>
        <div className="qr-card-shadow primary-shadow"></div>
        <div className="qr-card-shadow secondary-shadow"></div>
      </div>
      <QRFullScreen
        qrValue={qrValue}
        isOpen={qrFullScreen}
        onClose={() => setQrFullScreen(false)}
        deductAmount={deductAmount} // 부모 컴포넌트에서 전달받은 금액 전달
      />
    </>
  )
}
