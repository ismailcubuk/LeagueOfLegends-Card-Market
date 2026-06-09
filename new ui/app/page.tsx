"use client"

import { AnimatePresence, motion } from "framer-motion"
import { SlidersHorizontal, X, Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { type Champion } from "@/lib/champions"
import { StoreProvider, useStore } from "@/components/store-provider"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { CollectionPanel } from "@/components/collection-panel"
import { FilterSidebar, DEFAULT_FILTERS, type Filters } from "@/components/filter-sidebar"
import { ShopGrid } from "@/components/shop-grid"
import { TrendingCarousel } from "@/components/trending-carousel"
import { PreviewModal } from "@/components/preview-modal"
import { CompareBar } from "@/components/compare-bar"
import { ToastViewport } from "@/components/toast-viewport"

function WishlistFab() {
  const { wishlist, pushToast } = useStore()
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => pushToast({ title: "Wishlist", description: `${wishlist.size} champions saved`, variant: "info" })}
      className="fixed bottom-6 left-6 z-[70] grid size-14 place-items-center rounded-full border border-primary/40 bg-gradient-to-br from-primary to-[oklch(0.65_0.13_70)] text-primary-foreground glow-gold"
      aria-label="Wishlist"
    >
      <Heart className="size-6" />
      {wishlist.size > 0 && (
        <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-2 border-background bg-rarity-mythic text-[11px] font-bold text-white">
          {wishlist.size}
        </span>
      )}
    </motion.button>
  )
}

function MarketplaceInner() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState("")
  const [preview, setPreview] = useState<Champion | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileFilters, setMobileFilters] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  // Keyboard shortcut: "/" focuses search-like behavior, Esc closes overlays
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreview(null)
        setMobileFilters(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-0 size-[480px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 size-[420px] rounded-full bg-rarity-epic/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-rarity-rare/10 blur-[120px]" />
      </div>

      <Navbar searchQuery={search} onSearch={setSearch} />

      <main className="mx-auto max-w-[1600px] space-y-10 px-4 py-6 md:px-6 md:py-8">
        <Hero />
        <CollectionPanel />
        <TrendingCarousel onPreview={setPreview} />

        {/* Shop layout */}
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Marketplace</h2>
          <button
            onClick={() => setMobileFilters(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm font-medium"
          >
            <SlidersHorizontal className="size-4 text-primary" /> Filters
          </button>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-20">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <ShopGrid filters={filters} searchQuery={search} loading={loading} onPreview={setPreview} />
          </div>
        </div>
      </main>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-background/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFilters(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="h-full w-80 max-w-[85%] overflow-y-auto bg-background p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-heading text-lg font-bold uppercase tracking-wide">Filters</span>
                <button onClick={() => setMobileFilters(false)} className="grid size-9 place-items-center rounded-full border border-border" aria-label="Close filters">
                  <X className="size-4" />
                </button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PreviewModal champ={preview} onClose={() => setPreview(null)} />
      <CompareBar />
      <WishlistFab />
      <ToastViewport />

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        NEXUS Champion Marketplace · A premium collectible experience · Demo UI
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <MarketplaceInner />
    </StoreProvider>
  )
}
