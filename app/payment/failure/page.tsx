"use client"

import { FloatingParticles } from "@/components/floating-particles"
import Link from "next/link"
import { XCircle, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function FailureContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")
  const txnId = searchParams.get("txn_id")

  const getErrorMessage = () => {
    switch (reason) {
      case "no_data":
        return "No payment data received from the gateway."
      case "invalid_response":
        return "Invalid response from payment gateway."
      case "txn_not_found":
        return "Transaction not found in our records."
      case "parse_error":
        return "Error processing payment response."
      case "error":
        return "An error occurred while processing your payment."
      default:
        return "Your payment could not be completed. Please try again."
    }
  }

  return (
    <div className="relative z-20 max-w-lg mx-auto px-4 text-center">
      <div className="relative bg-black/90 border border-red-800/40 p-8 sm:p-12 rounded-sm overflow-hidden">
        <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-red-600/40" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-red-600/40" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-red-600/40" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-red-600/40" />

        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />

        <h1 className="font-serif text-3xl sm:text-4xl text-red-500 tracking-widest mb-4 animate-flicker">
          PAYMENT FAILED
        </h1>

        <p className="text-gray-400 mb-6">
          {getErrorMessage()}
        </p>

        {txnId && (
          <div className="p-3 bg-red-950/20 border border-red-900/50 mb-6">
            <p className="text-red-400 font-mono text-sm">
              Transaction ID: {txnId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/payment"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-red-900/50 text-red-500 font-mono text-sm tracking-wider hover:bg-red-600/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            TRY AGAIN
          </Link>
          <Link
            href="/profile"
            className="px-6 py-3 border border-gray-800 text-gray-400 font-mono text-sm tracking-wider hover:bg-gray-900/50 transition-all"
          >
            GO TO PROFILE
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <FloatingParticles />

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-red-950/10 to-black" />
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <Suspense fallback={<div className="text-red-500 font-mono">Loading...</div>}>
        <FailureContent />
      </Suspense>
    </main>
  )
}
