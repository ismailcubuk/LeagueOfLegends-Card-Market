"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Swords,
  Wand2,
  Shield,
  Crosshair,
  Heart,
  Sparkles,
  ChevronDown,
  SlidersHorizontal,
  Check,
  RotateCcw,
} from "lucide-react"
import { useState } from "react"
import { ROLES, RARITY, type Role, type Rarity } from "@/lib/champions"

export type Collection = "all" | "owned" | "unowned"
export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "rarity"

export interface Filters {
  roles: Role[]
  rarities: Rarity[]
  maxPrice: number
  collection: Collection
  sort: SortKey
}

export const DEFAULT_FILTERS: Filters = {
  roles: [],
  rarities: [],
  maxPrice: 3500,
  collection: "all",
  sort: "featured",
}

const ROLE_ICONS: Record<Role, typeof Swords> = {
  Assassin: Swords,
  Mage: Wand2,
  Fighter: Swords,
  Tank: Shield,
  Marksman: Crosshair,
  Support: Heart,
}

const COLLECTIONS: { key: Collection; label: string }[] = [
  { key: "all", label: "All Cards" },
  { key: "owned", label: "Owned" },
  { key: "unowned", label: "Not Owned" },
]

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border/60 py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between"
      >
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Checkbox({ checked, color }: { checked: boolean; color?: string }) {
  return (
    <span
      className="grid size-5 shrink-0 place-items-center rounded-md border transition"
      style={{
        borderColor: checked ? color ?? "var(--gold)" : "var(--border)",
        backgroundColor: checked ? `color-mix(in oklch, ${color ?? "var(--gold)"} 22%, transparent)` : "transparent",
      }}
    >
      <AnimatePresence>
        {checked && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="size-3.5" style={{ color: color ?? "var(--gold)" }} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function FilterSidebar({
  filters,
  setFilters,
}: {
  filters: Filters
  setFilters: (f: Filters) => void
}) {
  const toggleRole = (r: Role) =>
    setFilters({
      ...filters,
      roles: filters.roles.includes(r) ? filters.roles.filter((x) => x !== r) : [...filters.roles, r],
    })
  const toggleRarity = (r: Rarity) =>
    setFilters({
      ...filters,
      rarities: filters.rarities.includes(r) ? filters.rarities.filter((x) => x !== r) : [...filters.rarities, r],
    })

  const dirty =
    filters.roles.length || filters.rarities.length || filters.collection !== "all" || filters.maxPrice < 3500

  return (
    <div className="rounded-2xl border border-border bg-sidebar/60 glass">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.16em]">Filters</span>
        </div>
        {dirty ? (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
          >
            <RotateCcw className="size-3" /> Reset
          </button>
        ) : null}
      </div>

      <div className="px-4">
        {/* Roles */}
        <Section title="Role">
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => {
              const Icon = ROLE_ICONS[role]
              const active = filters.roles.includes(role)
              return (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition ${
                    active
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  <Icon className={`size-4 ${active ? "text-primary" : ""}`} />
                  {role}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Price */}
        <Section title="Price Range">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span className="font-mono font-semibold text-primary">{filters.maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={500}
            max={3500}
            step={50}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--gold)]"
          />
        </Section>

        {/* Rarity */}
        <Section title="Rarity">
          <div className="flex flex-col gap-2">
            {(Object.keys(RARITY) as Rarity[]).map((r) => {
              const cfg = RARITY[r]
              const active = filters.rarities.includes(r)
              return (
                <button
                  key={r}
                  onClick={() => toggleRarity(r)}
                  className="flex items-center gap-2.5 rounded-lg px-1 py-1 text-sm transition hover:bg-secondary/40"
                >
                  <Checkbox checked={active} color={cfg.color} />
                  <span className="flex items-center gap-1.5 font-medium" style={{ color: active ? cfg.color : undefined }}>
                    {(r === "legendary" || r === "mythic") && <Sparkles className="size-3" style={{ color: cfg.color }} />}
                    {cfg.label}
                  </span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* Collection status */}
        <Section title="Collection">
          <div className="flex flex-col gap-1.5">
            {COLLECTIONS.map((c) => (
              <button
                key={c.key}
                onClick={() => setFilters({ ...filters, collection: c.key })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  filters.collection === c.key
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                {c.label}
                {filters.collection === c.key && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </Section>

        {/* Sort */}
        <Section title="Sort By" defaultOpen={false}>
          <div className="flex flex-col gap-1.5 pb-2">
            {([
              { k: "featured", l: "Featured" },
              { k: "price-asc", l: "Price: Low to High" },
              { k: "price-desc", l: "Price: High to Low" },
              { k: "name", l: "Alphabetical" },
              { k: "rarity", l: "Rarity" },
            ] as { k: SortKey; l: string }[]).map((s) => (
              <button
                key={s.k}
                onClick={() => setFilters({ ...filters, sort: s.k })}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  filters.sort === s.k ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                {s.l}
                {filters.sort === s.k && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
