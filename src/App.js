import 'bootstrap/dist/css/bootstrap.min.css';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
    AiOutlineClose,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineStar,
    AiOutlineTrophy,
} from 'react-icons/ai';
import { BsCollection } from 'react-icons/bs';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Droplet, Eye, Flame, Gift, Heart, MapPin, Menu, Pencil, Play, Plus, Search, Shield, ShoppingCart, Skull, SlidersHorizontal, Sparkles, Swords, Wand2, Zap } from 'lucide-react';
import CardContext from './components/component/CardContext';
import { BLUE_ESSENCE_ICON_URL, getChampionBlueEssence } from './components/component/championPrices';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';

const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id, skin = 0) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skin}.jpg`;
const LOL_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/lol_icon.png';
const HEXTECH_CHEST_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/chest.png';

const sidebarRoles = ['Assassin', 'Mage', 'Fighter', 'Tank', 'Marksman', 'Support'];
const navLinks = [
    { label: 'Profile', href: '#profile', view: 'profile' },
    { label: 'Trends', href: '#trending', view: 'market' },
    { label: 'Store', href: '#marketplace', view: 'market' },
];
const previewTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'abilities', label: 'Abilities' },
    { key: 'lore', label: 'Lore' },
    { key: 'skins', label: 'Skins' },
];
const previewStats = [
    { label: 'Attack', key: 'attack', tone: 'attack', icon: Skull },
    { label: 'Magic', key: 'magic', tone: 'magic', icon: Wand2 },
    { label: 'Defense', key: 'defense', tone: 'defense', icon: Shield },
    { label: 'Difficulty', key: 'difficulty', tone: 'difficulty', icon: Sparkles },
];
const HERO_AUTOPLAY_MS = 5000;
const resourceIcons = {
    courage: Shield,
    energy: Zap,
    fury: Swords,
};
const championOrigins = {
    Aatrox: 'Shurima',
    Ahri: 'Ionia',
    Akali: 'Ionia',
    Akshan: 'Shurima',
    Alistar: 'Noxus',
    Amumu: 'Shurima',
    Anivia: 'Freljord',
    Annie: 'Noxus',
    Aphelios: 'Targon',
    Ashe: 'Freljord',
    AurelionSol: 'Targon',
    Azir: 'Shurima',
    Bard: 'Runeterra',
    Belveth: 'Void',
    Blitzcrank: 'Zaun',
    Brand: 'Freljord',
    Braum: 'Freljord',
    Caitlyn: 'Piltover',
    Camille: 'Piltover',
    Cassiopeia: 'Noxus',
    Chogath: 'Void',
    Corki: 'Bandle City',
    Darius: 'Noxus',
    Diana: 'Targon',
    Draven: 'Noxus',
    DrMundo: 'Zaun',
    Ekko: 'Zaun',
    Elise: 'Noxus',
    Evelynn: 'Runeterra',
    Ezreal: 'Piltover',
    Fiddlesticks: 'Runeterra',
    Fiora: 'Demacia',
    Fizz: 'Bilgewater',
    Galio: 'Demacia',
    Gangplank: 'Bilgewater',
    Garen: 'Demacia',
    Gnar: 'Freljord',
    Gragas: 'Freljord',
    Graves: 'Bilgewater',
    Gwen: 'Shadow Isles',
    Hecarim: 'Shadow Isles',
    Heimerdinger: 'Piltover',
    Illaoi: 'Bilgewater',
    Irelia: 'Ionia',
    Ivern: 'Ionia',
    Janna: 'Zaun',
    JarvanIV: 'Demacia',
    Jax: 'Icathia',
    Jayce: 'Piltover',
    Jhin: 'Ionia',
    Jinx: 'Zaun',
    Kaisa: 'Void',
    Kalista: 'Shadow Isles',
    Karma: 'Ionia',
    Karthus: 'Shadow Isles',
    Kassadin: 'Shurima',
    Katarina: 'Noxus',
    Kayle: 'Demacia',
    Kayn: 'Ionia',
    Kennen: 'Ionia',
    Khazix: 'Void',
    Kindred: 'Runeterra',
    Kled: 'Noxus',
    KogMaw: 'Void',
    KSante: 'Shurima',
    Leblanc: 'Noxus',
    LeeSin: 'Ionia',
    Leona: 'Targon',
    Lillia: 'Ionia',
    Lissandra: 'Freljord',
    Lucian: 'Demacia',
    Lulu: 'Bandle City',
    Lux: 'Demacia',
    Malphite: 'Ixtal',
    Malzahar: 'Void',
    Maokai: 'Shadow Isles',
    MasterYi: 'Ionia',
    MissFortune: 'Bilgewater',
    MonkeyKing: 'Ionia',
    Mordekaiser: 'Noxus',
    Morgana: 'Demacia',
    Nami: 'Runeterra',
    Nasus: 'Shurima',
    Nautilus: 'Bilgewater',
    Neeko: 'Ixtal',
    Nidalee: 'Ixtal',
    Nilah: 'Bilgewater',
    Nocturne: 'Runeterra',
    Nunu: 'Freljord',
    Olaf: 'Freljord',
    Orianna: 'Piltover',
    Ornn: 'Freljord',
    Pantheon: 'Targon',
    Poppy: 'Demacia',
    Pyke: 'Bilgewater',
    Qiyana: 'Ixtal',
    Quinn: 'Demacia',
    Rakan: 'Ionia',
    Rammus: 'Shurima',
    RekSai: 'Void',
    Rell: 'Noxus',
    Renata: 'Zaun',
    Renekton: 'Shurima',
    Rengar: 'Ixtal',
    Riven: 'Noxus',
    Rumble: 'Bandle City',
    Ryze: 'Runeterra',
    Samira: 'Noxus',
    Sejuani: 'Freljord',
    Senna: 'Demacia',
    Seraphine: 'Piltover',
    Sett: 'Ionia',
    Shaco: 'Runeterra',
    Shen: 'Ionia',
    Shyvana: 'Demacia',
    Singed: 'Zaun',
    Sion: 'Noxus',
    Sivir: 'Shurima',
    Skarner: 'Shurima',
    Sona: 'Demacia',
    Soraka: 'Targon',
    Swain: 'Noxus',
    Sylas: 'Demacia',
    Syndra: 'Ionia',
    TahmKench: 'Runeterra',
    Taliyah: 'Shurima',
    Talon: 'Noxus',
    Taric: 'Targon',
    Teemo: 'Bandle City',
    Thresh: 'Shadow Isles',
    Tristana: 'Bandle City',
    Trundle: 'Freljord',
    Tryndamere: 'Freljord',
    TwistedFate: 'Bilgewater',
    Twitch: 'Zaun',
    Udyr: 'Freljord',
    Urgot: 'Zaun',
    Varus: 'Ionia',
    Vayne: 'Demacia',
    Veigar: 'Bandle City',
    Velkoz: 'Void',
    Vex: 'Shadow Isles',
    Vi: 'Piltover',
    Viego: 'Shadow Isles',
    Viktor: 'Zaun',
    Vladimir: 'Noxus',
    Volibear: 'Freljord',
    Warwick: 'Zaun',
    Xayah: 'Ionia',
    Xerath: 'Shurima',
    XinZhao: 'Demacia',
    Yasuo: 'Ionia',
    Yone: 'Ionia',
    Yorick: 'Shadow Isles',
    Yuumi: 'Bandle City',
    Zac: 'Zaun',
    Zed: 'Ionia',
    Zeri: 'Zaun',
    Ziggs: 'Zaun',
    Zilean: 'Icathia',
    Zoe: 'Targon',
    Zyra: 'Ixtal',
};
const originImageUrls = {
    'Bandle City': `${process.env.PUBLIC_URL}/regions/bandle_city.jpg`,
    Bilgewater: `${process.env.PUBLIC_URL}/regions/bilgewater.jpg`,
    Demacia: `${process.env.PUBLIC_URL}/regions/demacia.jpg`,
    Freljord: `${process.env.PUBLIC_URL}/regions/freljord.jpg`,
    Icathia: `${process.env.PUBLIC_URL}/regions/icathia.jpg`,
    Ionia: `${process.env.PUBLIC_URL}/regions/ionia.jpg`,
    Ixtal: `${process.env.PUBLIC_URL}/regions/ixtal.jpg`,
    Noxus: `${process.env.PUBLIC_URL}/regions/noxus.jpg`,
    Piltover: `${process.env.PUBLIC_URL}/regions/piltover.jpg`,
    'Shadow Isles': `${process.env.PUBLIC_URL}/regions/shadow_isles.jpg`,
    Shurima: `${process.env.PUBLIC_URL}/regions/shurima.jpg`,
    Targon: `${process.env.PUBLIC_URL}/regions/targon.jpg`,
    Void: `${process.env.PUBLIC_URL}/regions/void.jpg`,
    Zaun: `${process.env.PUBLIC_URL}/regions/zaun.jpg`,
};

function BlueEssenceIcon({ className = '' }) {
    return (
        <img className={`blue-essence-icon ${className}`.trim()} src={BLUE_ESSENCE_ICON_URL} alt='' aria-hidden='true' />
    );
}

function PriceAmount({ value, className = '' }) {
    return (
        <span className={`price-amount ${className}`.trim()}>
            <span>{value.toLocaleString()}</span>
            <BlueEssenceIcon />
        </span>
    );
}

const heroTextParent = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.04,
            staggerDirection: -1,
        },
    },
};

const heroTextItem = {
    hidden: {
        opacity: 0,
        y: 18,
        filter: 'blur(6px)',
    },
    show: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -14,
        filter: 'blur(4px)',
        transition: {
            duration: 0.25,
            ease: 'easeIn',
        },
    },
};

const filterContentVariants = {
    closed: {
        height: 0,
        opacity: 0,
        y: -4,
        transition: {
            duration: 0.18,
            ease: 'easeInOut',
        },
    },
    open: {
        height: 'auto',
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.24,
            ease: 'easeOut',
        },
    },
};

function scoreChampion(champion) {
    return champion.info.attack + champion.info.defense + champion.info.magic + champion.info.difficulty;
}

function rarityFor(champion) {
    const price = getChampionBlueEssence(champion);

    if (price >= 6300) {
        return 'mythic';
    }

    if (price >= 4800) {
        return 'legendary';
    }

    if (price >= 3150) {
        return 'epic';
    }

    if (price >= 1350) {
        return 'rare';
    }

    return 'common';
}

function ChampionCard({ champion, owned = false, inCart = false, favorite = false, justBought = false, onAction, onOpen, onFavoriteToggle, cartTargetRef, favoriteTargetRef, onCartFlight, onFavoriteFlight }) {
    const rarity = rarityFor(champion);
    const config = rarityConfig[rarity];
    const isHolo = rarity === 'legendary' || rarity === 'mythic';
    const primaryRole = champion.tags[0] || 'Champion';
    const blueEssence = getChampionBlueEssence(champion);
    const cardRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [inCompare, setInCompare] = useState(false);
    const [cartAnimating, setCartAnimating] = useState(false);
    const [favoriteAnimating, setFavoriteAnimating] = useState(false);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 250, damping: 24 });
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 24 });
    const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);

    const handleMove = (event) => {
        const element = cardRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const resetTilt = () => {
        mx.set(0);
        my.set(0);
        setHovered(false);
    };

    const toggleWished = (event) => {
        event.stopPropagation();

        if (!favorite && favoriteAnimating) {
            return;
        }

        if (!favorite) {
            setFavoriteAnimating(true);

            const cardRect = cardRef.current?.getBoundingClientRect();
            const favoriteRect = favoriteTargetRef?.current?.getBoundingClientRect();

            if (cardRect && favoriteRect) {
                const startWidth = Math.min(cardRect.width * 0.48, 94);
                const startHeight = startWidth * 1.36;
                const startX = cardRect.left + cardRect.width / 2 - startWidth / 2;
                const startY = cardRect.top + cardRect.height / 2 - startHeight / 2;
                const endX = favoriteRect.left + favoriteRect.width / 2 - startX - startWidth / 2;
                const endY = favoriteRect.top + favoriteRect.height / 2 - startY - startHeight / 2;

                onFavoriteFlight?.({
                    id: `${champion.id}-favorite-${Date.now()}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--favorite-flight-x': `${endX}px`,
                    '--favorite-flight-y': `${endY}px`,
                });
            }

            window.setTimeout(() => setFavoriteAnimating(false), 760);
            window.setTimeout(() => onFavoriteToggle?.(champion), 720);
            return;
        }

        onFavoriteToggle?.(champion);
    };

    const toggleCompare = (event) => {
        event.stopPropagation();
        setInCompare((current) => !current);
    };

    const previewChampion = (event) => {
        event.stopPropagation();
        onOpen(champion);
    };

    const handleMediaKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen(champion);
        }
    };

    const handleAction = () => {
        if (!owned && !inCart && cartAnimating) {
            return;
        }

        if (!owned && !inCart) {
            setCartAnimating(true);

            const cardRect = cardRef.current?.getBoundingClientRect();
            const cartRect = cartTargetRef?.current?.getBoundingClientRect();

            if (cardRect && cartRect) {
                const startWidth = Math.min(cardRect.width * 0.56, 112);
                const startHeight = startWidth * 1.36;
                const startX = cardRect.left + cardRect.width / 2 - startWidth / 2;
                const startY = cardRect.top + cardRect.height / 2 - startHeight / 2;
                const endX = cartRect.left + cartRect.width / 2 - startX - startWidth / 2;
                const endY = cartRect.top + cartRect.height / 2 - startY - startHeight / 2;

                onCartFlight?.({
                    id: `${champion.id}-${Date.now()}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--flight-x': `${endX}px`,
                    '--flight-y': `${endY}px`,
                });
            }

            window.setTimeout(() => setCartAnimating(false), 860);
            window.setTimeout(() => onAction(champion), 760);
            return;
        }

        onAction(champion);
    };

    return (
        <motion.article
            ref={cardRef}
            className={`market-card rarity-${rarity} ${justBought ? 'is-purchase-animating' : ''} ${cartAnimating ? 'is-cart-animating' : ''} ${favoriteAnimating ? 'is-favorite-animating' : ''}`}
            onMouseMove={handleMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={resetTilt}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                '--card-rarity-border': hovered ? config.color : 'var(--border)',
                '--card-rarity-glow': hovered ? config.glow : 'rgba(0,0,0,0.6)',
            }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className='market-card-media' onClick={() => onOpen(champion)} onKeyDown={handleMediaKeyDown} role='button' tabIndex='0' aria-label={`${champion.name} details`}>
                <img src={championLoadingImage(champion.id)} alt={champion.name} loading='lazy' draggable='false' />
                <span className='market-card-vignette' />
                <span className='market-card-glow' style={{ background: `radial-gradient(70% 50% at 50% 100%, ${config.glow}, transparent 70%)` }} />
                {justBought ? (
                    <span className='purchase-burst' aria-hidden='true'>
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                ) : null}
                {isHolo ? <motion.span className='market-card-holo' aria-hidden style={{ backgroundPositionX: glareX }} animate={hovered ? { backgroundPosition: ['0% 0%', '200% 200%'] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} /> : null}
                <span className='market-card-top'>
                    <span
                        className='market-card-rarity'
                        style={{ color: config.color, borderColor: config.border, backgroundColor: `color-mix(in srgb, #070b12 78%, ${config.color})` }}
                    >
                        {isHolo ? <Sparkles size={12} strokeWidth={2.2} aria-hidden='true' /> : null}
                        {config.label}
                    </span>
                    {owned ? (
                        <span className='market-card-owned'>
                            <Check size={12} strokeWidth={3} aria-hidden='true' />
                            Owned
                        </span>
                    ) : null}
                </span>
                <span className='market-card-quick-actions'>
                    <button type='button' className='market-card-icon-action' onClick={previewChampion} aria-label={`Preview ${champion.name}`}>
                        <Eye size={16} strokeWidth={2.2} />
                    </button>
                    <button type='button' className={`market-card-icon-action ${favorite ? 'is-wished' : ''}`} onClick={toggleWished} aria-label={favorite ? `Remove ${champion.name} from favorites` : `Add ${champion.name} to favorites`}>
                        <Heart size={16} strokeWidth={2.2} />
                    </button>
                    <button type='button' className={`market-card-icon-action ${inCompare ? 'is-compare' : ''}`} onClick={toggleCompare} aria-label='Compare'>
                        <Plus size={16} strokeWidth={2.2} />
                    </button>
                </span>
            </div>
            <div className='market-card-body'>
                <div className='market-card-title-row'>
                    <div>
                        <h3>{champion.name}</h3>
                        <p>{champion.title}</p>
                    </div>
                    <span className='market-card-role-badge'>{primaryRole}</span>
                </div>
                <div className='market-card-footer'>
                    <div className='market-card-price'>
                        <span aria-hidden='true'><BlueEssenceIcon /></span>
                        <strong>{blueEssence.toLocaleString()}</strong>
                    </div>
                    <motion.button type='button' whileTap={{ scale: 0.94 }} className={owned ? 'sell-action' : `buy-action ${inCart ? 'is-in-cart' : ''}`} onClick={handleAction} disabled={owned}>
                        {owned || inCart ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.4} />}
                        <span className='buy-action-label'>{owned ? 'Owned' : inCart ? 'Added' : 'Cart'}</span>
                        {cartAnimating ? (
                            <span className='button-cart-effect' aria-hidden='true'>
                                <span className='button-cart-sweep' />
                                <span className='button-cart-ring' />
                                <span className='button-cart-burst'>
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </span>
                            </span>
                        ) : null}
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
}

function FavoritesPanel({ favorites, ownedChampions, cartItems, addToCart, removeFromCart, removeFavorite, clearFavorites, openChampionModal }) {
    const hasFavorites = favorites.length > 0;

    return (
        <section className='favorites-panel' aria-label='Favorite champions'>
            <div className='favorites-panel-head'>
                <div>
                    <span>
                        <Heart size={15} strokeWidth={2.4} />
                        Favorites
                    </span>
                    <strong>{favorites.length} saved</strong>
                </div>
                {hasFavorites ? (
                    <button type='button' onClick={clearFavorites}>
                        Clear
                    </button>
                ) : null}
            </div>

            {hasFavorites ? (
                <div className='favorites-list'>
                    {favorites.map((champion) => {
                        const owned = ownedChampions.some((card) => card.id === champion.id);
                        const inCart = cartItems.some((card) => card.id === champion.id);

                        return (
                            <article
                                className='favorite-item'
                                key={champion.id}
                                role='button'
                                tabIndex='0'
                                onClick={() => openChampionModal(champion)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        openChampionModal(champion);
                                    }
                                }}
                                aria-label={`Preview ${champion.name}`}
                            >
                                <div className='favorite-item-art'>
                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                </div>
                                <div className='favorite-item-copy'>
                                    <strong>{champion.name}</strong>
                                    <span>{champion.title}</span>
                                    <PriceAmount value={getChampionBlueEssence(champion)} />
                                </div>
                                <div className='favorite-item-actions'>
                                    <button
                                        type='button'
                                        className='favorite-icon-button'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeFavorite(champion.id);
                                        }}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        aria-label={`Remove ${champion.name} from favorites`}
                                    >
                                        <AiOutlineClose />
                                    </button>
                                    <button
                                        type='button'
                                        className='favorite-add-button'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            inCart ? removeFromCart(champion.id) : addToCart(champion);
                                        }}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        disabled={owned}
                                    >
                                        {owned || inCart ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.4} />}
                                        <span>{owned ? 'Owned' : inCart ? 'Added' : 'Cart'}</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className='favorites-empty'>
                    <Heart size={30} strokeWidth={2.1} />
                    <strong>No favorites yet</strong>
                    <span>Use the heart button on champion cards.</span>
                </div>
            )}
        </section>
    );
}

function CartPanel({ cartItems, cartTotal, cartMissingBalance, money, removeFromCart, clearCart, checkoutCart, collectionTargetRef, onCollectionFlights, openChampionModal }) {
    const hasItems = cartItems.length > 0;
    const cartListRef = useRef(null);

    const handleCheckout = () => {
        if (!hasItems || cartMissingBalance > 0) {
            return;
        }

        const targetRect = collectionTargetRef?.current?.getBoundingClientRect();
        const itemNodes = cartListRef.current ? Array.from(cartListRef.current.querySelectorAll('[data-cart-item-id]')) : [];

        if (targetRect && itemNodes.length > 0) {
            const flights = cartItems.map((champion, index) => {
                const itemRect = itemNodes[index]?.getBoundingClientRect();

                if (!itemRect) {
                    return null;
                }

                const startWidth = 58;
                const startHeight = 78;
                const startX = itemRect.left + 8;
                const startY = itemRect.top + itemRect.height / 2 - startHeight / 2;
                const columnOffset = (index % 5) * 18;
                const rowOffset = Math.floor(index / 5) * 14;
                const endX = targetRect.left + 54 + columnOffset - startX - startWidth / 2;
                const endY = targetRect.top + targetRect.height / 2 + rowOffset - startY - startHeight / 2;

                return {
                    id: `${champion.id}-collection-${Date.now()}-${index}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--flight-x': `${endX}px`,
                    '--flight-y': `${endY}px`,
                    '--flight-delay': `${index * 70}ms`,
                };
            }).filter(Boolean);

            onCollectionFlights?.(flights);
        }

        checkoutCart();
    };

    return (
        <aside className='cart-panel' aria-labelledby='cart-panel-title'>
            <div className='cart-panel-heading'>
                <div>
                    <span><ShoppingCart size={16} strokeWidth={2.4} />Cart</span>
                    <h3 id='cart-panel-title'>{cartItems.length} Cards</h3>
                </div>
                {hasItems ? (
                    <button type='button' className='cart-clear' onClick={clearCart}>
                        Clear
                    </button>
                ) : null}
            </div>

            {hasItems ? (
                <div className='cart-list' ref={cartListRef}>
                    {cartItems.map((champion) => (
                        <div
                            className='cart-item'
                            key={champion.id}
                            data-cart-item-id={champion.id}
                            role='button'
                            tabIndex='0'
                            onClick={() => openChampionModal(champion)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openChampionModal(champion);
                                }
                            }}
                            aria-label={`Preview ${champion.name}`}
                        >
                            <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                            <div>
                                <strong>{champion.name}</strong>
                                <PriceAmount value={getChampionBlueEssence(champion)} />
                            </div>
                            <button
                                type='button'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeFromCart(champion.id);
                                }}
                                onKeyDown={(event) => event.stopPropagation()}
                                aria-label={`Remove ${champion.name} from cart`}
                            >
                                <AiOutlineClose />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='cart-empty'>
                    <ShoppingCart size={22} strokeWidth={2.2} />
                    <span>No cards selected</span>
                </div>
            )}

            <div className='cart-totals'>
                <div>
                    <span>Total Blue Essence</span>
                    <PriceAmount value={cartTotal} />
                </div>
                <div>
                    <span>After Purchase</span>
                    <PriceAmount value={Math.max(money - cartTotal, 0)} />
                </div>
            </div>

            <button type='button' className='cart-checkout' onClick={handleCheckout} disabled={!hasItems || cartMissingBalance > 0}>
                <Check size={16} strokeWidth={2.6} />
                Buy All
            </button>
        </aside>
    );
}

function HeroStat({ label, value, tone }) {
    const scaledValue = Math.min(Math.max(value * 10, 0), 100);

    return (
        <div className='hero-stat'>
            <span>{label}</span>
            <div className='hero-stat-track'>
                <i style={{ width: `${scaledValue}%` }} className={`tone-${tone}`} />
            </div>
            <strong>{scaledValue}</strong>
        </div>
    );
}

function CollectionPanel({ champions, ownedChampions, showcaseIds = [], onClearShowcaseSlot, onOpenShowcasePicker, impactWave, openChampionModal, onOpenStore }) {
    const [profileRoleFilter, setProfileRoleFilter] = useState('all');
    const [profileRarityFilter, setProfileRarityFilter] = useState('all');
    const [profileRegionFilter, setProfileRegionFilter] = useState('all');
    const [profileSortFilter, setProfileSortFilter] = useState('value');
    const total = champions.length;
    const ownedCount = ownedChampions.length;
    const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
    const legendaryCount = ownedChampions.filter((champion) => ['legendary', 'mythic'].includes(rarityFor(champion))).length;
    const collectionValue = ownedChampions.reduce((sum, champion) => sum + getChampionBlueEssence(champion), 0);
    const ownedSorted = [...ownedChampions].sort((a, b) => (
        getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
        a.name.localeCompare(b.name)
    ));
    const featuredChampion = ownedSorted[0];
    const collectionLevel = Math.max(1, Math.floor(ownedCount / 8) + 1);
    const nextLevelAt = collectionLevel * 8;
    const levelProgress = nextLevelAt > 0 ? Math.round((ownedCount / nextLevelAt) * 100) : 0;
    const championRegion = (champion) => championOrigins[champion.id] || 'Runeterra';
    const roleCounts = sidebarRoles.map((role) => ({
        role,
        count: ownedChampions.filter((champion) => champion.tags?.includes(role)).length,
    })).sort((a, b) => b.count - a.count || a.role.localeCompare(b.role));
    const favoriteRole = roleCounts.find((item) => item.count > 0)?.role || 'Unclaimed';
    const allRegions = Array.from(new Set(champions.map((champion) => championRegion(champion)))).sort();
    const regionProgress = allRegions.map((region) => {
        const regionTotal = champions.filter((champion) => championRegion(champion) === region).length;
        const regionOwned = ownedChampions.filter((champion) => championRegion(champion) === region).length;

        return {
            region,
            owned: regionOwned,
            total: regionTotal,
            pct: regionTotal > 0 ? Math.round((regionOwned / regionTotal) * 100) : 0,
        };
    }).sort((a, b) => b.owned - a.owned || b.pct - a.pct || a.region.localeCompare(b.region));
    const favoriteRegion = regionProgress.find((region) => region.owned > 0) || regionProgress[0] || { region: 'Runeterra', owned: 0, total: 0, pct: 0 };
    const rarityProgress = Object.keys(rarityConfig).map((rarity) => {
        const rarityTotal = champions.filter((champion) => rarityFor(champion) === rarity).length;
        const rarityOwned = ownedChampions.filter((champion) => rarityFor(champion) === rarity).length;

        return {
            rarity,
            owned: rarityOwned,
            total: rarityTotal,
            pct: rarityTotal > 0 ? Math.round((rarityOwned / rarityTotal) * 100) : 0,
        };
    });
    const showcaseCards = [0, 1, 2].map((index) => (
        ownedChampions.find((champion) => champion.id === showcaseIds[index]) || null
    ));
    const milestones = [
        { label: 'First Card', value: 'Starter', complete: ownedCount > 0 },
        { label: '10 Owned', value: 'Collector', complete: ownedCount >= 10 },
        { label: 'Legendary+', value: 'Elite', complete: legendaryCount > 0 },
        { label: `${favoriteRegion.region} Set`, value: `${favoriteRegion.pct}%`, complete: favoriteRegion.total > 0 && favoriteRegion.owned === favoriteRegion.total },
        { label: 'Half Roster', value: '50%', complete: pct >= 50 },
    ];
    const profileFilteredCards = (() => {
        const filteredCards = ownedChampions.filter((champion) => {
            const matchesRole = profileRoleFilter === 'all' || champion.tags?.includes(profileRoleFilter);
            const matchesRarity = profileRarityFilter === 'all' || rarityFor(champion) === profileRarityFilter;
            const matchesRegion = profileRegionFilter === 'all' || championRegion(champion) === profileRegionFilter;

            return matchesRole && matchesRarity && matchesRegion;
        });
        const sortedCards = [...filteredCards];

        if (profileSortFilter === 'name') {
            sortedCards.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (profileSortFilter === 'rarity') {
            const rarityWeight = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
            sortedCards.sort((a, b) => (
                rarityWeight[rarityFor(b)] - rarityWeight[rarityFor(a)] ||
                getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
                a.name.localeCompare(b.name)
            ));
        }

        if (profileSortFilter === 'value') {
            sortedCards.sort((a, b) => getChampionBlueEssence(b) - getChampionBlueEssence(a) || a.name.localeCompare(b.name));
        }

        return sortedCards;
    })();
    const stats = [
        { icon: BsCollection, label: 'Owned', value: `${ownedCount}/${total}` },
        { icon: AiOutlineTrophy, label: 'Completion', value: `${pct}%` },
        { icon: AiOutlineStar, label: 'Legendary+', value: String(legendaryCount) },
    ];

    return (
        <section
            className={`collection-panel profile-collection-panel ${impactWave ? 'is-pack-impacting' : ''}`}
            id='profile'
            style={impactWave ? {
                '--impact-color': impactWave.color,
                '--impact-glow': impactWave.glow,
            } : undefined}
        >
            <div className='profile-hero-shell'>
                {featuredChampion ? <img className='profile-hero-bg' src={championSplashImage(featuredChampion.id)} alt='' aria-hidden='true' /> : null}
                <span className='profile-hero-shade' />
                <div className='profile-identity'>
                    <button
                        type='button'
                        className='profile-avatar'
                        onClick={() => featuredChampion && openChampionModal(featuredChampion)}
                        aria-label={featuredChampion ? `Preview ${featuredChampion.name}` : 'Profile avatar'}
                    >
                        <img src={featuredChampion ? championLoadingImage(featuredChampion.id) : LOL_ICON_URL} alt='' />
                    </button>
                    <div className='profile-title-block'>
                        <span><Shield size={15} strokeWidth={2.3} /> Summoner Profile</span>
                        <h2>Nexus Collector</h2>
                        <p>{favoriteRole} specialist from {favoriteRegion.region}</p>
                    </div>
                    <div className='profile-level-card'>
                        <div className='profile-level-ring' style={{ '--profile-level-pct': Math.min(levelProgress, 100) }}>
                            <svg viewBox='0 0 100 100'>
                                <circle cx='50' cy='50' r='42' />
                                <circle cx='50' cy='50' r='42' />
                            </svg>
                            <span>{collectionLevel}</span>
                        </div>
                        <div>
                            <strong>Collection Level</strong>
                            <span>{Math.max(nextLevelAt - ownedCount, 0)} cards to next</span>
                        </div>
                    </div>
                </div>

                <div className='profile-showcase'>
                    <div className='profile-showcase-head'>
                        <span><Sparkles size={15} strokeWidth={2.2} /> Showcase</span>
                        <strong>{showcaseCards.filter(Boolean).length}/3</strong>
                    </div>
                    <div className='profile-showcase-grid'>
                        {showcaseCards.map((champion, index) => (
                            champion ? (
                                <article
                                    key={champion.id}
                                    className={`profile-showcase-card rarity-${rarityFor(champion)}`}
                                    aria-label={`Preview ${champion.name}`}
                                    style={{
                                        '--showcase-color': rarityConfig[rarityFor(champion)].color,
                                        '--showcase-glow': rarityConfig[rarityFor(champion)].glow,
                                    }}
                                >
                                    <button
                                        type='button'
                                        className='profile-showcase-preview'
                                        onClick={() => openChampionModal(champion)}
                                        aria-label={`Preview ${champion.name}`}
                                    >
                                        <img src={championLoadingImage(champion.id)} alt='' />
                                        <span />
                                        <strong>{champion.name}</strong>
                                    </button>
                                    <button type='button' className='profile-showcase-edit' onClick={(event) => {
                                        event.stopPropagation();
                                        onOpenShowcasePicker(index);
                                    }} aria-label={`Edit showcase slot ${index + 1}`}>
                                        <Pencil size={14} strokeWidth={2.4} />
                                    </button>
                                    <button type='button' className='profile-showcase-clear' onClick={(event) => {
                                        event.stopPropagation();
                                        onClearShowcaseSlot(index);
                                    }} aria-label={`Clear showcase slot ${index + 1}`}>
                                        <AiOutlineClose />
                                    </button>
                                </article>
                            ) : (
                                <button type='button' className='profile-showcase-empty' key={`empty-${index}`} onClick={() => onOpenShowcasePicker(index)} aria-label={`Choose showcase slot ${index + 1}`}>
                                    <Plus size={18} strokeWidth={2.4} />
                                    <span>Select from roster</span>
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <div className='collection-stat-chips profile-stat-chips'>
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <stat.icon />
                        <p>{stat.value}</p>
                        <span>{stat.label}</span>
                    </div>
                ))}
                <div>
                    <BlueEssenceIcon />
                    <p>{collectionValue.toLocaleString()}</p>
                    <span>Vault Value</span>
                </div>
            </div>

            <div className='profile-insight-grid'>
                <section className='profile-progress-panel'>
                    <div className='profile-panel-heading'>
                        <span><AiOutlineStar /> Rarity Progress</span>
                    </div>
                    <div className='profile-rarity-progress'>
                        {rarityProgress.map(({ rarity, owned, total: rarityTotal, pct: rarityPct }) => (
                            <div key={rarity} className='profile-progress-row' style={{ '--progress-color': rarityConfig[rarity].color, '--progress-glow': rarityConfig[rarity].glow }}>
                                <div>
                                    <span>{rarityConfig[rarity].label}</span>
                                    <strong>{owned}/{rarityTotal}</strong>
                                </div>
                                <i><b style={{ width: `${rarityPct}%` }} /></i>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='profile-progress-panel'>
                    <div className='profile-panel-heading'>
                        <span><MapPin size={15} strokeWidth={2.3} /> Region Mastery</span>
                    </div>
                    <div className='profile-region-list'>
                        {regionProgress.slice(0, 6).map((region) => (
                            <div className='profile-region-row' key={region.region}>
                                <span className='profile-region-thumb'>
                                    {originImageUrls[region.region] ? <img src={originImageUrls[region.region]} alt='' /> : <MapPin size={16} strokeWidth={2.3} />}
                                </span>
                                <div>
                                    <strong>{region.region}</strong>
                                    <i><b style={{ width: `${region.pct}%` }} /></i>
                                </div>
                                <span>{region.owned}/{region.total}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='profile-progress-panel profile-milestone-panel'>
                    <div className='profile-panel-heading'>
                        <span><AiOutlineTrophy /> Milestones</span>
                    </div>
                    <div className='profile-milestones'>
                        {milestones.map((milestone) => (
                            <div className={milestone.complete ? 'is-complete' : ''} key={milestone.label}>
                                <span>{milestone.complete ? <Check size={14} strokeWidth={2.8} /> : <Sparkles size={14} strokeWidth={2.3} />}</span>
                                <div>
                                    <strong>{milestone.label}</strong>
                                    <small>{milestone.value}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className='profile-focus-strip'>
                <div>
                    <span><Swords size={16} strokeWidth={2.4} /> Favorite Role</span>
                    <strong>{favoriteRole}</strong>
                    <small>{roleCounts.find((item) => item.role === favoriteRole)?.count || 0} owned cards</small>
                </div>
                <div>
                    <span><MapPin size={16} strokeWidth={2.4} /> Strongest Region</span>
                    <strong>{favoriteRegion.region}</strong>
                    <small>{favoriteRegion.owned}/{favoriteRegion.total} collected</small>
                </div>
                <div>
                    <span><AiOutlineTrophy /> Next Goal</span>
                    <strong>{Math.max(nextLevelAt - ownedCount, 0)} Cards</strong>
                    <small>to collection level {collectionLevel + 1}</small>
                </div>
                <a href='#marketplace' onClick={onOpenStore}>
                    <ShoppingCart size={18} strokeWidth={2.4} />
                    Store
                </a>
            </div>

            <div className='profile-collection-layout'>
                <div className='profile-card-library'>
                    <div className='profile-card-library-head'>
                        <div>
                            <span><Sparkles size={15} strokeWidth={2.2} /> Owned Cards</span>
                            <h3>Personal Roster</h3>
                        </div>
                        <a href='#marketplace' className='profile-store-link' onClick={onOpenStore}>
                            Store
                            <ChevronRight size={16} strokeWidth={2.4} />
                        </a>
                    </div>

                    <div className='profile-library-controls'>
                        <select value={profileRoleFilter} onChange={(event) => setProfileRoleFilter(event.target.value)} aria-label='Filter owned cards by role'>
                            <option value='all'>All Roles</option>
                            {sidebarRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <select value={profileRarityFilter} onChange={(event) => setProfileRarityFilter(event.target.value)} aria-label='Filter owned cards by rarity'>
                            <option value='all'>All Rarities</option>
                            {Object.entries(rarityConfig).map(([key, rarity]) => <option key={key} value={key}>{rarity.label}</option>)}
                        </select>
                        <select value={profileRegionFilter} onChange={(event) => setProfileRegionFilter(event.target.value)} aria-label='Filter owned cards by region'>
                            <option value='all'>All Regions</option>
                            {regionProgress.map((region) => <option key={region.region} value={region.region}>{region.region}</option>)}
                        </select>
                        <select value={profileSortFilter} onChange={(event) => setProfileSortFilter(event.target.value)} aria-label='Sort owned cards'>
                            <option value='value'>Highest Value</option>
                            <option value='rarity'>Rarity</option>
                            <option value='name'>Name</option>
                        </select>
                    </div>

                    {profileFilteredCards.length > 0 ? (
                        <div className='profile-owned-grid'>
                            {profileFilteredCards.map((champion) => {
                                const rarity = rarityFor(champion);
                                const selectedShowcaseSlot = showcaseIds.indexOf(champion.id);

                                return (
                                    <article
                                        key={champion.id}
                                        className={`profile-owned-card rarity-${rarity} ${selectedShowcaseSlot >= 0 ? 'is-in-showcase' : ''}`}
                                        aria-label={`Preview ${champion.name}`}
                                        style={{
                                            '--owned-rarity-color': rarityConfig[rarity].color,
                                            '--owned-rarity-glow': rarityConfig[rarity].glow,
                                        }}
                                    >
                                        <button
                                            type='button'
                                            className='profile-owned-preview'
                                            onClick={() => openChampionModal(champion)}
                                            aria-label={`Preview ${champion.name}`}
                                        >
                                            <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                            <span className='profile-owned-glow' />
                                            <span className='profile-owned-rarity'>{rarityConfig[rarity].label}</span>
                                            {selectedShowcaseSlot >= 0 ? <span className='profile-owned-showcase-badge'>Showcase {selectedShowcaseSlot + 1}</span> : null}
                                            <span className='profile-owned-copy'>
                                                <strong>{champion.name}</strong>
                                                <small>{champion.tags?.[0] || 'Champion'}</small>
                                            </span>
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='profile-library-empty'>
                            <BsCollection />
                            <p>No owned cards here</p>
                            <a href='#marketplace' onClick={onOpenStore}>Browse the store</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function ShowcasePickerModal({ slotIndex, ownedChampions, showcaseIds, onSelect, onClear, onClose }) {
    const selectedChampionId = showcaseIds[slotIndex];
    const sortedChampions = [...ownedChampions].sort((a, b) => (
        getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
        a.name.localeCompare(b.name)
    ));

    return (
        <Modal show={slotIndex !== null} onHide={onClose} size='lg' centered dialogClassName='showcase-picker-dialog' contentClassName='showcase-picker-content'>
            <Modal.Body className='showcase-picker-body'>
                <button type='button' className='champion-preview-close showcase-picker-close' onClick={onClose} aria-label='Close showcase picker'>
                    <AiOutlineClose />
                </button>
                <div className='showcase-picker-head'>
                    <div>
                        <span><Sparkles size={15} strokeWidth={2.3} /> Showcase Slot {slotIndex + 1}</span>
                        <h3>Select Champion</h3>
                    </div>
                    {selectedChampionId ? (
                        <button type='button' className='showcase-picker-clear' onClick={() => onClear(slotIndex)}>
                            Clear Slot
                        </button>
                    ) : null}
                </div>

                {sortedChampions.length > 0 ? (
                    <div className='showcase-picker-grid'>
                        {sortedChampions.map((champion) => {
                            const rarity = rarityFor(champion);
                            const selected = selectedChampionId === champion.id;
                            const usedSlot = showcaseIds.indexOf(champion.id);

                            return (
                                <button
                                    type='button'
                                    key={champion.id}
                                    className={`showcase-picker-card rarity-${rarity} ${selected ? 'active' : ''}`}
                                    onClick={() => onSelect(slotIndex, champion.id)}
                                    style={{
                                        '--picker-rarity-color': rarityConfig[rarity].color,
                                        '--picker-rarity-glow': rarityConfig[rarity].glow,
                                    }}
                                >
                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                    <span className='showcase-picker-card-glow' />
                                    <span className='showcase-picker-card-rarity'>{rarityConfig[rarity].label}</span>
                                    {usedSlot >= 0 ? <span className='showcase-picker-card-slot'>Slot {usedSlot + 1}</span> : null}
                                    <span className='showcase-picker-card-copy'>
                                        <strong>{champion.name}</strong>
                                        <small>{champion.tags?.[0] || 'Champion'}</small>
                                    </span>
                                    {selected ? <span className='showcase-picker-check'><Check size={14} strokeWidth={3} /></span> : null}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className='showcase-picker-empty'>
                        <BsCollection />
                        <p>No owned cards yet</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

const rarityConfig = {
    common: { label: 'Common', color: 'var(--rarity-common)', border: 'rgba(170,180,200,0.5)', glow: 'rgba(170,180,200,0.35)' },
    rare: { label: 'Rare', color: 'var(--rarity-rare)', border: 'rgba(90,160,255,0.6)', glow: 'rgba(90,160,255,0.35)' },
    epic: { label: 'Epic', color: 'var(--rarity-epic)', border: 'rgba(190,110,255,0.6)', glow: 'rgba(190,110,255,0.36)' },
    legendary: { label: 'Legendary', color: 'var(--rarity-legendary)', border: 'rgba(232,196,110,0.75)', glow: 'rgba(232,196,110,0.36)' },
    mythic: { label: 'Mythic', color: 'var(--rarity-mythic)', border: 'rgba(255,110,120,0.7)', glow: 'rgba(255,110,120,0.36)' },
};
const PACK_OPEN_COST = 1350;
const PACK_RARITY_CHANCES = [
    { rarity: 'common', chance: 40 },
    { rarity: 'rare', chance: 30 },
    { rarity: 'epic', chance: 18 },
    { rarity: 'legendary', chance: 9 },
    { rarity: 'mythic', chance: 3 },
];

function pickPackChampion(champions) {
    const pools = PACK_RARITY_CHANCES.reduce((groups, item) => ({
        ...groups,
        [item.rarity]: champions.filter((champion) => rarityFor(champion) === item.rarity),
    }), {});
    const activeChances = PACK_RARITY_CHANCES.filter((item) => pools[item.rarity].length > 0);
    const totalChance = activeChances.reduce((total, item) => total + item.chance, 0);
    let roll = Math.random() * totalChance;
    const selectedChance = activeChances.find((item) => {
        roll -= item.chance;
        return roll <= 0;
    }) || activeChances[activeChances.length - 1];
    const selectedPool = pools[selectedChance.rarity];

    return selectedPool[Math.floor(Math.random() * selectedPool.length)];
}

function uniqueChampionsById(champions) {
    return Array.from(new Map(champions.filter(Boolean).map((champion) => [champion.id, champion])).values());
}

function buildPackRouletteItems(packPool, champion) {
    const uniquePool = uniqueChampionsById([champion, ...packPool]);
    const shuffledPool = [...uniquePool].sort(() => Math.random() - 0.5);
    const winnerIndex = Math.min(36, Math.max(2, shuffledPool.length - 1));
    const withoutWinner = shuffledPool.filter((item) => item.id !== champion.id);
    const rouletteChampions = [
        ...withoutWinner.slice(0, winnerIndex),
        champion,
        ...withoutWinner.slice(winnerIndex),
    ];

    return {
        items: rouletteChampions.map((rouletteChampion, index) => ({
            key: `${rouletteChampion.id}-${index}`,
            champion: rouletteChampion,
            isWinner: rouletteChampion.id === champion.id,
        })),
        winnerIndex,
    };
}

function RarityPill({ rarity }) {
    const config = rarityConfig[rarity];

    return (
        <span
            className='trending-rarity'
            style={{ color: config.color, borderColor: config.border, backgroundColor: `color-mix(in oklch, ${config.color} 14%, transparent)` }}
        >
            <Sparkles size={12} strokeWidth={2} aria-hidden='true' />
            {config.label}
        </span>
    );
}

function FilterSection({ title, isOpen, onToggle, last = false, children }) {
    return (
        <section className={`filter-section ${last ? 'filter-section-last' : ''} ${isOpen ? '' : 'filter-section-closed'}`}>
            <button
                type='button'
                className='filter-section-trigger'
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <ChevronDown size={16} strokeWidth={2.2} className='filter-chevron' />
            </button>
            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.div
                        className='filter-section-content'
                        initial='closed'
                        animate='open'
                        exit='closed'
                        variants={filterContentVariants}
                    >
                        {children}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}

function TrendingCarousel({ champions, openChampionModal }) {
    const scrollerRef = useRef(null);
    const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
    const trending = useMemo(() => (
        [...champions].sort((a, b) => scoreChampion(b) - scoreChampion(a)).slice(0, 12)
    ), [champions]);

    const updateScrollEdges = () => {
        const scroller = scrollerRef.current;

        if (!scroller) {
            setScrollEdges({ left: false, right: false });
            return;
        }

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        const nextEdges = {
            left: scroller.scrollLeft > 1,
            right: scroller.scrollLeft < maxScrollLeft - 1,
        };

        setScrollEdges((currentEdges) => (
            currentEdges.left === nextEdges.left && currentEdges.right === nextEdges.right
                ? currentEdges
                : nextEdges
        ));
    };

    useEffect(() => {
        const scroller = scrollerRef.current;

        updateScrollEdges();

        if (!scroller) {
            return undefined;
        }

        scroller.addEventListener('scroll', updateScrollEdges, { passive: true });
        window.addEventListener('resize', updateScrollEdges);

        return () => {
            scroller.removeEventListener('scroll', updateScrollEdges);
            window.removeEventListener('resize', updateScrollEdges);
        };
    }, [trending.length]);

    const scrollByCards = (direction) => {
        if (!scrollerRef.current) {
            return;
        }

        scrollerRef.current.scrollBy({ left: direction * scrollerRef.current.clientWidth * 0.8, behavior: 'smooth' });
    };

    return (
        <section className='trending-section' id='trending'>
            <div className='trending-kicker'>
                <Flame size={16} strokeWidth={2.4} />
                Trending Now
            </div>
            <div className='trending-carousel'>
                <div className='trending-fade-left' />
                <div className='trending-fade-right' />
                {scrollEdges.left ? (
                    <button type='button' className='trending-arrow trending-arrow-left' onClick={() => scrollByCards(-1)} aria-label='Scroll left'>
                        <ChevronLeft size={20} />
                    </button>
                ) : null}
                {scrollEdges.right ? (
                    <button type='button' className='trending-arrow trending-arrow-right' onClick={() => scrollByCards(1)} aria-label='Scroll right'>
                        <ChevronRight size={20} />
                    </button>
                ) : null}
                <div className='trending-track' ref={scrollerRef}>
                    {trending.map((champion) => {
                        const rarity = rarityFor(champion);
                        const config = rarityConfig[rarity];

                        return (
                            <button
                                type='button'
                                key={champion.id}
                                className='trending-card'
                                onClick={() => openChampionModal(champion)}
                            >
                                <img src={championSplashImage(champion.id)} alt={champion.name} draggable='false' loading='lazy' />
                                <div className='trending-card-gradient' />
                                <div className='trending-card-glow' style={{ background: `radial-gradient(60% 80% at 80% 50%, ${config.glow}, transparent 70%)` }} />
                                <div className='trending-card-ring' style={{ boxShadow: `inset 0 0 30px ${config.glow}`, borderColor: config.border }} />
                                <div className='trending-card-content'>
                                    <RarityPill rarity={rarity} />
                                    <div>
                                        <p>{champion.name}</p>
                                        <span>{champion.title}</span>
                                        <strong className='trending-price'>
                                            <BlueEssenceIcon />
                                            <span>{getChampionBlueEssence(champion).toLocaleString()}</span>
                                        </strong>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function PackOpeningSection({ champions, ownedChampions, onOpenPack, isOpening, money }) {
    const availableCount = champions.filter((champion) => !ownedChampions.some((owned) => owned.id === champion.id)).length;
    const canAfford = money >= PACK_OPEN_COST;
    const disabled = isOpening || champions.length === 0 || !canAfford;

    return (
        <section className='pack-opening-section' aria-labelledby='pack-opening-title'>
            <button type='button' className={`pack-opening-card ${isOpening ? 'is-opening' : ''} ${!canAfford ? 'is-locked' : ''}`} onClick={onOpenPack} disabled={disabled}>
                <span className='pack-opening-aura' aria-hidden='true' />
                <span className='pack-opening-seal'>
                    <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                </span>
                <span className='pack-opening-copy'>
                    <span className='pack-opening-kicker'>Champion Pack</span>
                    <strong id='pack-opening-title'>Open a Mystery Pack</strong>
                    <span className='pack-opening-status'>{availableCount > 0 ? `${availableCount} champions waiting` : 'Duplicate protection active'}</span>
                    <span className='pack-opening-odds' aria-label='Pack drop chances'>
                        {PACK_RARITY_CHANCES.map((item) => (
                            <span key={item.rarity} style={{ '--odds-color': rarityConfig[item.rarity].color }}>
                                {rarityConfig[item.rarity].label} {item.chance}%
                            </span>
                        ))}
                    </span>
                </span>
                <span className='pack-opening-action'>
                    {isOpening ? <span className='pack-action-label'>Opening</span> : null}
                    {!isOpening ? (
                        <span className='pack-action-price'>
                            <span className='wallet-coin'>
                                <BlueEssenceIcon />
                            </span>
                            <span>{PACK_OPEN_COST.toLocaleString('tr-TR')}</span>
                        </span>
                    ) : null}
                </span>
            </button>
        </section>
    );
}

function App() {
    const {
        money,
        filtered,
        displayedIChampions,
        myCardsArr,
        sellClick,
        cartItems,
        cartTotal,
        cartMissingBalance,
        dailyRewardAmount,
        dailyRewardAvailable,
        claimDailyReward,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        search,
        clearSearch,
        handleChange,
        roleIcons,
        roleFilters,
        regionOptions,
        regionFilters,
        clearRegionFilters,
        handleRegionClick,
        rarityFilters,
        handleRarityClick,
        collectionFilter,
        handleCollectionFilterClick,
        sortFilter,
        handleSortClick,
        fighterClick,
        tankClick,
        mageClick,
        assassinClick,
        marksmanClick,
        supportClick,
        maxPrice,
        setMaxPrice,
        openChampionModal,
        closeChampionModal,
        preloadChampionDetails,
        selectedChampion,
        selectedChampionDetails,
        selectedChampionSkills,
        recentlyBoughtId,
        grantPackChampion,
        setAlertt,
        totalPage,
    } = useContext(CardContext);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);
    const [heroProgress, setHeroProgress] = useState(0);
    const [activeView, setActiveView] = useState('market');
    const [activeLink, setActiveLink] = useState('Store');
    const [cartOpen, setCartOpen] = useState(false);
    const [favoritesOpen, setFavoritesOpen] = useState(false);
    const [favoriteItems, setFavoriteItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('favoriteItems') || '[]');
        } catch (error) {
            return [];
        }
    });
    const [showcaseIds, setShowcaseIds] = useState(() => {
        try {
            const storedIds = JSON.parse(localStorage.getItem('profileShowcaseIds') || '[]');
            return Array.isArray(storedIds) ? [storedIds[0] || null, storedIds[1] || null, storedIds[2] || null] : [null, null, null];
        } catch (error) {
            return [null, null, null];
        }
    });
    const [cartCatching, setCartCatching] = useState(false);
    const [favoritesCatching, setFavoritesCatching] = useState(false);
    const [cartFlight, setCartFlight] = useState(null);
    const [favoriteFlight, setFavoriteFlight] = useState(null);
    const [collectionFlights, setCollectionFlights] = useState([]);
    const [dailyEssenceFlights, setDailyEssenceFlights] = useState([]);
    const [packEssenceFlights, setPackEssenceFlights] = useState([]);
    const [packImpactWave, setPackImpactWave] = useState(null);
    const [packReward, setPackReward] = useState(null);
    const [packOpening, setPackOpening] = useState(false);
    const [walletCatching, setWalletCatching] = useState(false);
    const [displayMoney, setDisplayMoney] = useState(money);
    const [selectedSkinNum, setSelectedSkinNum] = useState(0);
    const [activePreviewTab, setActivePreviewTab] = useState('overview');
    const [activeShowcaseSlot, setActiveShowcaseSlot] = useState(null);
    const navClickLockRef = useRef(null);
    const cartDropdownRef = useRef(null);
    const favoritesDropdownRef = useRef(null);
    const favoritesButtonRef = useRef(null);
    const cartButtonRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    }, [favoriteItems]);

    useEffect(() => {
        localStorage.setItem('profileShowcaseIds', JSON.stringify(showcaseIds));
    }, [showcaseIds]);

    useEffect(() => {
        const ownedIds = new Set(myCardsArr.map((champion) => champion.id));
        setShowcaseIds((ids) => {
            const nextIds = [ids[0] || null, ids[1] || null, ids[2] || null].map((id) => (id && ownedIds.has(id) ? id : null));
            return nextIds.length === ids.length && nextIds.every((id, index) => id === ids[index]) ? ids : nextIds;
        });
    }, [myCardsArr]);

    const setShowcaseSlot = (slotIndex, championId) => {
        setShowcaseIds((ids) => {
            const nextIds = [ids[0] || null, ids[1] || null, ids[2] || null].map((id) => (id === championId ? null : id));
            nextIds[slotIndex] = championId;
            return nextIds;
        });
    };

    const clearShowcaseSlot = (slotIndex) => {
        setShowcaseIds((ids) => {
            const nextIds = [ids[0] || null, ids[1] || null, ids[2] || null];
            nextIds[slotIndex] = null;
            return nextIds;
        });
    };

    const selectShowcaseCard = (slotIndex, championId) => {
        setShowcaseSlot(slotIndex, championId);
        setActiveShowcaseSlot(null);
    };

    const clearActiveShowcaseSlot = (slotIndex) => {
        clearShowcaseSlot(slotIndex);
        setActiveShowcaseSlot(null);
    };

    const favoriteIds = useMemo(() => new Set(favoriteItems.map((champion) => champion.id)), [favoriteItems]);

    const toggleFavorite = (champion) => {
        setFavoriteItems((items) => {
            if (items.some((item) => item.id === champion.id)) {
                return items.filter((item) => item.id !== champion.id);
            }

            return [champion, ...items];
        });
    };

    const removeFavorite = (championId) => {
        setFavoriteItems((items) => items.filter((item) => item.id !== championId));
    };

    const clearFavorites = () => {
        setFavoriteItems([]);
    };

    const showFavoriteFlight = (flight) => {
        setFavoriteFlight(flight);
        window.setTimeout(() => {
            setFavoriteFlight(null);
            setFavoritesCatching(true);
            window.setTimeout(() => setFavoritesCatching(false), 620);
        }, 720);
    };

    const toggleHeroFavorite = (event, champion) => {
        if (!favoriteIds.has(champion.id)) {
            const sourceRect = event.currentTarget?.getBoundingClientRect();
            const favoriteRect = favoritesButtonRef.current?.getBoundingClientRect();

            if (sourceRect && favoriteRect) {
                const startWidth = 70;
                const startHeight = 94;
                const startX = sourceRect.left + sourceRect.width / 2 - startWidth / 2;
                const startY = sourceRect.top + sourceRect.height / 2 - startHeight / 2;
                const endX = favoriteRect.left + favoriteRect.width / 2 - startX - startWidth / 2;
                const endY = favoriteRect.top + favoriteRect.height / 2 - startY - startHeight / 2;

                showFavoriteFlight({
                    id: `${champion.id}-favorite-${Date.now()}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--favorite-flight-x': `${endX}px`,
                    '--favorite-flight-y': `${endY}px`,
                });
            }

            window.setTimeout(() => toggleFavorite(champion), 720);
            return;
        }

        toggleFavorite(champion);
    };

    useEffect(() => {
        if (!favoritesOpen) return undefined;

        const handlePointerDown = (event) => {
            if (selectedChampion) {
                return;
            }

            if (!favoritesDropdownRef.current?.contains(event.target)) {
                setFavoritesOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (selectedChampion) {
                return;
            }

            if (event.key === 'Escape') {
                setFavoritesOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [favoritesOpen, selectedChampion]);
    const walletRef = useRef(null);
    const dailyRewardButtonRef = useRef(null);
    const collectionTargetRef = useRef(null);
    const previousCartCountRef = useRef(cartItems.length);
    const displayMoneyRef = useRef(money);
    const moneyAnimationRef = useRef(null);
    const heroProgressRef = useRef(0);
    const heroLastTickRef = useRef(null);
    const [openFilterSections, setOpenFilterSections] = useState({
        role: true,
        region: true,
        price: true,
        rarity: true,
        collection: false,
        sort: false,
    });

    const roleActions = {
        Fighter: fighterClick,
        Tank: tankClick,
        Mage: mageClick,
        Assassin: assassinClick,
        Marksman: marksmanClick,
        Support: supportClick,
    };
    const sortOptions = [
        { key: 'featured', label: 'Featured' },
        { key: 'price-low', label: 'Price: Low to High' },
        { key: 'price-high', label: 'Price: High to Low' },
        { key: 'alphabetical', label: 'Alphabetical' },
        { key: 'rarity', label: 'Rarity' },
    ];

    const featured = useMemo(() => (
        [...filtered].sort((a, b) => scoreChampion(b) - scoreChampion(a)).slice(0, 4)
    ), [filtered]);

    const trending = useMemo(() => (
        [...filtered].sort((a, b) => getChampionBlueEssence(b) - getChampionBlueEssence(a) || b.info.magic - a.info.magic).slice(0, 8)
    ), [filtered]);

    const heroChampion = featured.length > 0 ? featured[activeHeroIndex % featured.length] : null;
    const heroChampionOwned = heroChampion ? myCardsArr.some((champion) => champion.id === heroChampion.id) : false;
    const heroChampionInCart = heroChampion ? cartItems.some((champion) => champion.id === heroChampion.id) : false;
    const selectedChampionOwned = selectedChampion ? myCardsArr.some((champion) => champion.id === selectedChampion.id) : false;
    const selectedChampionInCart = selectedChampion ? cartItems.some((champion) => champion.id === selectedChampion.id) : false;
    const ResourceIcon = resourceIcons[selectedChampion?.partype?.toLowerCase()] || Droplet;
    const selectedChampionOrigin = championOrigins[selectedChampion?.id] || 'Runeterra';
    const selectedChampionOriginImage = originImageUrls[selectedChampionOrigin];
    const sameOriginChampions = useMemo(() => {
        if (!selectedChampion) {
            return [];
        }

        return filtered
            .filter((champion) => (championOrigins[champion.id] || 'Runeterra') === selectedChampionOrigin)
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [filtered, selectedChampion, selectedChampionOrigin]);
    const toggleFilterSection = (section) => {
        setOpenFilterSections((sections) => ({
            ...sections,
            [section]: !sections[section],
        }));
    };

    const showCartFlight = (flight) => {
        setCartFlight(flight);
        window.setTimeout(() => {
            setCartFlight((currentFlight) => (
                currentFlight?.id === flight.id ? null : currentFlight
            ));
        }, 900);
    };

    const showCollectionFlights = (flights) => {
        if (!flights.length) {
            return;
        }

        setCollectionFlights(flights);
        window.setTimeout(() => setCollectionFlights([]), 1300);
    };

    const handlePackOpen = (event) => {
        if (packOpening || filtered.length === 0) {
            return;
        }

        if (money < PACK_OPEN_COST) {
            setAlertt(true);
            return;
        }

        const ownedIds = new Set(myCardsArr.map((champion) => champion.id));
        const availableChampions = filtered.filter((champion) => !ownedIds.has(champion.id));
        const packPool = availableChampions.length > 0 ? availableChampions : filtered;
        const champion = pickPackChampion(packPool);
        const rewardId = `pack-reward-${champion.id}-${Date.now()}`;
        const roulette = buildPackRouletteItems(packPool, champion);
        const triggerRect = event.currentTarget?.getBoundingClientRect();

        if (triggerRect) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const flights = Array.from({ length: 9 }, (_, index) => {
                const startX = triggerRect.right - 56 + (index % 3) * 8;
                const startY = triggerRect.top + triggerRect.height / 2 - 8 + (Math.floor(index / 3) - 1) * 7;

                return {
                    id: `pack-essence-${Date.now()}-${index}`,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    '--essence-x': `${centerX - startX}px`,
                    '--essence-y': `${centerY - startY}px`,
                    '--essence-delay': `${index * 45}ms`,
                };
            });

            setPackEssenceFlights(flights);
            window.setTimeout(() => setPackEssenceFlights([]), 920);
        }

        setPackOpening(true);
        setPackReward({
            id: rewardId,
            champion,
            items: roulette.items,
            winnerIndex: roulette.winnerIndex,
            phase: 'ready',
        });

        window.setTimeout(() => {
            setPackReward((currentReward) => (
                currentReward?.id === rewardId
                    ? {
                        ...currentReward,
                        phase: 'rolling',
                    }
                    : currentReward
            ));
        }, 920);

        window.setTimeout(() => {
            setPackReward((currentReward) => (
                currentReward?.id === rewardId
                    ? {
                        ...currentReward,
                        phase: 'won',
                    }
                    : currentReward
            ));
        }, 6050);

        window.setTimeout(() => {
            grantPackChampion(champion, PACK_OPEN_COST);
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    const collectionRoot = collectionTargetRef.current;
                    const targetCard = collectionRoot?.querySelector(`.profile-owned-grid .profile-owned-card[aria-label="Preview ${champion.name}"]`)
                        || collectionRoot?.querySelector(`.profile-showcase-card[aria-label="Preview ${champion.name}"]`);
                    const firstOwnedCard = collectionRoot?.querySelector('.profile-owned-grid .profile-owned-card')
                        || collectionRoot?.querySelector('.profile-showcase-card');
                    const ownedGrid = collectionRoot?.querySelector('.profile-owned-grid');
                    const emptyVault = collectionRoot?.querySelector('.vault-empty');
                    const fallbackTarget = collectionRoot?.querySelector('.profile-card-library') || collectionRoot?.querySelector('.profile-hero-shell') || collectionRoot;
                    const targetRect = targetCard?.getBoundingClientRect()
                        || firstOwnedCard?.getBoundingClientRect()
                        || ownedGrid?.getBoundingClientRect()
                        || emptyVault?.getBoundingClientRect()
                        || fallbackTarget?.getBoundingClientRect();
                    const targetCenterX = targetRect
                        ? targetRect.left + (targetCard || firstOwnedCard ? targetRect.width / 2 : Math.min(44, targetRect.width / 2))
                        : window.innerWidth / 2;
                    const targetCenterY = targetRect
                        ? targetRect.top + (targetCard || firstOwnedCard ? targetRect.height / 2 : Math.min(62, targetRect.height / 2))
                        : window.innerHeight / 2;
                    const endX = targetCenterX - window.innerWidth / 2;
                    const endY = targetCenterY - window.innerHeight / 2;

                    setPackReward((currentReward) => (
                        currentReward?.id === rewardId
                            ? {
                                ...currentReward,
                                phase: 'flying',
                                '--pack-flight-x': `${endX}px`,
                                '--pack-flight-y': `${endY}px`,
                            }
                            : currentReward
                    ));

                    window.setTimeout(() => {
                        const impactRarity = rarityFor(champion);

                        setPackImpactWave({
                            id: `pack-impact-${champion.id}-${Date.now()}`,
                            left: `${targetCenterX}px`,
                            top: `${targetCenterY}px`,
                            rarity: impactRarity,
                            color: rarityConfig[impactRarity].color,
                            glow: rarityConfig[impactRarity].glow,
                        });
                        window.setTimeout(() => setPackImpactWave(null), 1500);
                    }, 1080);
                });
            });
        }, 6900);

        window.setTimeout(() => {
            setPackReward((currentReward) => (
                currentReward?.id === rewardId ? null : currentReward
            ));
            setPackOpening(false);
        }, 8150);
    };

    const handleDailyRewardClaim = () => {
        const rewardRect = dailyRewardButtonRef.current?.getBoundingClientRect();
        const walletRect = walletRef.current?.getBoundingClientRect();
        const claimedAmount = claimDailyReward();

        if (!claimedAmount) {
            return;
        }

        if (rewardRect && walletRect) {
            const flights = Array.from({ length: 7 }, (_, index) => {
                const startX = rewardRect.left + rewardRect.width / 2 - 5 + (index - 3) * 5;
                const startY = rewardRect.top + rewardRect.height / 2 - 6;
                const endX = walletRect.left + 28 + (index % 3) * 5 - startX;
                const endY = walletRect.top + walletRect.height / 2 - startY;

                return {
                    id: `daily-essence-${Date.now()}-${index}`,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    '--essence-x': `${endX}px`,
                    '--essence-y': `${endY}px`,
                    '--essence-arc': `${42 + (index % 4) * 12}px`,
                    '--essence-delay': `${index * 55}ms`,
                };
            });

            setDailyEssenceFlights(flights);
            window.setTimeout(() => setDailyEssenceFlights([]), 1150);
            window.setTimeout(() => {
                setWalletCatching(true);
                window.setTimeout(() => setWalletCatching(false), 620);
            }, 760);
        }

    };

    const showPrevHero = () => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => (index - 1 + featured.length) % featured.length);
    };

    const showNextHero = () => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => (index + 1) % featured.length);
    };

    const openStoreView = (event) => {
        event?.preventDefault();
        setActiveView('market');
        setActiveLink('Store');
        window.requestAnimationFrame(() => {
            const section = document.querySelector('#marketplace');

            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        window.history.replaceState(null, '', '#marketplace');
    };

    const handleNavClick = (event, link) => {
        event.preventDefault();
        window.clearTimeout(navClickLockRef.current);
        navClickLockRef.current = window.setTimeout(() => {
            navClickLockRef.current = null;
        }, 700);
        setActiveLink(link.label);
        setActiveView(link.view);

        if (link.view === 'profile') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.history.replaceState(null, '', link.href);
            return;
        }

        window.requestAnimationFrame(() => {
            const section = document.querySelector(link.href);

            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        window.history.replaceState(null, '', link.href);
    };

    useEffect(() => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => index % featured.length);
    }, [featured.length]);

    useEffect(() => {
        if (featured.length < 2) {
            return undefined;
        }

        heroProgressRef.current = 0;
        setHeroProgress(0);
        heroLastTickRef.current = null;
    }, [activeHeroIndex, featured.length]);

    useEffect(() => {
        if (featured.length < 2 || heroPaused) {
            heroLastTickRef.current = null;
            return undefined;
        }

        let frameId;

        const tick = (time) => {
            if (heroLastTickRef.current === null) {
                heroLastTickRef.current = time;
            }

            const delta = time - heroLastTickRef.current;
            heroLastTickRef.current = time;

            const nextProgress = Math.min(heroProgressRef.current + delta / HERO_AUTOPLAY_MS, 1);
            heroProgressRef.current = nextProgress;
            setHeroProgress(nextProgress);

            if (nextProgress >= 1) {
                setActiveHeroIndex((index) => (index + 1) % featured.length);
                return;
            }

            frameId = window.requestAnimationFrame(tick);
        };

        frameId = window.requestAnimationFrame(tick);

        return () => window.cancelAnimationFrame(frameId);
    }, [activeHeroIndex, featured.length, heroPaused]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                showPrevHero();
            }

            if (event.key === 'ArrowRight') {
                showNextHero();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    });

    useEffect(() => {
        const updateActiveSection = () => {
            if (navClickLockRef.current || activeView === 'profile') {
                return;
            }

            const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
            const currentLink = [...navLinks].filter((link) => link.view === 'market').reverse().find((link) => {
                const section = document.querySelector(link.href);
                return section ? section.offsetTop <= viewportAnchor : false;
            });

            if (currentLink) {
                setActiveLink(currentLink.label);
            }
        };

        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection);

        return () => {
            window.removeEventListener('scroll', updateActiveSection);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, [activeView]);

    useEffect(() => {
        setSelectedSkinNum(0);
        setActivePreviewTab('overview');
    }, [selectedChampion?.id]);

    useEffect(() => {
        if (cartItems.length > previousCartCountRef.current) {
            setCartCatching(true);
            window.setTimeout(() => setCartCatching(false), 520);
        }

        previousCartCountRef.current = cartItems.length;
    }, [cartItems.length]);

    useEffect(() => {
        window.cancelAnimationFrame(moneyAnimationRef.current);

        const startValue = displayMoneyRef.current;
        const endValue = money;

        if (startValue === endValue) {
            setDisplayMoney(endValue);
            return undefined;
        }

        const duration = 850;
        const startTime = performance.now();

        const animateMoney = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const nextValue = Math.round(startValue + (endValue - startValue) * eased);

            displayMoneyRef.current = nextValue;
            setDisplayMoney(nextValue);

            if (progress < 1) {
                moneyAnimationRef.current = window.requestAnimationFrame(animateMoney);
                return;
            }

            displayMoneyRef.current = endValue;
            setDisplayMoney(endValue);
        };

        moneyAnimationRef.current = window.requestAnimationFrame(animateMoney);

        return () => window.cancelAnimationFrame(moneyAnimationRef.current);
    }, [money]);

    useEffect(() => {
        if (!cartOpen) {
            return undefined;
        }

        const handlePointerDown = (event) => {
            if (selectedChampion) {
                return;
            }

            if (!cartDropdownRef.current?.contains(event.target)) {
                setCartOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (selectedChampion) {
                return;
            }

            if (event.key === 'Escape') {
                setCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [cartOpen, selectedChampion]);

    const filters = (
        <aside className='filter-panel'>
            <div className='filter-shell'>
                <div className='filter-panel-title'>
                    <div>
                        <SlidersHorizontal size={16} strokeWidth={2.2} />
                        <span>Filters</span>
                    </div>
                </div>

                <div className='filter-panel-body'>
                    <FilterSection title='Role' isOpen={openFilterSections.role} onToggle={() => toggleFilterSection('role')}>
                        <div className='filter-role-grid'>
                            {sidebarRoles.map((role) => (
                                <button
                                    type='button'
                                    key={role}
                                    className={`filter-role-button ${roleFilters.includes(role) ? 'active' : ''}`}
                                    onClick={roleActions[role]}
                                >
                                    <img src={roleIcons[role]} alt='' />
                                    {role}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Region' isOpen={openFilterSections.region} onToggle={() => toggleFilterSection('region')}>
                        <div className='filter-region-grid'>
                            <button
                                type='button'
                                className={`filter-region-button ${regionFilters.length === 0 ? 'active' : ''}`}
                                onClick={clearRegionFilters}
                            >
                                <span className='filter-region-icon filter-region-icon-empty'>
                                    <MapPin size={16} strokeWidth={2.2} />
                                </span>
                                <span>All Regions</span>
                            </button>
                            {regionOptions.map((region) => (
                                <button
                                    type='button'
                                    key={region.id}
                                    className={`filter-region-button ${regionFilters.includes(region.id) ? 'active' : ''}`}
                                    onClick={() => handleRegionClick(region.id)}
                                >
                                    <span className='filter-region-icon'>
                                        <img src={region.image} alt='' />
                                    </span>
                                    <span>{region.label}</span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Price Range' isOpen={openFilterSections.price} onToggle={() => toggleFilterSection('price')}>
                        <div className='filter-price-range'>
                            <div>
                                <span className='filter-price-value'>
                                    <BlueEssenceIcon />
                                    <span>450</span>
                                </span>
                                <strong className='filter-price-value'>
                                    <span>{maxPrice.toLocaleString()}</span>
                                    <BlueEssenceIcon />
                                </strong>
                            </div>
                            <input
                                type='range'
                                min='450'
                                max='6300'
                                step='450'
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                                aria-label='Maximum price'
                            />
                        </div>
                    </FilterSection>

                    <FilterSection title='Rarity' isOpen={openFilterSections.rarity} onToggle={() => toggleFilterSection('rarity')}>
                        <div className='filter-rarity-list'>
                            {Object.entries(rarityConfig).map(([key, rarity]) => (
                                <button
                                    type='button'
                                    key={key}
                                    className={`filter-rarity-button ${rarityFilters.includes(key) ? 'active' : ''}`}
                                    onClick={() => handleRarityClick(key)}
                                >
                                    <span
                                        className='filter-check-box'
                                        style={rarityFilters.includes(key) ? {
                                            '--filter-rarity-color': rarity.color,
                                        } : undefined}
                                    >
                                        {rarityFilters.includes(key) ? <Check size={13} strokeWidth={3} aria-hidden='true' /> : null}
                                    </span>
                                    <span style={rarityFilters.includes(key) ? { color: rarity.color } : undefined}>
                                        {['legendary', 'mythic'].includes(key) ? <Sparkles size={12} strokeWidth={2} style={{ color: rarity.color }} aria-hidden='true' /> : null}
                                        {rarity.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Collection' isOpen={openFilterSections.collection} onToggle={() => toggleFilterSection('collection')}>
                        <div className='filter-collection-list'>
                            <button
                                type='button'
                                className={collectionFilter === 'all' ? 'active' : ''}
                                onClick={() => handleCollectionFilterClick('all')}
                            >
                                All Cards
                                {collectionFilter === 'all' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                            <button
                                type='button'
                                className={collectionFilter === 'owned' ? 'active' : ''}
                                onClick={() => handleCollectionFilterClick('owned')}
                            >
                                Owned
                                {collectionFilter === 'owned' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                            <button
                                type='button'
                                className={collectionFilter === 'not-owned' ? 'active' : ''}
                                onClick={() => handleCollectionFilterClick('not-owned')}
                            >
                                Not Owned
                                {collectionFilter === 'not-owned' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                        </div>
                    </FilterSection>

                    <FilterSection title='Sort By' isOpen={openFilterSections.sort} onToggle={() => toggleFilterSection('sort')} last>
                        <div className='filter-sort-list'>
                            {sortOptions.map((option) => (
                                <button
                                    type='button'
                                    key={option.key}
                                    className={sortFilter === option.key ? 'active' : ''}
                                    onClick={() => handleSortClick(option.key)}
                                >
                                    <span>{option.label}</span>
                                    {sortFilter === option.key ? <Check size={16} strokeWidth={2.2} /> : null}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                </div>
            </div>
        </aside>
    );

    return (
        <div className='market-shell'>
            {cartFlight ? (
                <span
                    key={cartFlight.id}
                    className='cart-flight-card'
                    style={{
                        left: cartFlight.left,
                        top: cartFlight.top,
                        width: cartFlight.width,
                        height: cartFlight.height,
                        '--flight-x': cartFlight['--flight-x'],
                        '--flight-y': cartFlight['--flight-y'],
                    }}
                    aria-hidden='true'
                >
                    <img src={championLoadingImage(cartFlight.championId)} alt='' />
                </span>
            ) : null}
            {favoriteFlight ? (
                <span
                    key={favoriteFlight.id}
                    className='favorite-flight-card'
                    style={{
                        left: favoriteFlight.left,
                        top: favoriteFlight.top,
                        width: favoriteFlight.width,
                        height: favoriteFlight.height,
                        '--favorite-flight-x': favoriteFlight['--favorite-flight-x'],
                        '--favorite-flight-y': favoriteFlight['--favorite-flight-y'],
                    }}
                    aria-hidden='true'
                >
                    <img src={championLoadingImage(favoriteFlight.championId)} alt='' />
                    <span>
                        <Heart size={17} strokeWidth={2.5} />
                    </span>
                </span>
            ) : null}
            {collectionFlights.map((flight) => (
                <span
                    key={flight.id}
                    className='collection-flight-card'
                    style={{
                        left: flight.left,
                        top: flight.top,
                        width: flight.width,
                        height: flight.height,
                        '--flight-x': flight['--flight-x'],
                        '--flight-y': flight['--flight-y'],
                        '--flight-delay': flight['--flight-delay'],
                    }}
                    aria-hidden='true'
                >
                    <img src={championLoadingImage(flight.championId)} alt='' />
                </span>
            ))}
            {dailyEssenceFlights.map((flight) => (
                <span
                    key={flight.id}
                    className='daily-essence-flight'
                    style={{
                        left: flight.left,
                        top: flight.top,
                        '--essence-x': flight['--essence-x'],
                        '--essence-y': flight['--essence-y'],
                        '--essence-arc': flight['--essence-arc'],
                        '--essence-delay': flight['--essence-delay'],
                    }}
                    aria-hidden='true'
                />
            ))}
            {packEssenceFlights.map((flight) => (
                <span
                    key={flight.id}
                    className='pack-essence-flight'
                    style={{
                        left: flight.left,
                        top: flight.top,
                        '--essence-x': flight['--essence-x'],
                        '--essence-y': flight['--essence-y'],
                        '--essence-delay': flight['--essence-delay'],
                    }}
                    aria-hidden='true'
                >
                    <BlueEssenceIcon />
                </span>
            ))}
            {packImpactWave ? (
                <span
                    key={packImpactWave.id}
                    className={`pack-impact-wave rarity-${packImpactWave.rarity}`}
                    style={{
                        left: packImpactWave.left,
                        top: packImpactWave.top,
                        '--impact-color': packImpactWave.color,
                        '--impact-glow': packImpactWave.glow,
                    }}
                    aria-hidden='true'
                >
                    <span />
                    <span />
                    <span />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                </span>
            ) : null}
            {packReward ? (
                <div className='pack-reward-overlay' aria-live='polite'>
                    <span className='pack-reward-backdrop' />
                    <div className={`pack-case-stage phase-${packReward.phase}`}>
                        <div className='pack-case-header'>
                            <span className='pack-case-chest'>
                                <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                            </span>
                            <div>
                                <span>Hextech Chest</span>
                                <strong>{packReward.phase === 'won' ? 'Kazanan kart' : packReward.phase === 'flying' ? 'Koleksiyona ekleniyor' : 'Kasa açılıyor'}</strong>
                            </div>
                        </div>

                        <div className='pack-roulette-window'>
                            <span className='pack-roulette-marker' aria-hidden='true' />
                            <div
                                className='pack-roulette-track'
                                style={{ '--winner-offset': `${packReward.winnerIndex * 144 + 66}px` }}
                            >
                                {packReward.items.map((item) => {
                                    const rarity = rarityFor(item.champion);

                                    return (
                                        <article className={`pack-roulette-card rarity-${rarity} ${item.isWinner ? 'is-winner' : ''}`} key={item.key}>
                                            <img src={championLoadingImage(item.champion.id)} alt='' />
                                            <span className='pack-roulette-card-shade' />
                                            <span className='pack-roulette-card-name'>{item.champion.name}</span>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='pack-winner-panel'>
                            <article
                                className={`pack-winner-card rarity-${rarityFor(packReward.champion)}`}
                                style={{
                                    '--pack-flight-x': packReward['--pack-flight-x'] || '0px',
                                    '--pack-flight-y': packReward['--pack-flight-y'] || '0px',
                                }}
                            >
                                <img src={championLoadingImage(packReward.champion.id)} alt={packReward.champion.name} />
                                <span className='pack-reward-shine' />
                                <span className='pack-reward-content'>
                                    <RarityPill rarity={rarityFor(packReward.champion)} />
                                    <strong>{packReward.champion.name}</strong>
                                    <span>{packReward.champion.title}</span>
                                </span>
                            </article>
                        </div>
                    </div>
                </div>
            ) : null}
            <header className='topbar'>
                <div className='topbar-inner'>
                    <a href='#marketplace' className='brand' aria-label='Nexus home' onClick={openStoreView}>
                        <span className='brand-mark'>
                            <img src={LOL_ICON_URL} alt='League of Legends' />
                        </span>
                        <div className='brand-copy'>
                            <span>League</span>
                            <small>Champion Marketplace</small>
                        </div>
                    </a>
                    <div className='topbar-links'>
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={activeLink === link.label ? 'active' : ''}
                                onClick={(event) => handleNavClick(event, link)}
                            >
                                {link.label}
                                {activeLink === link.label ? <motion.span layoutId='nav-underline' className='topbar-link-underline' /> : null}
                            </a>
                        ))}
                    </div>
                    <label className='top-search'>
                        <Search size={17} strokeWidth={2.2} />
                        <input type='text' spellCheck='false' placeholder='Search champions, roles, regions...' value={search} onChange={handleChange} />
                        {search ? (
                            <button type='button' onClick={clearSearch} aria-label='Clear search'>
                                <AiOutlineClose />
                            </button>
                        ) : <kbd>/</kbd>}
                    </label>
                    <motion.div
                        ref={walletRef}
                        key={money}
                        className={`wallet-pill ${walletCatching ? 'is-catching' : ''}`}
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 0.35 }}
                    >
                        <span className='wallet-coin'>
                            <BlueEssenceIcon />
                        </span>
                        <span>{displayMoney.toLocaleString()}</span>
                    </motion.div>
                    <button
                        ref={dailyRewardButtonRef}
                        type='button'
                        className={`daily-reward-button ${dailyRewardAvailable ? 'is-available' : 'is-claimed'}`}
                        onClick={handleDailyRewardClaim}
                        disabled={!dailyRewardAvailable}
                    >
                        {dailyRewardAvailable ? <Gift size={16} strokeWidth={2.4} /> : <Check size={16} strokeWidth={2.6} />}
                        <span>{dailyRewardAvailable ? 'Claim' : 'Claimed'}</span>
                        {dailyRewardAvailable ? <PriceAmount value={dailyRewardAmount} /> : null}
                    </button>
                        <div className='favorites-dropdown-shell' ref={favoritesDropdownRef}>
                            <button
                                ref={favoritesButtonRef}
                                type='button'
                                className={`favorites-pill ${favoritesOpen ? 'is-open' : ''} ${favoritesCatching ? 'is-catching' : ''}`}
                                onClick={() => {
                                    setFavoritesOpen((open) => !open);
                                    setCartOpen(false);
                                }}
                                aria-label={`${favoriteItems.length} favorite champions`}
                                aria-expanded={favoritesOpen}
                                aria-haspopup='dialog'
                            >
                                <Heart size={17} strokeWidth={2.4} />
                                <span>{favoriteItems.length}</span>
                            </button>
                            <AnimatePresence>
                                {favoritesOpen ? (
                                    <motion.div
                                        className='favorites-dropdown'
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                    >
                                        <FavoritesPanel
                                            favorites={favoriteItems}
                                            ownedChampions={myCardsArr}
                                            cartItems={cartItems}
                                            addToCart={addToCart}
                                            removeFromCart={removeFromCart}
                                            removeFavorite={removeFavorite}
                                            clearFavorites={clearFavorites}
                                            openChampionModal={openChampionModal}
                                        />
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>

                        <div className='cart-dropdown-shell' ref={cartDropdownRef}>
                            <button
                                ref={cartButtonRef}
                                type='button'
                                className={`cart-pill ${cartOpen ? 'is-open' : ''} ${cartCatching ? 'is-catching' : ''}`}
                                onClick={() => {
                                    setCartOpen((open) => !open);
                                    setFavoritesOpen(false);
                                }}
                                aria-label={`${cartItems.length} cards in cart`}
                            aria-expanded={cartOpen}
                            aria-haspopup='dialog'
                        >
                            <ShoppingCart size={17} strokeWidth={2.4} />
                            <span>{cartItems.length}</span>
                        </button>
                        <AnimatePresence>
                            {cartOpen ? (
                                <motion.div
                                    className='cart-dropdown'
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.16, ease: 'easeOut' }}
                                >
                                    <CartPanel
                                        cartItems={cartItems}
                                        cartTotal={cartTotal}
                                        cartMissingBalance={cartMissingBalance}
                                        money={money}
                                        removeFromCart={removeFromCart}
                                        clearCart={clearCart}
                                        checkoutCart={checkoutCart}
                                        collectionTargetRef={collectionTargetRef}
                                        onCollectionFlights={showCollectionFlights}
                                        openChampionModal={openChampionModal}
                                    />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                    <button type='button' className='icon-button mobile-menu-button' onClick={() => setMobileFiltersOpen(true)} aria-label='Menu'>
                        <Menu size={20} strokeWidth={2.2} />
                    </button>
                </div>
            </header>

            <main className={`market-main ${activeView === 'profile' ? 'profile-main' : ''}`}>
                {activeView === 'market' && heroChampion ? (
                    <section
                        className={`hero-section rarity-${rarityFor(heroChampion)}`}
                        onMouseEnter={() => setHeroPaused(true)}
                        onMouseLeave={() => setHeroPaused(false)}
                    >
                        <AnimatePresence mode='sync'>
                            <motion.div
                                key={heroChampion.id}
                                className='hero-image-layer'
                                initial={{ opacity: 0, scale: 1.06 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <img className='hero-bg' src={championSplashImage(heroChampion.id)} alt={heroChampion.name} />
                            </motion.div>
                        </AnimatePresence>
                        <div className='hero-shade' />
                        <button type='button' className='hero-nav hero-nav-left' onClick={showPrevHero} aria-label='Previous featured champion'>
                            <AiOutlineLeft />
                        </button>
                        <button type='button' className='hero-nav hero-nav-right' onClick={showNextHero} aria-label='Next featured champion'>
                            <AiOutlineRight />
                        </button>
                        <div className='hero-content'>
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={heroChampion.id}
                                    variants={heroTextParent}
                                    initial='hidden'
                                    animate='show'
                                    exit='exit'
                                >
                                    <motion.div variants={heroTextItem} className='hero-meta'>
                                        <span className='hero-rarity'><AiOutlineStar />{rarityFor(heroChampion)}</span>
                                        <span>Featured · {heroChampion.tags[0] || heroChampion.partype || 'Runeterra'}</span>
                                    </motion.div>
                                    <motion.h1 variants={heroTextItem}>{heroChampion.name}</motion.h1>
                                    <motion.h2 variants={heroTextItem}>{heroChampion.title}</motion.h2>
                                    <motion.p variants={heroTextItem}>{heroChampion.blurb}</motion.p>
                                    <motion.div variants={heroTextItem} className='hero-stats'>
                                        <HeroStat label='Attack' value={heroChampion.info.attack} tone='attack' />
                                        <HeroStat label='Magic' value={heroChampion.info.magic} tone='magic' />
                                        <HeroStat label='Defense' value={heroChampion.info.defense} tone='defense' />
                                        <HeroStat label='Mobility' value={heroChampion.info.difficulty} tone='difficulty' />
                                    </motion.div>
                                    <motion.div variants={heroTextItem} className='hero-actions'>
                                        <button
                                            type='button'
                                            className='hero-unlock'
                                            disabled={heroChampionOwned || heroChampionInCart}
                                            onClick={() => addToCart(heroChampion)}
                                        >
                                            {heroChampionOwned || heroChampionInCart ? <Check size={16} strokeWidth={2.6} /> : <ShoppingCart size={16} strokeWidth={2.4} />}
                                            {heroChampionOwned ? 'In Collection' : heroChampionInCart ? 'In Cart' : (
                                                <>
                                                    <span>Add to Cart</span>
                                                    <PriceAmount value={getChampionBlueEssence(heroChampion)} />
                                                </>
                                            )}
                                        </button>
                                        <button type='button' className='hero-preview' onMouseEnter={() => preloadChampionDetails(heroChampion.id)} onClick={() => openChampionModal(heroChampion)}>
                                            <Play size={16} strokeWidth={2.4} />
                                            Preview
                                        </button>
                                        <button type='button' className={`hero-like ${favoriteIds.has(heroChampion.id) ? 'is-wished' : ''}`} onClick={(event) => toggleHeroFavorite(event, heroChampion)} aria-label={favoriteIds.has(heroChampion.id) ? `Remove ${heroChampion.name} from favorites` : `Add ${heroChampion.name} to favorites`}>
                                            <Heart size={20} strokeWidth={2.2} />
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className='hero-dots'>
                            {featured.map((champion, index) => (
                                <button
                                    type='button'
                                    key={champion.id}
                                    className={index === activeHeroIndex % featured.length ? 'active' : ''}
                                    onClick={() => setActiveHeroIndex(index)}
                                    aria-label={`Show ${champion.name}`}
                                >
                                    {index === activeHeroIndex % featured.length ? <span style={{ width: `${heroProgress * 100}%` }} /> : null}
                                </button>
                            ))}
                        </div>
                    </section>
                ) : null}

                {activeView === 'profile' ? (
                    <div ref={collectionTargetRef}>
                        <CollectionPanel
                            champions={filtered}
                            ownedChampions={myCardsArr}
                            showcaseIds={showcaseIds}
                            onClearShowcaseSlot={clearShowcaseSlot}
                            onOpenShowcasePicker={setActiveShowcaseSlot}
                            recentlyBoughtId={recentlyBoughtId}
                            settlingChampionId={packReward?.phase === 'flying' ? packReward.champion.id : ''}
                            impactWave={packImpactWave}
                            openChampionModal={openChampionModal}
                            onOpenStore={openStoreView}
                        />
                    </div>
                ) : null}

                {activeView === 'market' ? <TrendingCarousel champions={trending} openChampionModal={openChampionModal} /> : null}

                {activeView === 'market' ? <PackOpeningSection champions={filtered} ownedChampions={myCardsArr} onOpenPack={handlePackOpen} isOpening={packOpening} money={money} /> : null}

                {activeView === 'market' ? (
                    <section className='shop-section' id='marketplace'>
                        <div className='shop-layout'>
                            {filters}
                            <div className='shop-content'>
                                <div className='section-heading shop-heading'>
                                    <div>
                                        <span><Sparkles size={17} strokeWidth={2.2} />Marketplace</span>
                                        <h2>Champion Store</h2>
                                    </div>
                                    <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(true)}>
                                        Filters
                                    </button>
                                </div>
                                <div className='market-grid'>
                                    {displayedIChampions.map((champion) => {
                                        const owned = myCardsArr.some((card) => card.id === champion.id);
                                        const inCart = cartItems.some((card) => card.id === champion.id);

                                        return (
                                            <ChampionCard
                                                key={champion.id}
                                                champion={champion}
                                                owned={owned}
                                                inCart={inCart}
                                                favorite={favoriteIds.has(champion.id)}
                                                justBought={recentlyBoughtId === champion.id}
                                                onAction={owned ? sellClick : inCart ? () => removeFromCart(champion.id) : addToCart}
                                                onOpen={openChampionModal}
                                                onFavoriteToggle={toggleFavorite}
                                                cartTargetRef={cartButtonRef}
                                                favoriteTargetRef={favoritesButtonRef}
                                                onCartFlight={showCartFlight}
                                                onFavoriteFlight={showFavoriteFlight}
                                            />
                                        );
                                    })}
                                </div>
                                {displayedIChampions.length === 0 ? (
                                    <div className='empty-market'>No champions match this search.</div>
                                ) : null}
                            </div>
                        </div>
                        {totalPage > 1 ? <Pagination /> : null}
                    </section>
                ) : null}

            </main>

            {mobileFiltersOpen ? (
                <div className='mobile-filter-drawer' onClick={() => setMobileFiltersOpen(false)}>
                    <div onClick={(event) => event.stopPropagation()}>
                        <button type='button' className='drawer-close' onClick={() => setMobileFiltersOpen(false)}>
                            <AiOutlineClose />
                        </button>
                        {filters}
                    </div>
                </div>
            ) : null}

            {activeShowcaseSlot !== null ? (
                <ShowcasePickerModal
                    slotIndex={activeShowcaseSlot}
                    ownedChampions={myCardsArr}
                    showcaseIds={showcaseIds}
                    onSelect={selectShowcaseCard}
                    onClear={clearActiveShowcaseSlot}
                    onClose={() => setActiveShowcaseSlot(null)}
                />
            ) : null}

            {selectedChampion ? (
                <Modal show onHide={closeChampionModal} size='xl' centered dialogClassName='champion-preview-dialog' contentClassName='champion-preview-content'>
                    <Modal.Body className='modal-body'>
                        <button type='button' className='champion-preview-close' onClick={closeChampionModal} aria-label='Close preview'>
                            <AiOutlineClose />
                        </button>
                        <div className={`champion-preview rarity-${rarityFor(selectedChampion)} ${selectedChampionOwned ? 'is-owned-preview' : ''}`}>
                            <div className='champion-preview-art'>
                                <img loading='lazy' src={championSplashImage(selectedChampion.id, selectedSkinNum)} alt={selectedChampion.name} />
                                <div className='champion-preview-owned-glow' />
                                <div className='champion-preview-art-shade' />
                                <div className='champion-preview-frame' />
                                <div className='champion-preview-title'>
                                    <span>{selectedChampion.tags?.join(' / ') || selectedChampion.partype || 'Champion'}</span>
                                    <h2>{selectedChampion.name}</h2>
                                    <p>{selectedChampion.title}</p>
                                </div>
                            </div>

                            <aside className='champion-preview-panel'>
                                <div className='champion-preview-header'>
                                    <div>
                                        <span className='champion-preview-kicker'>Champion Preview</span>
                                        <h3>{selectedChampion.name}</h3>
                                    </div>
                                    {selectedChampionOwned ? (
                                        <div className='champion-preview-showcase-control'>
                                            <div>
                                                <span>In Collection</span>
                                                <PriceAmount value={selectedChampion.price} />
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type='button'
                                            className='champion-preview-price'
                                            onClick={() => addToCart(selectedChampion)}
                                            disabled={selectedChampionInCart}
                                        >
                                            <span>{selectedChampionInCart ? 'In Cart' : 'Add to Cart'}</span>
                                            <PriceAmount value={selectedChampion.price} />
                                        </button>
                                    )}
                                </div>

                                <div className='champion-preview-tabs' role='tablist' aria-label='Champion preview sections'>
                                    {previewTabs.map((tab) => (
                                        <button
                                            type='button'
                                            key={tab.key}
                                            className={activePreviewTab === tab.key ? 'active' : ''}
                                            onClick={() => setActivePreviewTab(tab.key)}
                                            role='tab'
                                            aria-selected={activePreviewTab === tab.key}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                <div className='champion-preview-tab-panel'>
                                    {activePreviewTab === 'overview' ? (
                                        <>
                                            <div className='champion-preview-meta-grid'>
                                                {(selectedChampion.tags || []).map((tag) => (
                                                    <div className='champion-preview-meta' key={tag}>
                                                        {roleIcons[tag] ? <img src={roleIcons[tag]} alt='' /> : null}
                                                        <span>{tag}</span>
                                                    </div>
                                                ))}
                                                <div className='champion-preview-meta'>
                                                    <ResourceIcon size={18} strokeWidth={2.4} aria-hidden='true' />
                                                    <span>{selectedChampion.partype || 'No Resource'}</span>
                                                </div>
                                                {!selectedChampionOriginImage ? (
                                                    <div className='champion-preview-meta'>
                                                        <MapPin size={18} strokeWidth={2.4} aria-hidden='true' />
                                                        <span>{selectedChampionOrigin}</span>
                                                    </div>
                                                ) : null}
                                            </div>
                                            {selectedChampionOriginImage ? (
                                                <div className='champion-preview-origin-block'>
                                                    <div className='champion-preview-origin-card'>
                                                        <img src={selectedChampionOriginImage} alt={`${selectedChampionOrigin} region`} loading='lazy' />
                                                        <span>
                                                            {selectedChampionOrigin}
                                                        </span>
                                                    </div>
                                                    {sameOriginChampions.length > 0 ? (
                                                        <div className='same-origin-roster' aria-label={`${selectedChampionOrigin} champions`}>
                                                            {sameOriginChampions.map((champion) => (
                                                                <button
                                                                    type='button'
                                                                    key={champion.id}
                                                                    className={champion.id === selectedChampion.id ? 'active' : ''}
                                                                    onClick={() => openChampionModal(champion)}
                                                                    onMouseEnter={() => preloadChampionDetails(champion.id)}
                                                                    aria-label={`Preview ${champion.name}`}
                                                                >
                                                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                                                    <span>{champion.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ) : null}

                                            <div className='champion-preview-stats'>
                                                {previewStats.map((stat) => {
                                                    const value = selectedChampion.info?.[stat.key] || 0;
                                                    const StatIcon = stat.icon;

                                                    return (
                                                    <div className={`preview-stat-row stat-${stat.tone}`} key={stat.label}>
                                                        <div className='preview-stat-heading'>
                                                            <span>
                                                                <StatIcon size={15} strokeWidth={2.3} aria-hidden='true' />
                                                                {stat.label}
                                                            </span>
                                                            <strong><b>{value}</b>/10</strong>
                                                        </div>
                                                        <div className='preview-stat-track'>
                                                            <i className={`tone-${stat.tone}`} style={{ width: `${Math.min(Math.max(value * 10, 0), 100)}%` }} />
                                                        </div>
                                                    </div>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : null}

                                    {activePreviewTab === 'abilities' ? (
                                        <section className='preview-section preview-section-flush'>
                                            <div className='preview-section-title'>Abilities</div>
                                            <div className='preview-abilities'>
                                                {selectedChampionSkills.length > 0 ? selectedChampionSkills.map((skill) => (
                                                    <article className='preview-ability' key={skill.key}>
                                                        <div className='preview-ability-icon'>
                                                            <img src={skill.src} alt={skill.name} />
                                                            <span>{skill.key}</span>
                                                        </div>
                                                        <div>
                                                    <div className='preview-ability-heading'>
                                                        <h4>{skill.name}</h4>
                                                    </div>
                                                            {skill.description ? <p>{skill.description}</p> : null}
                                                        </div>
                                                    </article>
                                                )) : ['P', 'Q', 'W', 'E', 'R'].map((skill) => (
                                                    <div className='preview-ability preview-ability-loading' key={skill}>
                                                        <div className='preview-ability-icon'>
                                                            <span>{skill}</span>
                                                        </div>
                                                        <div>
                                                            <h4>Loading</h4>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null}

                                    {activePreviewTab === 'lore' ? (
                                        <section className='preview-section preview-section-flush'>
                                            <div className='preview-section-title'>Lore</div>
                                            <p className='preview-lore preview-lore-full'>{selectedChampionDetails?.lore || selectedChampion.story}</p>
                                        </section>
                                    ) : null}

                                    {activePreviewTab === 'skins' ? (
                                        <section className='preview-section preview-section-flush'>
                                            <div className='preview-section-head'>
                                                <div className='preview-section-title'>Skins</div>
                                                <span>{selectedChampionDetails?.skins?.length || 1} looks</span>
                                            </div>
                                            <div className='preview-skins preview-skins-grid'>
                                                {(selectedChampionDetails?.skins || [{ num: 0, name: selectedChampion.name }]).map((skin) => (
                                                    <button
                                                        type='button'
                                                        key={skin.id || skin.num}
                                                        className={`preview-skin ${selectedSkinNum === skin.num ? 'active' : ''}`}
                                                        onClick={() => setSelectedSkinNum(skin.num)}
                                                    >
                                                        <img src={championSplashImage(selectedChampion.id, skin.num)} alt={skin.name} loading='lazy' />
                                                        <span>{skin.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    ) : null}
                                </div>
                            </aside>
                        </div>
                    </Modal.Body>
                </Modal>
            ) : null}

            <Alert />
        </div>
    );
}

export default App;
