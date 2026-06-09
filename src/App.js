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
import { Check, ChevronDown, ChevronLeft, ChevronRight, Coins, Eye, Flame, Heart, Menu, Play, Plus, Search, ShoppingCart, SlidersHorizontal, Sparkles } from 'lucide-react';
import CardContext from './components/component/CardContext';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';

const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`;
const LOL_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/lol_icon.png';

const sidebarRoles = ['Assassin', 'Mage', 'Fighter', 'Tank', 'Marksman', 'Support'];
const navLinks = [
    { label: 'Store', href: '#marketplace' },
    { label: 'Collection', href: '#collection' },
    { label: 'Trends', href: '#trending' },
];

function GoldCoin({ className = '' }) {
    return (
        <span className={`gold-coin ${className}`}>
            <Coins size={16} strokeWidth={2.4} />
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
    const price = champion.info.difficulty;

    if (price >= 9) {
        return 'mythic';
    }

    if (price >= 7) {
        return 'legendary';
    }

    if (price >= 5) {
        return 'epic';
    }

    if (price >= 3) {
        return 'rare';
    }

    return 'common';
}

function ChampionCard({ champion, owned = false, onAction, onOpen }) {
    const rarity = rarityFor(champion);
    const config = rarityConfig[rarity];
    const isHolo = rarity === 'legendary' || rarity === 'mythic';
    const primaryRole = champion.tags[0] || 'Champion';
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
                        style={{ color: config.color, borderColor: config.border, backgroundColor: `color-mix(in oklch, ${config.color} 14%, transparent)` }}
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
                        <span aria-hidden='true'><i /></span>
                        <strong>{champion.info.difficulty.toLocaleString()}</strong>
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
    const trending = useMemo(() => (
        [...champions].sort((a, b) => scoreChampion(b) - scoreChampion(a)).slice(0, 12)
    ), [champions]);

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
                <button type='button' className='trending-arrow trending-arrow-left' onClick={() => scrollByCards(-1)} aria-label='Scroll left'>
                    <ChevronLeft size={20} />
                </button>
                <button type='button' className='trending-arrow trending-arrow-right' onClick={() => scrollByCards(1)} aria-label='Scroll right'>
                    <ChevronRight size={20} />
                </button>
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
                                        <strong>{champion.info.difficulty.toLocaleString()}</strong>
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
        selectedChampionSkills,
        totalPage,
    } = useContext(CardContext);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);
    const [activeLink, setActiveLink] = useState('Store');
    const [openFilterSections, setOpenFilterSections] = useState({
        role: true,
        price: true,
        rarity: true,
        collection: true,
        sort: true,
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
        [...filtered].sort((a, b) => b.info.difficulty - a.info.difficulty || b.info.magic - a.info.magic).slice(0, 8)
    ), [filtered]);

    const selectedRoleNames = Array.from(new Set(filtered.flatMap((champion) => champion.tags)));
    const heroChampion = featured.length > 0 ? featured[activeHeroIndex % featured.length] : null;
    const heroChampionOwned = heroChampion ? myCardsArr.some((champion) => champion.id === heroChampion.id) : false;
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

        const interval = window.setInterval(() => {
            setActiveHeroIndex((index) => (index + 1) % featured.length);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [featured.length]);

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
                                <span>1</span>
                                <strong>{maxPrice.toLocaleString()}</strong>
                            </div>
                            <input
                                type='range'
                                min='1'
                                max='10'
                                step='1'
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
                                onClick={() => setActiveLink(link.label)}
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
                            <GoldCoin />
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
                    <section className={`hero-section rarity-${rarityFor(heroChampion)}`}>
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
                                            {heroChampionOwned ? 'In Collection' : `Unlock · ${heroChampion.info.difficulty.toLocaleString()}`}
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
                                    {index === activeHeroIndex % featured.length ? <motion.span key={champion.id} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} /> : null}
                                </button>
                            ))}
                        </div>
                    </section>
                ) : null}

                <CollectionPanel champions={filtered} ownedChampions={myCardsArr} />

                <TrendingCarousel champions={trending} openChampionModal={openChampionModal} />

                <section className='shop-layout' id='marketplace'>
                    {filters}
                    <div className='shop-content'>
                        <div className='section-heading shop-heading'>
                            <div>
                                <span>Marketplace</span>
                                <h2>Champion Vault</h2>
                            </div>
                            <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(true)}>
                                Filters
                            </button>
                        </div>
                        <div className='role-summary'>
                            {selectedRoleNames.slice(0, 6).map((role) => (
                                <span key={role}>{role}</span>
                            ))}
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
                        {totalPage > 1 ? <Pagination /> : null}
                    </div>
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
                <Modal show onHide={closeChampionModal} size='xl' centered>
                    <div className='modal-title'>{selectedChampion.id}</div>
                    <Modal.Body className='modal-body'>
                        <img loading='lazy' src={championSplashImage(selectedChampion.id)} width='100%' height='100%' alt={selectedChampion.id} />
                        <div className='champion-skills'>
                            {selectedChampionSkills.length > 0 ? selectedChampionSkills.map((skill) => (
                                <div className='skill-press' key={skill.key}>
                                    <img src={skill.src} alt={skill.name} />
                                    <div className='skill-button'>{skill.key}</div>
                                </div>
                            )) : ['P', 'Q', 'W', 'E', 'R'].map((skill) => (
                                <div className='skill-press skill-loading' key={skill}>
                                    <div className='skill-button'>{skill}</div>
                                </div>
                            ))}
                        </div>
                        <div className='modal-price'>${selectedChampion.price}</div>
                        <div className='short-story'>{selectedChampion.story}</div>
                    </Modal.Body>
                </Modal>
            ) : null}

            <Alert />
        </div>
    );
}

export default App;
