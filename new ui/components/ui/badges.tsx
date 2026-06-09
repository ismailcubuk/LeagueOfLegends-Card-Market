"use client"

import { RARITY, type Rarity } from "@/lib/champions"
import { Sparkles } from "lucide-react"

export function RarityBadge({ rarity, size = "md" }: { rarity: Rarity; size?: "sm" | "md" }) {
  const cfg = RARITY[rarity]
  const isHigh = rarity === "legendary" || rarity === "mythic"
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-heading font-semibold uppercase tracking-[0.14em] ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
      style={{
        color: cfg.color,
        borderColor: cfg.border,
        backgroundColor: `color-mix(in oklch, ${cfg.color} 14%, transparent)`,
      }}
    >
      {isHigh && <Sparkles className="size-3" />}
      {cfg.label}
    </span>
  )
}

export function StatBar({
  label,
  value,
  color = "var(--gold)",
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="w-7 text-right font-mono text-[11px] tabular-nums text-foreground/80">
        {value}
      </span>
    </div>
  )
}

export function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {role}
    </span>
  )
}
