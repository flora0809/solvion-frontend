// src/components/ui/ShimmerCheck.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import LoadingSymbol from "@/assets/json/LoadingSymbol.json"
import Check from "@/assets/json/Check.json"
import type { AnimationItem } from "lottie-web"

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
)

const ShimmerCheck: React.FC = () => {
  const [showSVG, setShowSVG] = useState(false)
  const [showCheck, setShowCheck] = useState(false)
  const checkRef = useRef<AnimationItem | null>(null)

  // 로딩-체크 애니메이션 타이밍 계산
  const durationMs = (LoadingSymbol.op / LoadingSymbol.fr) * 1000
  const overlapMs = 500
  const showDelay = Math.max(durationMs - overlapMs, 0)
  const checkDelay = durationMs + 300

  useEffect(() => {
    const t1 = setTimeout(() => setShowSVG(true), showDelay)
    const t2 = setTimeout(() => setShowCheck(true), checkDelay)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [showDelay, checkDelay])

  // 애니메이션 완료 후 45프레임에 고정
  const handleCheckComplete = () => {
    checkRef.current?.goToAndStop(45, true)
  }

  // showCheck가 true 되면 인스턴스에 이벤트 리스너 등록
  useEffect(() => {
    const anim = checkRef.current
    if (showCheck && anim) {
      anim.addEventListener("complete", handleCheckComplete)
      return () => {
        anim.removeEventListener("complete", handleCheckComplete)
      }
    }
  }, [showCheck])

  return (
    <div className="shimmer-check-container">
      {/* 1. Lottie 로딩 심볼 */}
      <Player
        autoplay
        keepLastFrame
        src={LoadingSymbol}
        style={{ width: 96, height: 96 }}
      />

      {/* 2. 오버레이 SoundWave */}
      <div className={`overlay-svg${showSVG ? " animate" : ""}`}>
        <div className="soundwave">
          <div className="bar bar1" />
          <div className="bar bar2" />
          <div className="bar bar3" />
          <div className="bar bar4" />
          <div className="bar bar5" />
          <div className="bar bar6" />
        </div>
      </div>

      {/* 3. 체크 애니메이션 */}
      <div className="check-svg-wrapper">
        {showCheck && (
          <Player
            lottieRef={(instance) => {
              checkRef.current = instance
            }}
            autoplay
            keepLastFrame
            src={Check}
            style={{ width: 32, height: 32 }}
            loop={false}
            rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
          />
        )}
      </div>
    </div>
  )
}

export default ShimmerCheck
