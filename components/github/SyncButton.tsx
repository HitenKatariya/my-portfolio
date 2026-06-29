"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"

type SyncButtonProps = {
  onSync: () => Promise<void>
}

export default function SyncButton({ onSync }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      await onSync()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={syncing}
      className="inline-flex items-center gap-2 rounded-lg border border-[#27cbcb]/40 bg-[#27cbcb]/10 px-5 py-2.5 text-sm font-semibold text-[#27cbcb] transition hover:bg-[#27cbcb]/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
      {syncing ? "Syncing..." : "Sync GitHub"}
    </button>
  )
}
