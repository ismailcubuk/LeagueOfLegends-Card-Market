"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Search,
  ChevronDown,
  Swords,
  Menu,
  Coins,
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/components/store-provider"

const NAV_LINKS = ["Store", "Collection", "Champions", "Bundles", "Esports"]

function GoldCoin({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex animate-coin [transform-style:preserve-3d] ${className}`}>
      <Coins className="size-4 text-primary-foreground" strokeWidth={2.4} />
    </span>
  )
}

export function Navbar({
  searchQuery,
  onSearch,
}: {
  searchQuery: string
  onSearch: (q: string) => void
}) {
  const { balance, wishlist } = useStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("Store")

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 md:px-6 lg:gap-6">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-2.5" aria-label="Nexus home">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.68_0.13_75)] glow-gold">
            <Swords className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="hidden font-heading text-xl font-bold tracking-[0.18em] text-foreground sm:block">
            NE<span className="text-gradient-gold">XUS</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveLink(link)}
              className={`relative rounded-md px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
                activeLink === link
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link}
              {activeLink === link && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--gold)]"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Search */}
        <div className="relative ml-auto hidden max-w-sm flex-1 items-center md:flex">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search champions, roles, regions…"
            className="h-10 w-full rounded-full border border-border bg-input/60 pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-ring"
          />
          <kbd className="absolute right-3 hidden rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground lg:block">
            /
          </kbd>
        </div>

        {/* Currency balance */}
        <motion.div
          key={balance}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 0.35 }}
          className="ml-auto flex items-center gap-2 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-primary/5 py-1.5 pl-2 pr-3 md:ml-0"
        >
          <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.65_0.13_70)]">
            <GoldCoin />
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {balance.toLocaleString()}
          </span>
        </motion.div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative grid size-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rarity-mythic ring-2 ring-popover" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-12 w-72 overflow-hidden rounded-xl border border-border glass-strong shadow-2xl"
              >
                <div className="border-b border-border px-4 py-3">
                  <p className="font-heading text-sm font-semibold tracking-wide">Notifications</p>
                </div>
                <ul className="divide-y divide-border/60">
                  {[
                    { t: "Daily shop refreshed", d: "3 new deals available", c: "rarity-legendary" },
                    { t: "Wishlist drop", d: `${wishlist.size} items on sale soon`, c: "rarity-epic" },
                    { t: "Mythic arrival", d: "Noxa, the Void Assassin", c: "rarity-mythic" },
                  ].map((n) => (
                    <li key={n.t} className="flex gap-3 px-4 py-3 transition hover:bg-secondary/50">
                      <span className={`mt-1 size-2 shrink-0 rounded-full bg-${n.c}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{n.t}</p>
                        <p className="text-xs text-muted-foreground">{n.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 py-1 pl-1 pr-2 transition hover:border-primary/40">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-rarity-epic to-rarity-rare font-heading text-sm font-bold text-white">
            S
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </button>

        <button className="grid size-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary lg:hidden" aria-label="Menu">
          <Menu className="size-5" />
        </button>
      </div>
    </header>
  )
}
