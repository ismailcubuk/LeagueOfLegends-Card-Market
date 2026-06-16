import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Droplet, Shield, Skull, Sparkles, Swords, Wand2, Zap } from 'lucide-react';
import CardContext from './components/component/CardContext';
import { getChampionBlueEssence } from './components/component/championPrices';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';
import FlightEffects from './components/effects/FlightEffects';
import HomeMyCardsSection from './components/collection/HomeMyCardsSection';
import FilterPanel from './components/filters/FilterPanel';
import HeroSection from './components/hero/HeroSection';
import Topbar from './components/layout/Topbar';
import ChampionCard from './components/market/ChampionCard';
import TrendingCarousel from './components/market/TrendingCarousel';
import PackOpeningSection from './components/pack/PackOpeningSection';
import PackOverlays from './components/pack/PackOverlays';
import ChampionPreviewModal from './components/preview/ChampionPreviewModal';
import CollectionPanel from './components/profile/CollectionPanel';
import ShowcasePickerModal from './components/profile/ShowcasePickerModal';
import { HERO_AUTOPLAY_MS, marketNavLinks, navLinks, previewTabs, profileNavLink, sidebarRoles } from './config/navigation';
import { championOrigins, originImageUrls } from './data/championOrigins';
import useBodyScrollLock from './hooks/useBodyScrollLock';
import { rarityConfig, rarityFor, scoreChampion } from './utils/championMeta';
import { buildPackRouletteItems, PACK_MODAL_PREVIEW_COUNT, PACK_OPEN_COST, pickPackChampion } from './utils/packOpening';

const previewStats = [
    { label: 'Attack', key: 'attack', tone: 'attack', icon: Skull },
    { label: 'Magic', key: 'magic', tone: 'magic', icon: Wand2 },
    { label: 'Defense', key: 'defense', tone: 'defense', icon: Shield },
    { label: 'Difficulty', key: 'difficulty', tone: 'difficulty', icon: Sparkles },
];

