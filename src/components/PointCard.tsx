// src/components/PointCard.tsx
"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import QRCode from "react-qr-code"
import JsBarcode from "jsbarcode"

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
        width: 1.5, // 바의 너비 - 얇게
        height: height, // 모바일 또는 PC에 따른 높이
        displayValue: false, // 숫자 표시 안함
        margin: 0, // 여백 없음
        background: "#ffffff",
      })

      // 중요: SVG 요소의 width 속성을 100%로 변경
      if (barcodeRef.current) {
        barcodeRef.current.setAttribute("width", "100%")
        // viewBox 속성이 있는지 확인 (없으면 생성)
        if (!barcodeRef.current.getAttribute("viewBox")) {
          const svgWidth = barcodeRef.current.getAttribute("width")
          const svgHeight = barcodeRef.current.getAttribute("height")
          if (svgWidth && svgHeight) {
            // viewBox 속성 설정 (원래 크기를 viewBox로 설정)
            const viewBox = `0 0 ${parseFloat(svgWidth)} ${parseFloat(
              svgHeight
            )}`
            barcodeRef.current.setAttribute("viewBox", viewBox)
          }
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
    <div className="qr-card-wrapper">
      <div className="qr-card">
        <div className="card-header">
          <h2 className="card-title">솔비온 포인트</h2>
        </div>

        {/* 포인트 표시 영역 */}
        <div className="card-points">
          <h3 className="points-value">{points}</h3>
          <div className="points-badge">
            <span>P</span>
          </div>
        </div>

        {/* QR 코드 컨테이너 - 홈 화면에서만 표시 */}
        {variant === "home" && (
          <Link href={qrLinkPath} className="qr-container">
            <div className="qr-wrapper">
              <QRCode
                value={qrValue}
                size={qrSize}
                level="M"
                fgColor="#000"
                bgColor="#fff"
              />
            </div>
          </Link>
        )}

        {/* 바코드 영역 - 홈 화면에서만 표시 */}
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
  )
}
