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
import { BsClock, BsCollection } from 'react-icons/bs';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Droplet, Eye, Flame, Heart, MapPin, Menu, Play, Plus, Search, Shield, ShoppingCart, Skull, SlidersHorizontal, Sparkles, Swords, Wand2, Zap } from 'lucide-react';
import CardContext from './components/component/CardContext';
import { BLUE_ESSENCE_ICON_URL, getChampionBlueEssence } from './components/component/championPrices';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';

const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id, skin = 0) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_${skin}.jpg`;
const LOL_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/lol_icon.png';

const sidebarRoles = ['Assassin', 'Mage', 'Fighter', 'Tank', 'Marksman', 'Support'];
const navLinks = [
    { label: 'Collection', href: '#collection' },
    { label: 'Trends', href: '#trending' },
    { label: 'Store', href: '#marketplace' },
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

function ChampionCard({ champion, owned = false, onAction, onOpen }) {
    const rarity = rarityFor(champion);
    const config = rarityConfig[rarity];
    const isHolo = rarity === 'legendary' || rarity === 'mythic';
    const primaryRole = champion.tags[0] || 'Champion';
    const blueEssence = getChampionBlueEssence(champion);
    const cardRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [wished, setWished] = useState(false);
    const [inCompare, setInCompare] = useState(false);
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
        setWished((current) => !current);
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

    return (
        <motion.article
            ref={cardRef}
            className={`market-card rarity-${rarity}`}
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
                    <button type='button' className={`market-card-icon-action ${wished ? 'is-wished' : ''}`} onClick={toggleWished} aria-label='Wishlist'>
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
                    <motion.button type='button' whileTap={{ scale: 0.94 }} className={owned ? 'sell-action' : 'buy-action'} onClick={() => onAction(champion)} disabled={owned}>
                        {owned ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.4} />}
                        {owned ? 'Owned' : 'Buy'}
                    </motion.button>
                </div>
            </div>
        </motion.article>
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

function CollectionPanel({ champions, ownedChampions }) {
    const total = champions.length;
    const ownedCount = ownedChampions.length;
    const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
    const legendaryCount = ownedChampions.filter((champion) => ['legendary', 'mythic'].includes(rarityFor(champion))).length;
    const stats = [
        { icon: BsCollection, label: 'Owned', value: `${ownedCount}/${total}` },
        { icon: AiOutlineTrophy, label: 'Completion', value: `${pct}%` },
        { icon: AiOutlineStar, label: 'Legendary+', value: String(legendaryCount) },
    ];

    return (
        <section className='collection-panel' id='collection'>
            <div className='collection-panel-top'>
                <div className='collection-panel-heading'>
                    <div className='collection-progress' style={{ '--collection-pct': pct }}>
                        <svg viewBox='0 0 100 100'>
                            <circle cx='50' cy='50' r='42' />
                            <circle cx='50' cy='50' r='42' />
                        </svg>
                        <div>
                            <span>{pct}%</span>
                        </div>
                    </div>
                    <div className='collection-static-copy'>
                        <div className='collection-kicker'>
                            <BsCollection />
                            My Collection
                        </div>
                        <h2>{ownedCount} Champions Owned</h2>
                        <p>{Math.max(total - ownedCount, 0)} more to complete the Roster</p>
                    </div>
                </div>

                <div className='collection-stat-chips'>
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <stat.icon />
                            <p>{stat.value}</p>
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='recently-acquired'>
                <div className='recently-title'>
                    <BsClock />
                    Recently Acquired
                </div>
                {ownedChampions.length > 0 ? (
                    <div className='recently-track'>
                        {ownedChampions.map((champion) => (
                            <article key={champion.id} className={`recent-card rarity-${rarityFor(champion)}`}>
                                <img src={championLoadingImage(champion.id)} alt={champion.name} />
                                <div>
                                    <p>{champion.name}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className='vault-empty'>
                        <div>
                            <BsCollection />
                        </div>
                        <p>Your vault is empty</p>
                        <span>Unlock your first champion to start collecting</span>
                    </div>
                )}
            </div>
        </section>
    );
}

const rarityConfig = {
    common: { label: 'Common', color: 'var(--rarity-common)', border: 'rgba(170,180,200,0.5)', glow: 'rgba(170,180,200,0.35)' },
    rare: { label: 'Rare', color: 'var(--rarity-rare)', border: 'rgba(90,160,255,0.6)', glow: 'rgba(90,160,255,0.35)' },
    epic: { label: 'Epic', color: 'var(--rarity-epic)', border: 'rgba(190,110,255,0.6)', glow: 'rgba(190,110,255,0.36)' },
    legendary: { label: 'Legendary', color: 'var(--rarity-legendary)', border: 'rgba(232,196,110,0.75)', glow: 'rgba(232,196,110,0.36)' },
    mythic: { label: 'Mythic', color: 'var(--rarity-mythic)', border: 'rgba(255,110,120,0.7)', glow: 'rgba(255,110,120,0.36)' },
};

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

function App() {
    const {
        money,
        filtered,
        displayedIChampions,
        myCardsArr,
        buyClick,
        sellClick,
        search,
        clearSearch,
        handleChange,
        roleIcons,
        roleFilters,
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
        totalPage,
    } = useContext(CardContext);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const [heroPaused, setHeroPaused] = useState(false);
    const [heroProgress, setHeroProgress] = useState(0);
    const [activeLink, setActiveLink] = useState('Store');
    const [selectedSkinNum, setSelectedSkinNum] = useState(0);
    const [activePreviewTab, setActivePreviewTab] = useState('overview');
    const navClickLockRef = useRef(null);
    const heroProgressRef = useRef(0);
    const heroLastTickRef = useRef(null);
    const [openFilterSections, setOpenFilterSections] = useState({
        role: true,
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
    const selectedChampionOwned = selectedChampion ? myCardsArr.some((champion) => champion.id === selectedChampion.id) : false;
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

    const handleNavClick = (event, link) => {
        event.preventDefault();
        window.clearTimeout(navClickLockRef.current);
        navClickLockRef.current = window.setTimeout(() => {
            navClickLockRef.current = null;
        }, 700);
        setActiveLink(link.label);

        const section = document.querySelector(link.href);

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

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
            if (navClickLockRef.current) {
                return;
            }

            const viewportAnchor = window.scrollY + window.innerHeight * 0.35;
            const currentLink = [...navLinks].reverse().find((link) => {
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
    }, []);

    useEffect(() => {
        setSelectedSkinNum(0);
        setActivePreviewTab('overview');
    }, [selectedChampion?.id]);

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
            <header className='topbar'>
                <div className='topbar-inner'>
                    <a href='#marketplace' className='brand' aria-label='Nexus home'>
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
                        key={money}
                        className='wallet-pill'
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 0.35 }}
                    >
                        <span className='wallet-coin'>
                            <BlueEssenceIcon />
                        </span>
                        <span>{money.toLocaleString()}</span>
                    </motion.div>
                    <button type='button' className='icon-button mobile-menu-button' onClick={() => setMobileFiltersOpen(true)} aria-label='Menu'>
                        <Menu size={20} strokeWidth={2.2} />
                    </button>
                </div>
            </header>

            <main className='market-main'>
                {heroChampion ? (
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
                                            disabled={heroChampionOwned}
                                            onClick={() => buyClick(heroChampion)}
                                        >
                                            <ShoppingCart size={16} strokeWidth={2.4} />
                                            {heroChampionOwned ? 'In Collection' : (
                                                <>
                                                    <span>Unlock</span>
                                                    <PriceAmount value={getChampionBlueEssence(heroChampion)} />
                                                </>
                                            )}
                                        </button>
                                        <button type='button' className='hero-preview' onMouseEnter={() => preloadChampionDetails(heroChampion.id)} onClick={() => openChampionModal(heroChampion)}>
                                            <Play size={16} strokeWidth={2.4} />
                                            Preview
                                        </button>
                                        <button type='button' className='hero-like' onClick={() => openChampionModal(heroChampion)} aria-label={`Preview ${heroChampion.name}`}>
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

                <CollectionPanel champions={filtered} ownedChampions={myCardsArr} />

                <TrendingCarousel champions={trending} openChampionModal={openChampionModal} />

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

                                    return (
                                        <ChampionCard
                                            key={champion.id}
                                            champion={champion}
                                            owned={owned}
                                            onAction={owned ? sellClick : buyClick}
                                            onOpen={openChampionModal}
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

            {selectedChampion ? (
                <Modal show onHide={closeChampionModal} size='xl' centered dialogClassName='champion-preview-dialog' contentClassName='champion-preview-content'>
                    <Modal.Body className='modal-body'>
                        <button type='button' className='champion-preview-close' onClick={closeChampionModal} aria-label='Close preview'>
                            <AiOutlineClose />
                        </button>
                        <div className={`champion-preview rarity-${rarityFor(selectedChampion)}`}>
                            <div className='champion-preview-art'>
                                <img loading='lazy' src={championSplashImage(selectedChampion.id, selectedSkinNum)} alt={selectedChampion.name} />
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
                                    <button
                                        type='button'
                                        className={`champion-preview-price ${selectedChampionOwned ? 'is-owned' : ''}`}
                                        onClick={() => buyClick(selectedChampion)}
                                        disabled={selectedChampionOwned}
                                    >
                                        <span>{selectedChampionOwned ? 'In Collection' : 'Unlock Cost'}</span>
                                        <PriceAmount value={selectedChampion.price} />
                                    </button>
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