const resourceIcons = {
    courage: Shield,
    energy: Zap,
    fury: Swords,
};

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
    const [recentAcquiredCards, setRecentAcquiredCards] = useState(() => {
        try {
            const storedCards = JSON.parse(localStorage.getItem('recentAcquiredCards') || '[]');
            return Array.isArray(storedCards) ? storedCards.slice(0, 10) : [];
        } catch (error) {
            return [];
        }
    });
    const [selectedProfileIconId, setSelectedProfileIconId] = useState(() => {
        const savedIconId = window.localStorage.getItem('league-market-profile-icon-id');

        return savedIconId || '29';
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
    const [packConfirmOpen, setPackConfirmOpen] = useState(false);
    const [packReward, setPackReward] = useState(null);
    const [packOpening, setPackOpening] = useState(false);
    const isPackRewardOpen = packConfirmOpen || Boolean(packReward);
    const [walletCatching, setWalletCatching] = useState(false);
    const [displayMoney, setDisplayMoney] = useState(money);
    const [selectedSkinNum, setSelectedSkinNum] = useState(0);
    const [activePreviewTab, setActivePreviewTab] = useState('overview');
    const [activeShowcaseSlot, setActiveShowcaseSlot] = useState(null);
    const [pendingRecentCardIds, setPendingRecentCardIds] = useState([]);
    const [recentCardsImpactRarity, setRecentCardsImpactRarity] = useState('');
    const navClickLockRef = useRef(null);
    const cartDropdownRef = useRef(null);
    const favoritesDropdownRef = useRef(null);
    const favoritesButtonRef = useRef(null);
    const cartButtonRef = useRef(null);
    const previousOwnedIdsRef = useRef(new Set(myCardsArr.map((champion) => champion.id)));

    useEffect(() => {
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
    }, [favoriteItems]);

    useBodyScrollLock(isPackRewardOpen);

    useEffect(() => {
        localStorage.setItem('recentAcquiredCards', JSON.stringify(recentAcquiredCards.slice(0, 10)));
    }, [recentAcquiredCards]);

    useEffect(() => {
        const previousOwnedIds = previousOwnedIdsRef.current;
        const newlyOwnedCards = myCardsArr.filter((champion) => !previousOwnedIds.has(champion.id));

        if (newlyOwnedCards.length > 0) {
            const flightDelay = 1150 + Math.max(newlyOwnedCards.length - 1, 0) * 70;
            const newlyOwnedIds = newlyOwnedCards.map((champion) => champion.id);

            setPendingRecentCardIds((ids) => Array.from(new Set([...ids, ...newlyOwnedIds])));

            window.setTimeout(() => {
                setRecentAcquiredCards((cards) => {
                    const nextCards = [...newlyOwnedCards.reverse(), ...cards];
                    const seenIds = new Set();

                    return nextCards.filter((champion) => {
                        if (seenIds.has(champion.id)) {
                            return false;
                        }

                        seenIds.add(champion.id);
                        return true;
                    }).slice(0, 10);
                });
                setPendingRecentCardIds((ids) => ids.filter((id) => !newlyOwnedIds.includes(id)));

                const highestImpactRarity = newlyOwnedCards
                    .map((champion) => rarityFor(champion))
                    .find((rarity) => ['mythic', 'legendary', 'epic'].includes(rarity));

                if (highestImpactRarity) {
                    setRecentCardsImpactRarity(highestImpactRarity);
                    window.setTimeout(() => setRecentCardsImpactRarity(''), 1200);
                }
            }, flightDelay);
        }

        previousOwnedIdsRef.current = new Set(myCardsArr.map((champion) => champion.id));
    }, [myCardsArr]);

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
    const recentCardsTargetRef = useRef(null);
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

    const packModalPreviewChampions = useMemo(() => (
        [...filtered].sort(() => Math.random() - 0.5).slice(0, PACK_MODAL_PREVIEW_COUNT)
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

    const handlePackRequest = () => {
        if (packOpening || packConfirmOpen || packReward || filtered.length === 0) {
            return;
        }

        if (money < PACK_OPEN_COST) {
            setAlertt(true);
            return;
        }

        setPackConfirmOpen(true);
    };

    const closePackConfirm = () => {
        if (!packOpening) {
            setPackConfirmOpen(false);
        }
    };

    const handlePackOpen = (event) => {
        if (packOpening || filtered.length === 0) {
            return;
        }

        if (money < PACK_OPEN_COST) {
            setAlertt(true);
            return;
        }

        setPackConfirmOpen(false);

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
                    const collectionRoot = recentCardsTargetRef.current;
                    const targetCard = collectionRoot?.querySelector(`.home-my-card-preview[aria-label="Preview ${champion.name}"]`);
                    const firstOwnedCard = collectionRoot?.querySelector('.home-my-card');
                    const ownedGrid = collectionRoot?.querySelector('.home-my-cards-grid');
                    const emptyVault = collectionRoot?.querySelector('.home-my-cards-empty');
                    const fallbackTarget = collectionRoot;
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
        <FilterPanel
            openFilterSections={openFilterSections}
            toggleFilterSection={toggleFilterSection}
            sidebarRoles={sidebarRoles}
            roleFilters={roleFilters}
            roleIcons={roleIcons}
            roleActions={roleActions}
            regionFilters={regionFilters}
            clearRegionFilters={clearRegionFilters}
            regionOptions={regionOptions}
            handleRegionClick={handleRegionClick}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            rarityFilters={rarityFilters}
            handleRarityClick={handleRarityClick}
            collectionFilter={collectionFilter}
            handleCollectionFilterClick={handleCollectionFilterClick}
            sortOptions={sortOptions}
            sortFilter={sortFilter}
            handleSortClick={handleSortClick}
        />
    );

    const ownedChampionIds = new Set(myCardsArr.map((champion) => champion.id));
    const pendingRecentIds = new Set(pendingRecentCardIds);
    const visibleRecentCards = recentAcquiredCards.filter((champion) => ownedChampionIds.has(champion.id) && !pendingRecentIds.has(champion.id)).slice(0, 10);
    const homeRecentCards = visibleRecentCards.length > 0
        ? visibleRecentCards
        : myCardsArr.filter((champion) => !pendingRecentIds.has(champion.id)).slice(0, 10);

    return (
        <div className='market-shell'>
            <FlightEffects
                cartFlight={cartFlight}
                favoriteFlight={favoriteFlight}
                collectionFlights={collectionFlights}
                dailyEssenceFlights={dailyEssenceFlights}
                packEssenceFlights={packEssenceFlights}
                packImpactWave={packImpactWave}
            />
            <PackOverlays
                packConfirmOpen={packConfirmOpen}
                packReward={packReward}
                packModalPreviewChampions={packModalPreviewChampions}
                closePackConfirm={closePackConfirm}
                handlePackOpen={handlePackOpen}
            />
            <Topbar
                activeLink={activeLink}
                marketNavLinks={marketNavLinks}
                profileNavLink={profileNavLink}
                handleNavClick={handleNavClick}
                openStoreView={openStoreView}
                search={search}
                handleChange={handleChange}
                clearSearch={clearSearch}
                walletRef={walletRef}
                walletCatching={walletCatching}
                displayMoney={displayMoney}
                dailyRewardButtonRef={dailyRewardButtonRef}
                dailyRewardAvailable={dailyRewardAvailable}
                dailyRewardAmount={dailyRewardAmount}
                handleDailyRewardClaim={handleDailyRewardClaim}
                favoritesDropdownRef={favoritesDropdownRef}
                favoritesButtonRef={favoritesButtonRef}
                favoritesOpen={favoritesOpen}
                setFavoritesOpen={setFavoritesOpen}
                favoritesCatching={favoritesCatching}
                favoriteItems={favoriteItems}
                myCardsArr={myCardsArr}
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                removeFavorite={removeFavorite}
                clearFavorites={clearFavorites}
                openChampionModal={openChampionModal}
                cartDropdownRef={cartDropdownRef}
                cartButtonRef={cartButtonRef}
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                cartCatching={cartCatching}
                cartTotal={cartTotal}
                cartMissingBalance={cartMissingBalance}
                money={money}
                clearCart={clearCart}
                checkoutCart={checkoutCart}
                recentCardsTargetRef={recentCardsTargetRef}
                showCollectionFlights={showCollectionFlights}
                selectedProfileIconId={selectedProfileIconId}
                setMobileFiltersOpen={setMobileFiltersOpen}
            />

            <main className={`market-main ${activeView === 'profile' ? 'profile-main' : ''}`}>
                {activeView === 'market' ? (
                    <HeroSection
                        heroChampion={heroChampion}
                        heroChampionOwned={heroChampionOwned}
                        heroChampionInCart={heroChampionInCart}
                        featured={featured}
                        activeHeroIndex={activeHeroIndex}
                        setActiveHeroIndex={setActiveHeroIndex}
                        heroProgress={heroProgress}
                        setHeroPaused={setHeroPaused}
                        showPrevHero={showPrevHero}
                        showNextHero={showNextHero}
                        heroTextParent={heroTextParent}
                        heroTextItem={heroTextItem}
                        addToCart={addToCart}
                        preloadChampionDetails={preloadChampionDetails}
                        openChampionModal={openChampionModal}
                        favoriteIds={favoriteIds}
                        toggleHeroFavorite={toggleHeroFavorite}
                    />
                ) : null}

                {activeView === 'profile' ? (
                    <div ref={collectionTargetRef}>
                        <CollectionPanel
                            champions={filtered}
                            ownedChampions={myCardsArr}
                            showcaseIds={showcaseIds}
                            selectedProfileIconId={selectedProfileIconId}
                            setSelectedProfileIconId={setSelectedProfileIconId}
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

                {activeView === 'market' ? <PackOpeningSection champions={filtered} ownedChampions={myCardsArr} onOpenPack={handlePackRequest} isOpening={packOpening} money={money} /> : null}

                {activeView === 'market' ? (
                    <HomeMyCardsSection
                        ownedChampions={homeRecentCards}
                        openChampionModal={openChampionModal}
                        targetRef={recentCardsTargetRef}
                        impactRarity={recentCardsImpactRarity}
                    />
                ) : null}

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
                    champions={filtered}
                    ownedChampions={myCardsArr}
                    showcaseIds={showcaseIds}
                    onSelect={selectShowcaseCard}
                    onClear={clearActiveShowcaseSlot}
                    onClose={() => setActiveShowcaseSlot(null)}
                />
            ) : null}

            <ChampionPreviewModal
                selectedChampion={selectedChampion}
                selectedChampionOwned={selectedChampionOwned}
                selectedChampionInCart={selectedChampionInCart}
                selectedChampionDetails={selectedChampionDetails}
                selectedChampionSkills={selectedChampionSkills}
                selectedSkinNum={selectedSkinNum}
                setSelectedSkinNum={setSelectedSkinNum}
                activePreviewTab={activePreviewTab}
                setActivePreviewTab={setActivePreviewTab}
                previewTabs={previewTabs}
                previewStats={previewStats}
                closeChampionModal={closeChampionModal}
                addToCart={addToCart}
                roleIcons={roleIcons}
                ResourceIcon={ResourceIcon}
                selectedChampionOrigin={selectedChampionOrigin}
                selectedChampionOriginImage={selectedChampionOriginImage}
                sameOriginChampions={sameOriginChampions}
                openChampionModal={openChampionModal}
                preloadChampionDetails={preloadChampionDetails}
            />

            <Alert />
        </div>
    );
}

export default App;
