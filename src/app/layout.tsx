import "./globals.scss"
import Header from "@/components/layout/Header"
import BottomTab from "@/components/layout/BottomTab"
import { Metadata } from "next"
import Script from "next/script"

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N9EYYG9XTF"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N9EYYG9XTF');
          `}
        </Script>

        <div className="app-container">
          <Header />
          <main className="main-content">{children}</main>
          <BottomTab />
        </div>
      </body>
    </html>
  )
}
