// src/components/BottomTab.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function BottomTab() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="bottom-tab">
      <Link href="/" className={`tab-item ${isActive("/") ? "active" : ""}`}>
        <div className="tab-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              opacity={0.4}
              d="M16.0755 2.5H19.4615C20.8637 2.5 22 3.64585 22 5.05996V8.47452C22 9.88864 20.8637 11.0345 19.4615 11.0345H16.0755C14.6732 11.0345 13.537 9.88864 13.537 8.47452V5.05996C13.537 3.64585 14.6732 2.5 16.0755 2.5Z"
              fill="white"
            />
            <path
              d="M7.92449 13.9655C9.32676 13.9655 10.463 15.1114 10.463 16.5255V19.94C10.463 21.3532 9.32676 22.5 7.92449 22.5H4.53852C3.13626 22.5 2 21.3532 2 19.94V16.5255C2 15.1114 3.13626 13.9655 4.53852 13.9655H7.92449ZM19.4615 13.9655C20.8637 13.9655 22 15.1114 22 16.5255V19.94C22 21.3532 20.8637 22.5 19.4615 22.5H16.0755C14.6732 22.5 13.537 21.3532 13.537 19.94V16.5255C13.537 15.1114 14.6732 13.9655 16.0755 13.9655H19.4615ZM7.92449 2.5C9.32676 2.5 10.463 3.64585 10.463 5.05996V8.47452C10.463 9.88864 9.32676 11.0345 7.92449 11.0345H4.53852C3.13626 11.0345 2 9.88864 2 8.47452V5.05996C2 3.64585 3.13626 2.5 4.53852 2.5H7.92449Z"
              fill="white"
            />
          </svg>
        </div>
      </Link>

      <Link
        href="/history"
        className={`tab-item ${isActive("/history") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              opacity={0.4}
              d="M15.7163 16.7234H8.49634"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity={0.4}
              d="M15.7163 12.5369H8.49634"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity={0.4}
              d="M11.2516 8.36005H8.49658"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.9087 3.24982C15.9087 3.24982 8.23173 3.25382 8.21973 3.25382C5.45973 3.27082 3.75073 5.08682 3.75073 7.85682V17.0528C3.75073 19.8368 5.47273 21.6598 8.25673 21.6598C8.25673 21.6598 15.9327 21.6568 15.9457 21.6568C18.7057 21.6398 20.4157 19.8228 20.4157 17.0528V7.85682C20.4157 5.07282 18.6927 3.24982 15.9087 3.24982Z"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>

      <Link href="/scan" className="tab-item tab-item-center">
        <div className="tab-icon-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={16}
            viewBox="0 0 10 11"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.84201 1.23442C5.78575 0.819672 5.43023 0.5 5.00004 0.5C4.53075 0.5 4.15031 0.880436 4.15031 1.34973V4.65025H0.845821L0.730519 4.65801C0.315766 4.71427 -0.00390625 5.06979 -0.00390625 5.49998C-0.00390625 5.96927 0.37653 6.34971 0.845821 6.34971H4.15031V9.65027L4.15807 9.76558C4.21434 10.1803 4.56986 10.5 5.00004 10.5C5.46933 10.5 5.84977 10.1196 5.84977 9.65027V6.34971H9.15427L9.26957 6.34195C9.68433 6.28568 10.004 5.93016 10.004 5.49998C10.004 5.03069 9.62356 4.65025 9.15427 4.65025H5.84977V1.34973L5.84201 1.23442Z"
              fill="white"
            />
          </svg>
        </div>
      </Link>

      <Link
        href="/coupon"
        className={`tab-item ${isActive("/coupon") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.50083 14.2871V14.0681C3.53295 13.4202 3.7406 12.7925 4.10236 12.2496C4.7045 11.5975 5.1167 10.7983 5.29571 9.93598C5.29571 9.2695 5.29571 8.5935 5.35393 7.92703C5.65469 4.71842 8.82728 2.5 11.9611 2.5H12.0387C15.1725 2.5 18.345 4.71842 18.6555 7.92703C18.7137 8.5935 18.6555 9.2695 18.704 9.93598C18.8854 10.8003 19.2972 11.6019 19.8974 12.2591C20.2618 12.7972 20.4698 13.4227 20.4989 14.0681V14.2776C20.5206 15.148 20.2208 15.9968 19.6548 16.6674C18.907 17.4515 17.8921 17.9393 16.8024 18.0384C13.607 18.3812 10.383 18.3812 7.18762 18.0384C6.09914 17.935 5.08576 17.4479 4.33521 16.6674C3.778 15.9963 3.48224 15.1526 3.50083 14.2871Z"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity={0.4}
              d="M9.55493 21.3517C10.0542 21.9784 10.7874 22.384 11.5922 22.4787C12.3971 22.5734 13.2072 22.3494 13.8433 21.8564C14.0389 21.7105 14.2149 21.541 14.3672 21.3517"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>

      <Link
        href="/reward"
        className={`tab-item ${isActive("/reward") ? "active" : ""}`}
      >
        <div className="tab-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={25}
            viewBox="0 0 24 25"
            fill="none"
          >
            <path
              d="M11.7665 21.2551C16.7308 21.2551 20.7551 17.2308 20.7551 12.2666C20.7551 7.30233 16.7308 3.27802 11.7665 3.27802C6.80227 3.27802 2.77795 7.30233 2.77795 12.2666C2.77795 17.2308 6.80227 21.2551 11.7665 21.2551Z"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              opacity={0.4}
              d="M18.0183 18.985L21.5423 22.4999"
              stroke="white"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>
    </nav>
  )
}
