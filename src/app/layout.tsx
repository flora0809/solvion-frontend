// src/app/layout.tsx
import "./globals.scss"
import Header from "@/components/Header"
import BottomTab from "@/components/BottomTab"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SOLVION",
  description: "SOLVION 모바일 앱",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="app-container">
          <Header />
          <main className="main-content">{children}</main>
          <BottomTab />
        </div>
      </body>
    </html>
  )
}
