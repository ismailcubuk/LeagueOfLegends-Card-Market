"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check, Info, X, AlertTriangle } from "lucide-react"
import { useStore } from "@/components/store-provider"

const ICONS = {
  success: Check,
  info: Info,
  error: AlertTriangle,
}

const ACCENT = {
  success: "text-rarity-legendary border-l-rarity-legendary",
  info: "text-rarity-rare border-l-rarity-rare",
  error: "text-rarity-mythic border-l-rarity-mythic",
}

export function ToastViewport() {
  const { toasts, dismissToast } = useStore()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-border border-l-2 glass-strong p-3 shadow-2xl ${ACCENT[toast.variant]}`}
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-secondary">
                <Icon className="size-4" />
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-sm font-semibold text-foreground">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-muted-foreground">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-muted-foreground transition hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
