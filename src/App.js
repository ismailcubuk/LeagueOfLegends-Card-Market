import 'bootstrap/dist/css/bootstrap.min.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
    AiOutlineClose,
    AiOutlineLeft,
    AiOutlineRight,
    AiOutlineStar,
} from 'react-icons/ai';
import { Check, Droplet, Gift, Heart, MapPin, Menu, Play, Search, Shield, ShoppingCart, Skull, SlidersHorizontal, Sparkles, Swords, Wand2, Zap } from 'lucide-react';
import CardContext from './components/component/CardContext';
import { getChampionBlueEssence } from './components/component/championPrices';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';
import BlueEssenceIcon from './components/common/BlueEssenceIcon';
import PriceAmount from './components/common/PriceAmount';
import RarityPill from './components/common/RarityPill';
import CartPanel from './components/cart/CartPanel';
import HomeMyCardsSection from './components/collection/HomeMyCardsSection';
import FavoritesPanel from './components/favorites/FavoritesPanel';
import FilterSection from './components/filters/FilterSection';
import HeroStat from './components/hero/HeroStat';
import ChampionCard from './components/market/ChampionCard';
import TrendingCarousel from './components/market/TrendingCarousel';
import PackOpeningSection from './components/pack/PackOpeningSection';
import CollectionPanel from './components/profile/CollectionPanel';
import ShowcasePickerModal from './components/profile/ShowcasePickerModal';
import { HERO_AUTOPLAY_MS, marketNavLinks, navLinks, previewTabs, profileNavLink, sidebarRoles } from './config/navigation';
import { profileIconImage } from './config/profileIcons';
import { championOrigins, originImageUrls } from './data/championOrigins';
import { championLoadingImage, championSplashImage, HEXTECH_CHEST_ICON_URL, LOL_ICON_URL } from './utils/championMedia';
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

    useEffect(() => {
        if (!isPackRewardOpen) {
            return undefined;
        }

        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
        };
    }, [isPackRewardOpen]);

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

    const ownedChampionIds = new Set(myCardsArr.map((champion) => champion.id));
    const pendingRecentIds = new Set(pendingRecentCardIds);
    const visibleRecentCards = recentAcquiredCards.filter((champion) => ownedChampionIds.has(champion.id) && !pendingRecentIds.has(champion.id)).slice(0, 10);
    const homeRecentCards = visibleRecentCards.length > 0
        ? visibleRecentCards
        : myCardsArr.filter((champion) => !pendingRecentIds.has(champion.id)).slice(0, 10);

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
            {packConfirmOpen && !packReward ? (
                <div className='pack-reward-overlay pack-confirm-overlay' aria-live='polite'>
                    <span className='pack-reward-backdrop' onClick={closePackConfirm} />
                    <div className='pack-confirm-stage' role='dialog' aria-modal='true' aria-labelledby='pack-confirm-title'>
                        <span className='pack-confirm-frame' aria-hidden='true' />
                        <span className='pack-confirm-preview' aria-hidden='true'>
                            {packModalPreviewChampions.map((champion) => {
                                const rarity = rarityFor(champion);

                                return (
                                    <span
                                        className={`pack-confirm-preview-card rarity-${rarity}`}
                                        key={champion.id}
                                        style={{
                                            '--preview-color': rarityConfig[rarity].color,
                                            '--preview-glow': rarityConfig[rarity].glow,
                                        }}
                                    >
                                        <img src={championLoadingImage(champion.id)} alt='' loading='lazy' draggable='false' />
                                    </span>
                                );
                            })}
                        </span>
                        <button type='button' className='pack-confirm-close' onClick={closePackConfirm} aria-label='Close mystery pack'>
                            <AiOutlineClose />
                        </button>
                        <div className='pack-confirm-header'>
                            <span className='pack-confirm-kicker' id='pack-confirm-title'>Mystery Pack</span>
                            <span className='pack-confirm-chest'>
                                <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                            </span>
                        </div>
                        <button type='button' className='pack-confirm-spin' onClick={handlePackOpen}>
                            <span className='pack-confirm-spin-aura' aria-hidden='true' />
                            <span className='pack-action-label'>Open</span>
                            <span className='pack-action-price'>
                                <span className='wallet-coin'>
                                    <BlueEssenceIcon />
                                </span>
                                <span>{PACK_OPEN_COST.toLocaleString('tr-TR')}</span>
                            </span>
                        </button>
                    </div>
                </div>
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
                        {marketNavLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className={activeLink === link.label ? 'active' : ''}
                                onClick={(event) => handleNavClick(event, link)}
                            >
                                {link.label}
                                {activeLink === link.label ? (
                                    <span className='topbar-link-underline' aria-hidden='true' />
                                ) : null}
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
                                        collectionTargetRef={recentCardsTargetRef}
                                        onCollectionFlights={showCollectionFlights}
                                        openChampionModal={openChampionModal}
                                    />
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                    {profileNavLink ? (
                        <a
                            href={profileNavLink.href}
                            className={`topbar-profile-link ${activeLink === profileNavLink.label ? 'active' : ''}`}
                            onClick={(event) => handleNavClick(event, profileNavLink)}
                            aria-label='Open profile'
                        >
                            <span className='topbar-profile-icon'>
                                <img src={profileIconImage(selectedProfileIconId)} alt='' />
                            </span>
                            <span className='topbar-profile-label'>Profile</span>
                            {activeLink === profileNavLink.label ? (
                                <span className='topbar-link-underline' aria-hidden='true' />
                            ) : null}
                        </a>
                    ) : null}
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
                                                    <div className={`preview-stat-row stat-${stat.tone} ${value >= 10 ? 'is-complete' : ''}`} key={stat.label}>
                                                        <div className='preview-stat-heading'>
                                                            <span>
                                                                <StatIcon size={15} strokeWidth={2.3} aria-hidden='true' />
                                                                {stat.label}
                                                            </span>
                                                            <strong>
                                                                <b>{value}</b>
                                                                <span>/10</span>
                                                            </strong>
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
