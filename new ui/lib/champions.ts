export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic"
export type Role = "Assassin" | "Mage" | "Fighter" | "Tank" | "Marksman" | "Support"

export interface Champion {
  id: string
  name: string
  title: string
  role: Role
  rarity: Rarity
  price: number
  image: string
  owned: boolean
  region: string
  difficulty: number
  stats: {
    attack: number
    defense: number
    magic: number
    mobility: number
  }
  tagline: string
}

export interface RarityConfig {
  label: string
  color: string
  glow: string
  border: string
  text: string
  bg: string
  order: number
}

export const RARITY: Record<Rarity, RarityConfig> = {
  common: {
    label: "Common",
    color: "var(--rarity-common)",
    glow: "oklch(0.72 0.02 264 / 0.4)",
    border: "rgba(170,180,200,0.5)",
    text: "text-rarity-common",
    bg: "bg-rarity-common/10",
    order: 0,
  },
  rare: {
    label: "Rare",
    color: "var(--rarity-rare)",
    glow: "oklch(0.68 0.15 230 / 0.5)",
    border: "rgba(90,160,255,0.6)",
    text: "text-rarity-rare",
    bg: "bg-rarity-rare/10",
    order: 1,
  },
  epic: {
    label: "Epic",
    color: "var(--rarity-epic)",
    glow: "oklch(0.62 0.2 300 / 0.5)",
    border: "rgba(190,110,255,0.6)",
    text: "text-rarity-epic",
    bg: "bg-rarity-epic/10",
    order: 2,
  },
  legendary: {
    label: "Legendary",
    color: "var(--rarity-legendary)",
    glow: "oklch(0.8 0.14 85 / 0.55)",
    border: "rgba(232,196,110,0.75)",
    text: "text-rarity-legendary",
    bg: "bg-rarity-legendary/10",
    order: 3,
  },
  mythic: {
    label: "Mythic",
    color: "var(--rarity-mythic)",
    glow: "oklch(0.68 0.21 15 / 0.55)",
    border: "rgba(255,110,120,0.7)",
    text: "text-rarity-mythic",
    bg: "bg-rarity-mythic/10",
    order: 4,
  },
}

export const ROLES: Role[] = ["Assassin", "Mage", "Fighter", "Tank", "Marksman", "Support"]

export const CHAMPIONS: Champion[] = [
  {
    id: "lyra",
    name: "Lyra",
    title: "The Frost Queen",
    role: "Mage",
    rarity: "mythic",
    price: 2950,
    image: "/champions/frost-queen.png",
    owned: false,
    region: "Frostheim",
    difficulty: 3,
    stats: { attack: 42, defense: 55, magic: 98, mobility: 60 },
    tagline: "Winter answers to her alone.",
  },
  {
    id: "kael",
    name: "Kael",
    title: "The Ember Knight",
    role: "Fighter",
    rarity: "legendary",
    price: 1850,
    image: "/champions/ember-knight.png",
    owned: true,
    region: "Cinderfall",
    difficulty: 2,
    stats: { attack: 92, defense: 78, magic: 30, mobility: 55 },
    tagline: "Forged in fire, tempered in war.",
  },
  {
    id: "noxa",
    name: "Noxa",
    title: "The Void Assassin",
    role: "Assassin",
    rarity: "mythic",
    price: 3200,
    image: "/champions/void-assassin.png",
    owned: false,
    region: "The Rift",
    difficulty: 5,
    stats: { attack: 95, defense: 35, magic: 60, mobility: 99 },
    tagline: "You will never see the blade.",
  },
  {
    id: "zephyr",
    name: "Zephyr",
    title: "The Storm Mage",
    role: "Mage",
    rarity: "epic",
    price: 1450,
    image: "/champions/storm-mage.png",
    owned: false,
    region: "Skyreach",
    difficulty: 4,
    stats: { attack: 50, defense: 45, magic: 90, mobility: 72 },
    tagline: "The tempest obeys no king.",
  },
  {
    id: "akira",
    name: "Akira",
    title: "The Blade Dancer",
    role: "Assassin",
    rarity: "legendary",
    price: 1990,
    image: "/champions/blade-dancer.png",
    owned: true,
    region: "Hanamura",
    difficulty: 4,
    stats: { attack: 88, defense: 48, magic: 40, mobility: 95 },
    tagline: "Every step a verse, every cut a song.",
  },
  {
    id: "thane",
    name: "Thane",
    title: "The Iron Guardian",
    role: "Tank",
    rarity: "rare",
    price: 880,
    image: "/champions/iron-guardian.png",
    owned: false,
    region: "Ironhold",
    difficulty: 1,
    stats: { attack: 55, defense: 99, magic: 20, mobility: 30 },
    tagline: "None shall pass.",
  },
  {
    id: "sylva",
    name: "Sylva",
    title: "The Nature Warden",
    role: "Support",
    rarity: "epic",
    price: 1320,
    image: "/champions/nature-warden.png",
    owned: false,
    region: "Evergrove",
    difficulty: 3,
    stats: { attack: 35, defense: 60, magic: 82, mobility: 65 },
    tagline: "The forest remembers its protectors.",
  },
  {
    id: "aurelia",
    name: "Aurelia",
    title: "The Celestial Oracle",
    role: "Support",
    rarity: "legendary",
    price: 2100,
    image: "/champions/celestial-oracle.png",
    owned: false,
    region: "Lumenholt",
    difficulty: 2,
    stats: { attack: 30, defense: 65, magic: 95, mobility: 50 },
    tagline: "The stars whisper their secrets to her.",
  },
]

export const FEATURED_IDS = ["noxa", "lyra", "kael", "aurelia"]
