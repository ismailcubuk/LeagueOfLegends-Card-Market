"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { CHAMPIONS, FEATURED_IDS, RARITY } from "@/lib/champions"
import { useStore } from "@/components/store-provider"
import { RarityBadge, StatBar } from "@/components/ui/badges"

const FEATURED = FEATURED_IDS.map((id) => CHAMPIONS.find((c) => c.id === id)!).filter(Boolean)

export function Hero() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const { purchase, toggleWishlist, wishlist, owned } = useStore()

  const champ = FEATURED[index]
  const cfg = RARITY[champ.rarity]

  const go = useCallback(
    (n: number) => {
      setDir(n > index || (index === FEATURED.length - 1 && n === 0) ? 1 : -1)
      setIndex((n + FEATURED.length) % FEATURED.length)
    },
    [index],
  )

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setDir(1)
      setIndex((i) => (i + 1) % FEATURED.length)
    }, 6000)
    return () => clearInterval(t)
  }, [paused])

  const isOwned = owned.has(champ.id)

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured champions"
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/8] lg:aspect-[21/9]">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={champ.id}
            custom={dir}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={champ.image || "/placeholder.svg"}
              alt={`${champ.name}, ${champ.title}`}
              fill
              priority
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-screen"
          style={{ background: `radial-gradient(60% 80% at 75% 50%, ${cfg.glow}, transparent 70%)` }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-2xl px-6 sm:px-10 lg:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={champ.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <RarityBadge rarity={champ.rarity} />
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Featured · {champ.region}
                  </span>
                </div>

                <h1 className="font-heading text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {champ.name}
                </h1>
                <p className="mt-1 font-heading text-lg font-medium uppercase tracking-[0.2em] text-gradient-gold sm:text-2xl">
                  {champ.title}
                </p>
                <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground sm:text-base">
                  {champ.tagline}
                </p>

                {/* Stats */}
                <div className="mt-5 grid max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
                  <StatBar label="Attack" value={champ.stats.attack} color="var(--rarity-mythic)" />
                  <StatBar label="Magic" value={champ.stats.magic} color="var(--rarity-rare)" />
                  <StatBar label="Defense" value={champ.stats.defense} color="var(--rarity-legendary)" />
                  <StatBar label="Mobility" value={champ.stats.mobility} color="var(--rarity-epic)" />
                </div>

                {/* CTAs */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => purchase(champ)}
                    disabled={isOwned}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[oklch(0.7_0.13_72)] px-6 py-3 font-heading text-sm font-bold uppercase tracking-wider text-primary-foreground glow-gold disabled:opacity-60"
                  >
                    <ShoppingCart className="size-4" />
                    {isOwned ? "In Collection" : `Unlock · ${champ.price.toLocaleString()}`}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-5 py-3 font-heading text-sm font-semibold uppercase tracking-wider text-foreground backdrop-blur transition hover:border-primary/40"
                  >
                    <Play className="size-4" /> Preview
                  </motion.button>
                  <button
                    onClick={() => toggleWishlist(champ)}
                    className="grid size-12 place-items-center rounded-full border border-border bg-secondary/40 text-foreground backdrop-blur transition hover:border-primary/40"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`size-5 transition ${wishlist.has(champ.id) ? "fill-rarity-mythic text-rarity-mythic" : ""}`}
                    />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={() => go(index - 1)}
          className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-border glass text-foreground transition hover:border-primary/50 hover:text-primary sm:grid"
          aria-label="Previous"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          onClick={() => go(index + 1)}
          className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-border glass text-foreground transition hover:border-primary/50 hover:text-primary sm:grid"
          aria-label="Next"
        >
          <ChevronRight className="size-5" />
        </button>

        {/* Thumbnails / dots */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
          {FEATURED.map((c, i) => (
            <button
              key={c.id}
              onClick={() => go(i)}
              aria-label={`Show ${c.name}`}
              className="group relative h-1.5 overflow-hidden rounded-full bg-border transition-all"
              style={{ width: i === index ? 36 : 16 }}
            >
              {i === index && !paused && (
                <motion.span
                  key={champ.id}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                  className="absolute inset-y-0 left-0 bg-primary"
                />
              )}
              {i === index && paused && <span className="absolute inset-0 bg-primary" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
