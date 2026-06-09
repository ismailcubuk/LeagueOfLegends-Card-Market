"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { CHAMPIONS, RARITY, type Champion } from "@/lib/champions"
import { RarityBadge } from "@/components/ui/badges"

export function TrendingCarousel({ onPreview }: { onPreview: (c: Champion) => void }) {
  const trending = [...CHAMPIONS].sort((a, b) => RARITY[b.rarity].order - RARITY[a.rarity].order)

  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  // drag state
  const drag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    updateEdges()
    const el = scrollerRef.current
    if (!el) return
    el.addEventListener("scroll", updateEdges, { passive: true })
    window.addEventListener("resize", updateEdges)
    return () => {
      el.removeEventListener("scroll", updateEdges)
      window.removeEventListener("resize", updateEdges)
    }
  }, [updateEdges])

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current
    if (!el) return
    drag.current = { active: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft }
    el.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current
    if (!el || !drag.current.active) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startScroll - dx
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const el = scrollerRef.current
    if (el) el.releasePointerCapture(e.pointerId)
    // allow click to be suppressed if dragged
    setTimeout(() => (drag.current.active = false), 0)
  }

  return (
    <section className="relative">
      <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
        <Flame className="size-4" /> Trending Now
      </div>

      <div className="group/carousel relative">
        {/* edge fades */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 ${canLeft ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 ${canRight ? "opacity-100" : "opacity-0"}`}
        />

        {/* nav arrows */}
        <CarouselArrow side="left" show={canLeft} onClick={() => scrollByCards(-1)} />
        <CarouselArrow side="right" show={canRight} onClick={() => scrollByCards(1)} />

        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto pb-3 active:cursor-grabbing"
        >
          {trending.map((c) => {
            const cfg = RARITY[c.rarity]
            return (
              <motion.button
                key={c.id}
                onClick={() => {
                  if (drag.current.moved) return
                  onPreview(c)
                }}
                whileHover={{ scale: 1.03, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative h-44 w-72 shrink-0 snap-start overflow-hidden rounded-2xl border text-left"
                style={{ borderColor: "var(--border)" }}
              >
                <Image
                  src={c.image || "/placeholder.svg"}
                  alt={c.name}
                  fill
                  draggable={false}
                  className="object-cover object-top brightness-90 transition duration-500 select-none group-hover:scale-110 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(60% 80% at 80% 50%, ${cfg.glow}, transparent 70%)` }}
                />
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset transition duration-500 group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 30px ${cfg.glow}`, ["--tw-ring-color" as string]: cfg.border }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <RarityBadge rarity={c.rarity} size="sm" />
                  <div>
                    <p className="font-heading text-xl font-bold uppercase tracking-tight text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.title}</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-primary">{c.price.toLocaleString()}</p>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CarouselArrow({
  side,
  show,
  onClick,
}: {
  side: "left" | "right"
  show: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      onClick={onClick}
      className={`absolute top-1/2 z-30 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/50 text-foreground/80 backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-background/70 hover:text-primary hover:shadow-[0_0_20px_rgba(214,168,79,0.45)] ${
        side === "left" ? "left-3" : "right-3"
      } ${show ? "opacity-0 group-hover/carousel:opacity-100" : "pointer-events-none opacity-0"}`}
    >
      {side === "left" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  )
}
