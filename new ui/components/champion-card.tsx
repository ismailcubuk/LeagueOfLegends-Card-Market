"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Check, Eye, Heart, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { RARITY, type Champion } from "@/lib/champions"
import { useStore } from "@/components/store-provider"
import { RarityBadge, RoleBadge } from "@/components/ui/badges"

export function ChampionCard({ champ, onPreview }: { champ: Champion; onPreview: (c: Champion) => void }) {
  const cfg = RARITY[champ.rarity]
  const { owned, wishlist, compare, toggleWishlist, toggleCompare, purchase } = useStore()
  const isOwned = owned.has(champ.id)
  const isWished = wishlist.has(champ.id)
  const inCompare = compare.includes(champ.id)
  const isHolo = champ.rarity === "legendary" || champ.rarity === "mythic"

  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 250, damping: 20 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 250, damping: 20 })
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"])

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function reset() {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative [transform-style:preserve-3d]"
    >
      <div
        className="relative overflow-hidden rounded-2xl border bg-card transition-shadow duration-300"
        style={{
          borderColor: hovered ? cfg.color : "var(--border)",
          boxShadow: hovered ? `0 16px 50px -12px ${cfg.glow}, 0 0 0 1px ${cfg.border}` : "0 8px 24px -16px rgba(0,0,0,0.6)",
        }}
      >
        {/* Artwork */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={champ.image || "/placeholder.svg"}
            alt={`${champ.name}, ${champ.title}`}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `radial-gradient(70% 50% at 50% 100%, ${cfg.glow}, transparent 70%)` }}
          />

          {/* Holographic sweep */}
          {isHolo && (
            <motion.div
              aria-hidden
              className="holo pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay group-hover:opacity-100"
              style={{ backgroundPositionX: glareX }}
              animate={hovered ? { backgroundPosition: ["0% 0%", "200% 200%"] } : {}}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Top badges */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <RarityBadge rarity={champ.rarity} size="sm" />
            {isOwned && (
              <span className="flex items-center gap-1 rounded-full border border-rarity-legendary/50 bg-background/70 px-2 py-0.5 text-[10px] font-semibold text-rarity-legendary backdrop-blur">
                <Check className="size-3" /> OWNED
              </span>
            )}
          </div>

          {/* Hover quick actions */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center gap-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={() => onPreview(champ)}
              className="grid size-9 place-items-center rounded-full border border-border glass text-foreground transition hover:border-primary/50 hover:text-primary"
              aria-label={`Preview ${champ.name}`}
            >
              <Eye className="size-4" />
            </button>
            <button
              onClick={() => toggleWishlist(champ)}
              className="grid size-9 place-items-center rounded-full border border-border glass text-foreground transition hover:border-rarity-mythic/50"
              aria-label="Wishlist"
            >
              <Heart className={`size-4 ${isWished ? "fill-rarity-mythic text-rarity-mythic" : ""}`} />
            </button>
            <button
              onClick={() => toggleCompare(champ)}
              className={`grid size-9 place-items-center rounded-full border glass transition ${
                inCompare ? "border-primary/60 text-primary" : "border-border text-foreground hover:border-primary/50"
              }`}
              aria-label="Compare"
            >
              <Plus className={`size-4 transition-transform ${inCompare ? "rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="relative p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-heading text-lg font-bold uppercase tracking-tight text-foreground">
                {champ.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground">{champ.title}</p>
            </div>
            <RoleBadge role={champ.role} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.13_70)]">
                <span className="size-2 rounded-full bg-primary-foreground/80" />
              </span>
              <span className="font-mono text-sm font-bold tabular-nums text-foreground">
                {champ.price.toLocaleString()}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => purchase(champ)}
              disabled={isOwned}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wide transition ${
                isOwned
                  ? "cursor-default border border-border bg-secondary/50 text-muted-foreground"
                  : "bg-gradient-to-r from-primary to-[oklch(0.7_0.13_72)] text-primary-foreground hover:shadow-[0_0_16px_var(--gold)]"
              }`}
            >
              {isOwned ? <Check className="size-3.5" /> : <ShoppingCart className="size-3.5" />}
              {isOwned ? "Owned" : "Buy"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
