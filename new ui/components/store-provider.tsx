"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { CHAMPIONS, type Champion } from "@/lib/champions"

export interface Toast {
  id: number
  title: string
  description?: string
  variant: "success" | "info" | "error"
}

interface StoreContextValue {
  balance: number
  owned: Set<string>
  wishlist: Set<string>
  compare: string[]
  toasts: Toast[]
  toggleWishlist: (champ: Champion) => void
  toggleCompare: (champ: Champion) => void
  purchase: (champ: Champion) => void
  pushToast: (t: Omit<Toast, "id">) => void
  dismissToast: (id: number) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(8450)
  const [owned, setOwned] = useState<Set<string>>(
    () => new Set(CHAMPIONS.filter((c) => c.owned).map((c) => c.id)),
  )
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [compare, setCompare] = useState<string[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => dismissToast(id), 3600)
    },
    [dismissToast],
  )

  const toggleWishlist = useCallback(
    (champ: Champion) => {
      setWishlist((prev) => {
        const next = new Set(prev)
        if (next.has(champ.id)) {
          next.delete(champ.id)
          pushToast({ title: "Removed from wishlist", description: champ.name, variant: "info" })
        } else {
          next.add(champ.id)
          pushToast({ title: "Added to wishlist", description: champ.name, variant: "success" })
        }
        return next
      })
    },
    [pushToast],
  )

  const toggleCompare = useCallback(
    (champ: Champion) => {
      setCompare((prev) => {
        if (prev.includes(champ.id)) return prev.filter((id) => id !== champ.id)
        if (prev.length >= 3) {
          pushToast({ title: "Compare is full", description: "Max 3 champions", variant: "error" })
          return prev
        }
        return [...prev, champ.id]
      })
    },
    [pushToast],
  )

  const purchase = useCallback(
    (champ: Champion) => {
      setOwned((prevOwned) => {
        if (prevOwned.has(champ.id)) {
          pushToast({ title: "Already owned", description: champ.name, variant: "info" })
          return prevOwned
        }
        setBalance((b) => {
          if (b < champ.price) {
            pushToast({ title: "Not enough coins", description: `Need ${champ.price - b} more`, variant: "error" })
            return b
          }
          pushToast({ title: "Champion unlocked!", description: `${champ.name} joined your collection`, variant: "success" })
          return b - champ.price
        })
        if (balance < champ.price) return prevOwned
        const next = new Set(prevOwned)
        next.add(champ.id)
        return next
      })
    },
    [balance, pushToast],
  )

  const value = useMemo(
    () => ({
      balance,
      owned,
      wishlist,
      compare,
      toasts,
      toggleWishlist,
      toggleCompare,
      purchase,
      pushToast,
      dismissToast,
    }),
    [balance, owned, wishlist, compare, toasts, toggleWishlist, toggleCompare, purchase, pushToast, dismissToast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
