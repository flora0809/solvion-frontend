// app/success/layout.tsx

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SOLVION - 결제 완료",
  description: "SOLVION 결제 완료 페이지",
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="success-layout">{children}</div>
}
