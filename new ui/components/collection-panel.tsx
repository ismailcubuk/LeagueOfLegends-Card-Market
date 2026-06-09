"use client"

import { motion } from "framer-motion"
import { Trophy, Library, Clock, Star } from "lucide-react"
import Image from "next/image"
import { CHAMPIONS, RARITY } from "@/lib/champions"
import { useStore } from "@/components/store-provider"

export function CollectionPanel() {
  const { owned } = useStore()
  const total = CHAMPIONS.length
  const ownedCount = owned.size
  const pct = Math.round((ownedCount / total) * 100)
  const ownedChamps = CHAMPIONS.filter((c) => owned.has(c.id))

  const stats = [
    { icon: Library, label: "Owned", value: `${ownedCount}/${total}` },
    { icon: Trophy, label: "Completion", value: `${pct}%` },
    { icon: Star, label: "Legendary+", value: String(ownedChamps.filter((c) => c.rarity === "legendary" || c.rarity === "mythic").length) },
  ]

  return (
    <section className="rounded-2xl border border-border bg-card/60 glass p-5 sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Progress ring + heading */}
        <div className="flex items-center gap-5">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 100 100" className="size-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--secondary)" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (264 * pct) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 0 6px var(--gold))" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-heading text-2xl font-bold text-foreground">{pct}%</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              <Library className="size-4" /> My Collection
            </div>
            <h2 className="mt-1 font-heading text-2xl font-bold uppercase tracking-tight text-foreground">
              {ownedCount} Champions Owned
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {total - ownedCount} more to complete the Roster
            </p>
          </div>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-center">
              <s.icon className="mx-auto mb-1 size-4 text-primary" />
              <p className="font-heading text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently acquired */}
      <div className="mt-6 border-t border-border/60 pt-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <Clock className="size-3.5" /> Recently Acquired
        </div>
        {ownedChamps.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {ownedChamps.map((c) => {
              const cfg = RARITY[c.rarity]
              return (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4 }}
                  className="group relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border"
                  style={{ borderColor: cfg.border }}
                >
                  <Image src={c.image || "/placeholder.svg"} alt={c.name} fill className="object-cover object-top transition group-hover:scale-110" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-1.5 pt-4">
                    <p className="truncate text-[11px] font-semibold text-foreground">{c.name}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <div className="grid size-12 place-items-center rounded-full bg-secondary/60">
              <Library className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">Your vault is empty</p>
            <p className="text-xs text-muted-foreground">Unlock your first champion to start collecting</p>
          </div>
        )}
      </div>
    </section>
  )
}
