"use client"

import { motion } from "framer-motion"
import { PackageOpen, Flame, Sparkles, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { CHAMPIONS, RARITY, type Champion } from "@/lib/champions"
import { useStore } from "@/components/store-provider"
import { ChampionCard } from "@/components/champion-card"
import { DEFAULT_FILTERS, type Filters } from "@/components/filter-sidebar"

const QUICK_TABS = [
  { key: "all", label: "All Champions", icon: Sparkles },
  { key: "deals", label: "Daily Deals", icon: Flame },
  { key: "new", label: "New Arrivals", icon: TrendingUp },
] as const

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="shimmer relative aspect-[3/4] bg-secondary/50" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 rounded bg-secondary/60" />
        <div className="h-3 w-1/2 rounded bg-secondary/40" />
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-12 rounded bg-secondary/60" />
          <div className="h-6 w-16 rounded-full bg-secondary/60" />
        </div>
      </div>
    </div>
  )
}

export function ShopGrid({
  filters,
  searchQuery,
  loading,
  onPreview,
}: {
  filters: Filters
  searchQuery: string
  loading: boolean
  onPreview: (c: Champion) => void
}) {
  const { owned } = useStore()
  const [tab, setTab] = useState<(typeof QUICK_TABS)[number]["key"]>("all")

  const result = useMemo(() => {
    let list = [...CHAMPIONS]

    if (tab === "deals") list = list.filter((c) => c.rarity === "epic" || c.rarity === "rare")
    if (tab === "new") list = list.filter((c) => c.rarity === "mythic" || c.rarity === "legendary")

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q),
      )
    }
    if (filters.roles.length) list = list.filter((c) => filters.roles.includes(c.role))
    if (filters.rarities.length) list = list.filter((c) => filters.rarities.includes(c.rarity))
    list = list.filter((c) => c.price <= filters.maxPrice)
    if (filters.collection === "owned") list = list.filter((c) => owned.has(c.id))
    if (filters.collection === "unowned") list = list.filter((c) => !owned.has(c.id))

    switch (filters.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        list.sort((a, b) => b.price - a.price)
        break
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "rarity":
        list.sort((a, b) => RARITY[b.rarity].order - RARITY[a.rarity].order)
        break
    }
    return list
  }, [filters, searchQuery, tab, owned])

  return (
    <div>
      {/* Section header + quick tabs */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles className="size-4" /> Marketplace
          </div>
          <h2 className="mt-1 font-heading text-3xl font-bold uppercase tracking-tight text-foreground">
            Champion Vault
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1">
          {QUICK_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                tab === t.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === t.key && (
                <motion.span
                  layoutId="shop-tab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.13_72)]"
                />
              )}
              <t.icon className="relative size-3.5" />
              <span className="relative hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : result.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {result.map((champ, i) => (
            <motion.div
              key={champ.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <ChampionCard champ={champ} onPreview={onPreview} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-secondary/50">
            <PackageOpen className="size-7 text-muted-foreground" />
          </div>
          <p className="mt-4 font-heading text-lg font-bold uppercase tracking-wide text-foreground">
            No champions found
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Try adjusting your filters or search to discover more legends.
          </p>
        </div>
      )}
    </div>
  )
}
