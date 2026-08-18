// src/app/layout.tsx
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
  {`
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "y48lg0qll8");
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
