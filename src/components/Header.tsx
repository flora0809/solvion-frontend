// src/components/Header.tsx
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo-container">
          <h1 className="logo">
            <Image
              src="/images/logo_w.svg"
              alt="Solvion Logo"
              width={120}
              height={24}
              className="logo-svg"
              priority
            />
          </h1>
        </Link>

        <div className="header-actions">
          <button className="icon-button search" aria-label="검색">
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
                d="M11.6115 2.5C6.30323 2.5 2 6.70819 2 11.8993C2 17.0903 6.30323 21.2985 11.6115 21.2985C13.8819 21.2985 15.9684 20.5287 17.613 19.2415L20.7371 22.2886L20.8202 22.3586C21.1102 22.5685 21.5214 22.5446 21.7839 22.2873C22.0726 22.0043 22.072 21.5459 21.7825 21.2636L18.6952 18.2523C20.2649 16.5794 21.2231 14.3487 21.2231 11.8993C21.2231 6.70819 16.9198 2.5 11.6115 2.5ZM11.6115 3.94774C16.1022 3.94774 19.7426 7.50776 19.7426 11.8993C19.7426 16.2908 16.1022 19.8508 11.6115 19.8508C7.12086 19.8508 3.48044 16.2908 3.48044 11.8993C3.48044 7.50776 7.12086 3.94774 11.6115 3.94774Z"
                fill="white"
              />
            </svg>
          </button>

          <button className="icon-button settings" aria-label="설정">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 25 25"
              fill="none"
            >
              <path
                opacity={0.4}
                d="M10.5387 18.4866H3.00317"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.9978 18.4866C21.9978 20.0772 20.6547 21.3666 18.9978 21.3666C17.3409 21.3666 15.9978 20.0772 15.9978 18.4866C15.9978 16.8948 17.3409 15.6066 18.9978 15.6066C20.6547 15.6066 21.9978 16.8948 21.9978 18.4866Z"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                opacity={0.4}
                d="M14.4612 6.76212H21.9979"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.00269 6.76211C3.00269 8.35388 4.34582 9.64211 6.00269 9.64211C7.65955 9.64211 9.00269 8.35388 9.00269 6.76211C9.00269 5.17152 7.65955 3.88211 6.00269 3.88211C4.34582 3.88211 3.00269 5.17152 3.00269 6.76211Z"
                stroke="white"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
