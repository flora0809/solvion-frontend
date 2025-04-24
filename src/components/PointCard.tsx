// src/components/PointCard.tsx
"use client"

import { useEffect, useState, useRef } from "react"
import QRCode from "react-qr-code"
import JsBarcode from "jsbarcode"
import QRFullScreen from "./QRFullScreen"

// 컴포넌트 속성 정의
interface PointCardProps {
  // 카드 타입: 'home' - 홈화면용, 'reward' - 리워드 페이지용
  variant?: "home" | "reward"
  // 포인트 값
  points?: string
  // QR코드 클릭 시 이동할 경로 (확대보기 등)
  qrLinkPath?: string
  // QR 코드 값
  qrValue?: string
  // 바코드 값 (기본값 설정)
  barcodeValue?: string
}

export default function PointCard({
  variant = "home",
  points = "100M",
  qrLinkPath = "/qr",
  qrValue = "https://solvion.app/user/12345",
  barcodeValue = "5241966751362770",
}: PointCardProps) {
  // 반응형 처리를 위한 상태
  const [isMobile, setIsMobile] = useState(true)
  // 복사 완료 메시지 상태
  const [copySuccess, setCopySuccess] = useState(false)
  // 바코드 SVG ref
  const barcodeRef = useRef<SVGSVGElement>(null)
  // 숨겨진 입력 필드 ref (iOS 호환성용)
  const textInputRef = useRef<HTMLInputElement>(null)
  // QR 풀스크린 상태
  const [qrFullScreen, setQrFullScreen] = useState(false)
  // QR 코드 애니메이션 상태
  const [qrHovered, setQrHovered] = useState(false)

  // 화면 크기에 따라 모바일/데스크톱 구분
  useEffect(() => {
    // 초기 값 설정
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 668)
    }

    // 컴포넌트 마운트 시 호출
    checkScreenSize()

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // 바코드 생성 및 업데이트
  useEffect(() => {
    if (variant === "home" && barcodeRef.current) {
      const height = isMobile ? 38 : 66

      // JsBarcode를 사용하여 바코드 생성
      JsBarcode(barcodeRef.current, barcodeValue, {
        format: "CODE128",
        width: 1.5, // 바의 너비
        height: height,
        displayValue: false,
        margin: 0,
        background: "#ffffff",
      })

      // SVG 요소를 반응형으로 만들기
      if (barcodeRef.current) {
        // width를 100%로 설정
        barcodeRef.current.setAttribute("width", "100%")

        // preserveAspectRatio를 "none"으로 설정하여 컨테이너에 맞게 늘림
        barcodeRef.current.setAttribute("preserveAspectRatio", "none")

        // viewBox가 없으면 생성
        if (!barcodeRef.current.getAttribute("viewBox")) {
          const svgWidth = barcodeRef.current.getAttribute("width") || "186"
          const svgHeight =
            barcodeRef.current.getAttribute("height") || height.toString()

          // viewBox 값을 설정
          barcodeRef.current.setAttribute(
            "viewBox",
            `0 0 ${parseFloat(svgWidth)} ${parseFloat(svgHeight)}`
          )
        }
      }
    }
  }, [barcodeValue, isMobile, variant])

  // 화면 크기에 따라 QR 코드 크기 조정
  const qrSize = isMobile ? 46 : 64

  // 바코드 높이 계산 - 세로 높이 강제 적용
  const barcodeHeight = isMobile ? 38 : 66

  // 포맷된 바코드 번호 (표시용)
  const formattedBarcodeNumber = barcodeValue.replace(
    /(\d{4})(\d{4})(\d{4})(\d{4})/,
    "$1 $2 $3 $4"
  )

  // QR 코드 클릭 핸들러 - 풀스크린 모달 표시
  const handleQRClick = (e: React.MouseEvent) => {
    e.preventDefault() // 기본 링크 동작 방지

    // 햅틱 피드백
    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(50)
      } catch (e) {
        // 진동 API 지원하지 않는 기기에서 예외 처리
      }
    }

    setQrFullScreen(true)
  }

  // 복사
  const handleCopy = () => {
    try {
      // 먼저 최신 API 시도
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(barcodeValue)
          .then(() => {
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
          })
          .catch(fallbackCopy)
      } else {
        // 클립보드 API를 지원하지 않는 경우 대체 방법 사용
        fallbackCopy()
      }
    } catch (err) {
      // 오류 발생 시 대체 방법 사용
      fallbackCopy()
    }
  }

  // 클립보드 API를 지원하지 않는 경우 사용할 대체 방법
  const fallbackCopy = () => {
    try {
      // 숨겨진 input 필드에 값 설정
      if (textInputRef.current) {
        textInputRef.current.value = barcodeValue
        textInputRef.current.select()
        textInputRef.current.setSelectionRange(0, 99999) // 모바일에서 필요한 경우가 있음

        // 복사 실행
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
          {/* 상단 영역: 타이틀/포인트와 QR 코드를 감싸는 플렉스 컨테이너 */}
          <div className="card-top-section">
            {/* 포인트 표시 영역 */}
            <div className="points-info-box">
              <div className="card-header">
                <h2 className="card-title">솔비온 포인트</h2>
              </div>
              <div className="card-points">
                <h3 className="points-value">{points}</h3>
                <div className="points-badge">
                  <span>P</span>
                </div>
              </div>
            </div>

            {/* QR 코드 영역 */}
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

          {/* 바코드 영역 */}
          {variant === "home" && (
            <div className="barcode-container">
              <div
                className="barcode-wrapper"
                style={{ height: `${barcodeHeight}px` }}
              >
                {/* JSBarcode를 위한 SVG 요소 */}
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

                {/* 숨겨진 input 필드 (iOS 호환성을 위한 복사용) */}
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

          {/* 리워드 페이지용 버튼 - 리워드 화면에서만 표시 */}
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

      {/* QR 풀스크린 모달 */}
      <QRFullScreen
        qrValue={qrValue}
        isOpen={qrFullScreen}
        onClose={() => setQrFullScreen(false)}
      />
    </>
  )
}
