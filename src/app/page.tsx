// src/app/page.tsx
import PointCard from "@/components/PointCard"
import styles from "./page.module.scss"
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.page}>
      {/* QR 카드 컴포넌트 사용 */}
      <PointCard variant="home" points="100M" qrLinkPath="/qr" />
      {/* 하단 메뉴 아이콘 */}
      <div className={styles.menuIcons}>
        <div className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_charge.svg)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>충전</span>
        </div>
        <div className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_history.svg)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>내역</span>
        </div>
        <div className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_coupon.svg)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>쿠폰함</span>
        </div>
        <div className={styles.menuItem}>
          <div
            className={styles.iconContainer}
            style={{
              backgroundImage: "url(/images/home_reward.svg)",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%",
            }}
          />
          <span>리워드포인트</span>
        </div>
      </div>

      {/* 이벤트 배너 */}
      {(() => {
        // 이벤트 변수
        const eventInfo = {
          imagePath: "/images/Home_Event_250423.png", // 이미지 경로 - 교체 시 여기만 수정
          title: "SOLVION 신규가입하면 선착순 5,000 포인트 받아요",
          link: "/event",
          actionText: "받으러가기",
        }

        return (
          <Link href={eventInfo.link} className={styles.eventCard}>
            <div
              className={styles.eventImage}
              style={{
                backgroundImage: `url(${eventInfo.imagePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }}
            />
            <div className={styles.eventContent}>
              <span className={styles.eventLabel}>EVENT</span>
              <h3 className={styles.eventTitle}>{eventInfo.title}</h3>
              <div className={styles.eventAction}>{eventInfo.actionText} →</div>
            </div>
          </Link>
        )
      })()}

      {/* 최근 기록 섹션 */}
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>최근기록</h3>
          <button className={styles.addButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#9E831E" />
              <path
                d="M10 5V15M5 10H15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 캘린더 */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <h4 className={styles.calendarTitle}>May 2025</h4>
            <div className={styles.calendarControls}>
              <button className={styles.controlButton}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="#9E831E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className={styles.controlButton}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="#9E831E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* 달력 내용 */}
        </div>

        {/* 거래 내역 */}
        <div className={styles.historyList}>
          <div className={styles.historyItem}>
            <div className={`${styles.historyIcon} ${styles.walletIcon}`}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="8" fill="#FE8669" />
                <path
                  d="M12 16C12 14.8954 12.8954 14 14 14H34C35.1046 14 36 14.8954 36 16V32C36 33.1046 35.1046 34 34 34H14C12.8954 34 12 33.1046 12 32V16Z"
                  fill="#FFEBA2"
                />
                <path
                  d="M36 22H31C29.3431 22 28 23.3431 28 25C28 26.6569 29.3431 28 31 28H36V22Z"
                  fill="#9E831E"
                />
                <circle cx="31" cy="25" r="2" fill="#FFEBA2" />
              </svg>
            </div>
            <div className={styles.historyContent}>
              <div className={styles.historyTitle}>
                <span className={styles.titleText}>SOLVION 월렛 충전</span>
                <span className={styles.historyAmount}>+3,000,000 P</span>
              </div>
            </div>
          </div>

          <div className={styles.historyItem}>
            <div className={styles.historyIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="4" fill="white" />
                <text
                  x="24"
                  y="26"
                  fontFamily="Arial"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#00AAFF"
                  textAnchor="middle"
                >
                  GS
                </text>
                <text
                  x="24"
                  y="36"
                  fontFamily="Arial"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#00AAFF"
                  textAnchor="middle"
                >
                  25
                </text>
              </svg>
            </div>
            <div className={styles.historyContent}>
              <div className={styles.historyTitle}>
                <span className={styles.titleText}>편의점 - 지에스 25</span>
                <span className={styles.historyAmount}>+3,000,000 P</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
