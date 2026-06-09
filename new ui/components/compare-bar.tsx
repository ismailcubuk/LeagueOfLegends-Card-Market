"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X, GitCompareArrows } from "lucide-react"
import Image from "next/image"
import { CHAMPIONS, RARITY } from "@/lib/champions"
import { useStore } from "@/components/store-provider"

export function CompareBar() {
  const { compare, toggleCompare, pushToast } = useStore()
  const champs = compare.map((id) => CHAMPIONS.find((c) => c.id === id)!).filter(Boolean)

  return (
    <AnimatePresence>
      {champs.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-[80] mx-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-border glass-strong px-4 py-3 shadow-2xl"
          style={{ left: "50%", transform: "translateX(-50%)", width: "calc(100% - 2rem)" }}
        >
          <div className="hidden items-center gap-2 sm:flex">
            <GitCompareArrows className="size-4 text-primary" />
            <span className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">Compare</span>
          </div>
          <div className="flex flex-1 items-center gap-2">
            {champs.map((c) => (
              <div key={c.id} className="group relative size-12 overflow-hidden rounded-lg border" style={{ borderColor: RARITY[c.rarity].border }}>
                <Image src={c.image || "/placeholder.svg"} alt={c.name} fill className="object-cover object-top" />
                <button
                  onClick={() => toggleCompare(c)}
                  className="absolute inset-0 grid place-items-center bg-background/70 opacity-0 transition group-hover:opacity-100"
                  aria-label={`Remove ${c.name}`}
                >
                  <X className="size-4 text-foreground" />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - champs.length }).map((_, i) => (
              <div key={i} className="grid size-12 place-items-center rounded-lg border border-dashed border-border text-muted-foreground/50">
                <span className="text-xs">+</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => pushToast({ title: "Comparison ready", description: `${champs.length} champions side by side`, variant: "success" })}
            disabled={champs.length < 2}
            className="rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.13_72)] px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-primary-foreground transition disabled:opacity-50"
          >
            Compare {champs.length}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
