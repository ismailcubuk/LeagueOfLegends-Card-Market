"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Heart, ShoppingCart, X, Check } from "lucide-react"
import Image from "next/image"
import { RARITY, type Champion } from "@/lib/champions"
import { useStore } from "@/components/store-provider"
import { RarityBadge, RoleBadge, StatBar } from "@/components/ui/badges"

export function PreviewModal({ champ, onClose }: { champ: Champion | null; onClose: () => void }) {
  const { owned, wishlist, toggleWishlist, purchase } = useStore()

  return (
    <AnimatePresence>
      {champ && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[90] grid place-items-center bg-background/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:grid-cols-2"
            style={{ boxShadow: `0 30px 80px -20px ${RARITY[champ.rarity].glow}` }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-border glass text-foreground transition hover:text-primary"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="relative aspect-[3/4] sm:aspect-auto">
              <Image src={champ.image || "/placeholder.svg"} alt={champ.name} fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/60 sm:to-card" />
            </div>

            <div className="flex flex-col p-6">
              <div className="mb-3 flex items-center gap-2">
                <RarityBadge rarity={champ.rarity} />
                <RoleBadge role={champ.role} />
              </div>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-foreground">{champ.name}</h2>
              <p className="font-heading text-sm font-medium uppercase tracking-[0.18em] text-gradient-gold">{champ.title}</p>
              <p className="mt-3 text-sm text-muted-foreground">{champ.tagline}</p>

              <div className="mt-5 flex flex-col gap-2.5">
                <StatBar label="Attack" value={champ.stats.attack} color="var(--rarity-mythic)" />
                <StatBar label="Defense" value={champ.stats.defense} color="var(--rarity-legendary)" />
                <StatBar label="Magic" value={champ.stats.magic} color="var(--rarity-rare)" />
                <StatBar label="Mobility" value={champ.stats.mobility} color="var(--rarity-epic)" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <p className="text-muted-foreground">Region</p>
                  <p className="font-semibold text-foreground">{champ.region}</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                  <p className="text-muted-foreground">Difficulty</p>
                  <p className="font-semibold text-foreground">{"★".repeat(champ.difficulty)}{"☆".repeat(5 - champ.difficulty)}</p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 pt-6">
                <button
                  onClick={() => purchase(champ)}
                  disabled={owned.has(champ.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.13_72)] px-5 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground glow-gold disabled:opacity-60"
                >
                  {owned.has(champ.id) ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
                  {owned.has(champ.id) ? "In Collection" : `Unlock · ${champ.price.toLocaleString()}`}
                </button>
                <button
                  onClick={() => toggleWishlist(champ)}
                  className="grid size-12 place-items-center rounded-full border border-border bg-secondary/40 text-foreground transition hover:border-rarity-mythic/50"
                  aria-label="Wishlist"
                >
                  <Heart className={`size-5 ${wishlist.has(champ.id) ? "fill-rarity-mythic text-rarity-mythic" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
