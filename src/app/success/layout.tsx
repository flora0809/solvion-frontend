// app/success/layout.tsx

import type { ReactNode } from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "SOLVION - 결제 완료",
  description: "SOLVION 결제 완료 페이지",
}

export default function SuccessLayout({ children }: { children: ReactNode }) {
  return <div className="success-layout">{children}</div>
}
