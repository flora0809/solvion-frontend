const handleQRClick = () => {
  if (scanning) return

  setScanning(true)
  triggerHaptic([50, 30, 50])

  const paymentAmount = deductAmount || DEFAULT_DEDUCT_AMOUNT

  setTimeout(() => {
    setClosing(true)

    setTimeout(() => {
      onClose()
      setClosing(false)
      setScanning(false)

      const formattedAmount = paymentAmount.toLocaleString("ko-KR")

      // GA4: QR 포인트 결제 완료
      const gtag = (
        window as typeof window & {
          gtag?: (
            command: "event",
            eventName: string,
            params?: Record<string, unknown>
          ) => void
        }
      ).gtag

      gtag?.("event", "qr_payment_completed", {
        payment_method: "qr",
        point_amount: paymentAmount,
        point_unit: "SLVN Point",
      })

      router.push(
        `/success?title=포인트 결제 성공!&amount=${formattedAmount}&unit=SLVN Point&performDeduct=true`
      )
    }, 300)
  }, 800)
}
