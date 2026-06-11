import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import LolData from "./Lol.json";
import { getChampionBlueEssence, withBlueEssence } from "./championPrices";

const CardContext = createContext();

const DDRAGON_VERSION = "13.1.1";
const CHAMPIONS_PER_PAGE = 16;
const DAILY_REWARD_AMOUNT = 450;
const EXCLUDED_CHAMPIONS = new Set(["akshan", "rell", "vex", "seraphine"]);
const passiveImage = (fileName) => `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/passive/${fileName}`;
const spellImage = (fileName) => `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${fileName}`;
const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const rolePages = {
    Fighter: 1,
    Tank: 2,
    Mage: 3,
    Assassin: 4,
    Marksman: 5,
    Support: 6,
};

const roleIcons = {
    Fighter: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png",
    Tank: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png",
    Mage: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png",
    Assassin: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png",
    Marksman: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png",
    Support: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png",
};

const regionOptions = [
    { id: "Bandle City", label: "Bandle City", image: `${process.env.PUBLIC_URL}/regions/icons/bandle_city.png` },
    { id: "Bilgewater", label: "Bilgewater", image: `${process.env.PUBLIC_URL}/regions/icons/bilgewater.png` },
    { id: "Demacia", label: "Demacia", image: `${process.env.PUBLIC_URL}/regions/icons/demacia.png` },
    { id: "Freljord", label: "Freljord", image: `${process.env.PUBLIC_URL}/regions/icons/freljord.png` },
    { id: "Icathia", label: "Icathia", image: `${process.env.PUBLIC_URL}/regions/icons/void.png` },
    { id: "Ionia", label: "Ionia", image: `${process.env.PUBLIC_URL}/regions/icons/ionia.png` },
    { id: "Ixtal", label: "Ixtal", image: `${process.env.PUBLIC_URL}/regions/icons/ixtal.png` },
    { id: "Noxus", label: "Noxus", image: `${process.env.PUBLIC_URL}/regions/icons/noxus.png` },
    { id: "Piltover", label: "Piltover", image: `${process.env.PUBLIC_URL}/regions/icons/piltover.png` },
    { id: "Shadow Isles", label: "Shadow Isles", image: `${process.env.PUBLIC_URL}/regions/icons/shadow_isles.png` },
    { id: "Shurima", label: "Shurima", image: `${process.env.PUBLIC_URL}/regions/icons/shurima.png` },
    { id: "Targon", label: "Targon", image: `${process.env.PUBLIC_URL}/regions/icons/targon.png` },
    { id: "The Void", label: "The Void", image: `${process.env.PUBLIC_URL}/regions/icons/void.png` },
    { id: "Zaun", label: "Zaun", image: `${process.env.PUBLIC_URL}/regions/icons/zaun.png` },
];

const championRegions = {
    Aatrox: ["Shurima"],
    Ahri: ["Ionia"],
    Akali: ["Ionia"],
    Alistar: ["Noxus"],
    Amumu: ["Shurima"],
    Anivia: ["Freljord"],
    Annie: ["Noxus"],
    Aphelios: ["Targon"],
    Ashe: ["Freljord"],
    AurelionSol: ["Targon"],
    Azir: ["Shurima"],
    Bard: ["Targon"],
    Belveth: ["The Void"],
    Blitzcrank: ["Zaun"],
    Brand: ["Freljord"],
    Braum: ["Freljord"],
    Caitlyn: ["Piltover"],
    Camille: ["Piltover"],
    Cassiopeia: ["Noxus", "Shurima"],
    Chogath: ["The Void"],
    Corki: ["Bandle City", "Piltover"],
    Darius: ["Noxus"],
    Diana: ["Targon"],
    Draven: ["Noxus"],
    DrMundo: ["Zaun"],
    Ekko: ["Zaun"],
    Elise: ["Noxus", "Shadow Isles"],
    Evelynn: ["Runeterra"],
    Ezreal: ["Piltover"],
    Fiddlesticks: ["Runeterra"],
    Fiora: ["Demacia"],
    Fizz: ["Bilgewater"],
    Galio: ["Demacia"],
    Gangplank: ["Bilgewater"],
    Garen: ["Demacia"],
    Gnar: ["Freljord", "Bandle City"],
    Gragas: ["Freljord"],
    Graves: ["Bilgewater"],
    Gwen: ["Shadow Isles"],
    Hecarim: ["Shadow Isles"],
    Heimerdinger: ["Bandle City", "Piltover"],
    Illaoi: ["Bilgewater"],
    Irelia: ["Ionia"],
    Ivern: ["Ionia"],
    Janna: ["Zaun"],
    JarvanIV: ["Demacia"],
    Jax: ["Icathia"],
    Jayce: ["Piltover"],
    Jhin: ["Ionia"],
    Jinx: ["Zaun"],
    Kaisa: ["Shurima", "The Void"],
    Kalista: ["Shadow Isles"],
    Karma: ["Ionia"],
    Karthus: ["Shadow Isles"],
    Kassadin: ["Shurima", "The Void"],
    Katarina: ["Noxus"],
    Kayle: ["Demacia", "Targon"],
    Kayn: ["Ionia", "Noxus"],
    Kennen: ["Bandle City", "Ionia"],
    Khazix: ["The Void"],
    Kindred: ["Runeterra"],
    Kled: ["Noxus"],
    KogMaw: ["The Void"],
    KSante: ["Shurima"],
    Leblanc: ["Noxus"],
    LeeSin: ["Ionia"],
    Leona: ["Targon"],
    Lillia: ["Ionia"],
    Lissandra: ["Freljord"],
    Lucian: ["Demacia", "Shadow Isles"],
    Lulu: ["Bandle City"],
    Lux: ["Demacia"],
    Malphite: ["Ixtal"],
    Malzahar: ["Shurima", "The Void"],
    Maokai: ["Shadow Isles"],
    MasterYi: ["Ionia"],
    MissFortune: ["Bilgewater"],
    MonkeyKing: ["Ionia"],
    Mordekaiser: ["Noxus"],
    Morgana: ["Demacia", "Targon"],
    Nami: ["Targon"],
    Nasus: ["Shurima"],
    Nautilus: ["Bilgewater"],
    Neeko: ["Ixtal"],
    Nidalee: ["Ixtal"],
    Nilah: ["Bilgewater"],
    Nocturne: ["Runeterra"],
    Nunu: ["Freljord"],
    Olaf: ["Freljord"],
    Orianna: ["Piltover", "Zaun"],
    Ornn: ["Freljord"],
    Pantheon: ["Targon"],
    Poppy: ["Demacia"],
    Pyke: ["Bilgewater"],
    Qiyana: ["Ixtal"],
    Quinn: ["Demacia"],
    Rakan: ["Ionia"],
    Rammus: ["Shurima"],
    RekSai: ["The Void", "Shurima"],
    Rell: ["Noxus"],
    Renata: ["Zaun"],
    Renekton: ["Shurima"],
    Rengar: ["Ixtal"],
    Riven: ["Noxus", "Ionia"],
    Rumble: ["Bandle City"],
    Ryze: ["Runeterra"],
    Samira: ["Noxus", "Shurima"],
    Sejuani: ["Freljord"],
    Senna: ["Demacia", "Shadow Isles"],
    Seraphine: ["Piltover", "Zaun"],
    Sett: ["Ionia"],
    Shaco: ["Runeterra"],
    Shen: ["Ionia"],
    Shyvana: ["Demacia"],
    Singed: ["Zaun"],
    Sion: ["Noxus"],
    Sivir: ["Shurima"],
    Skarner: ["Shurima"],
    Sona: ["Demacia", "Ionia"],
    Soraka: ["Targon"],
    Swain: ["Noxus"],
    Sylas: ["Demacia", "Freljord"],
    Syndra: ["Ionia"],
    TahmKench: ["Bilgewater"],
    Taliyah: ["Shurima"],
    Talon: ["Noxus"],
    Taric: ["Targon", "Demacia"],
    Teemo: ["Bandle City"],
    Thresh: ["Shadow Isles"],
    Tristana: ["Bandle City"],
    Trundle: ["Freljord"],
    Tryndamere: ["Freljord"],
    TwistedFate: ["Bilgewater"],
    Twitch: ["Zaun"],
    Udyr: ["Freljord", "Ionia"],
    Urgot: ["Zaun", "Noxus"],
    Varus: ["Ionia", "Shurima"],
    Vayne: ["Demacia"],
    Veigar: ["Bandle City"],
    Velkoz: ["The Void"],
    Vex: ["Bandle City", "Shadow Isles"],
    Vi: ["Piltover", "Zaun"],
    Viego: ["Shadow Isles"],
    Viktor: ["Zaun"],
    Vladimir: ["Noxus"],
    Volibear: ["Freljord"],
    Warwick: ["Zaun"],
    Xayah: ["Ionia"],
    Xerath: ["Shurima"],
    XinZhao: ["Demacia"],
    Yasuo: ["Ionia"],
    Yone: ["Ionia"],
    Yorick: ["Shadow Isles"],
    Yuumi: ["Bandle City"],
    Zac: ["Zaun"],
    Zed: ["Ionia"],
    Zeri: ["Zaun"],
    Ziggs: ["Bandle City", "Zaun"],
    Zilean: ["Icathia"],
    Zoe: ["Targon"],
    Zyra: ["Ixtal"],
};

const getChampionRegions = (champion) => championRegions[champion.id] || [];

const rarityFor = (champion) => {
    const price = getChampionBlueEssence(champion);

    if (price >= 6300) {
        return "mythic";
    }

    if (price >= 4800) {
        return "legendary";
    }

    if (price >= 3150) {
        return "epic";
    }

    if (price >= 1350) {
        return "rare";
    }

    return "common";
};

const rarityWeight = {
    mythic: 5,
    legendary: 4,
    epic: 3,
    rare: 2,
    common: 1,
};

const getStoredJson = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
};

const activeStyle = (isActive) => ({
    marginLeft: isActive ? "-4px" : "",
    opacity: isActive ? 1 : "",
    borderLeft: isActive ? "4px solid #d4af37" : "",
    borderTop: isActive ? "none" : "",
    paddingLeft: isActive ? "10px" : "",
});

const randomStart = (length) => {
    if (length <= 3) {
        return 0;
    }

    return Math.floor(Math.random() * (length - 2));
};

const uniqueById = (items) => (
    Array.from(new Map((items || []).filter(Boolean).map((item) => [item.id, item])).values())
);

const getTodayKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const localChampions = Object.values(LolData.data || {}).filter(
    (champion) => !EXCLUDED_CHAMPIONS.has(champion.id.toLowerCase())
).map(withBlueEssence);

export const CardContextprovider = ({ children }) => {
    const storedMoney = getStoredJson("money", 30000);
    const initialMoney = Array.isArray(storedMoney) ? Number(storedMoney[0] || 30000) : Number(storedMoney || 30000);
    const storedCards = getStoredJson("char", []);

    const [champions, setChampions] = useState(localChampions);
    const [cards, setCards] = useState(() => {
        const savedCards = uniqueById(Array.isArray(storedCards) ? storedCards : Object.values(storedCards));
        return savedCards.length > 0 ? savedCards : localChampions;
    });
    const [money, setMoney] = useState(initialMoney);
    const [roleFilters, setRoleFilters] = useState([]);
    const [regionFilters, setRegionFilters] = useState([]);
    const [rarityFilters, setRarityFilters] = useState([]);
    const [collectionFilter, setCollectionFilter] = useState("all");
    const [sortFilter, setSortFilter] = useState("featured");
    const [maxPrice, setMaxPrice] = useState(6300);
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [filteredId, setFilteredId] = useState([]);
    const [myCardsArr, setMyCardsArr] = useState(uniqueById(getStoredJson("myCardsArr", [])));
    const [cartItems, setCartItems] = useState(uniqueById(getStoredJson("cartItems", [])));
    const [lastDailyRewardClaim, setLastDailyRewardClaim] = useState("");
    const [alertt, setAlertt] = useState(false);
    const [carouselPage, setCarouselPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [carouselStarts, setCarouselStarts] = useState({});
    const [recentlyBoughtId, setRecentlyBoughtId] = useState("");
    const [recentlySoldId, setRecentlySoldId] = useState("");
    const [deniedChampionId, setDeniedChampionId] = useState("");
    const [selectedChampion, setSelectedChampion] = useState(null);
    const [championDetails, setChampionDetails] = useState({});

    const pulseCardState = useCallback((setter, id) => {
        setter(id);
        window.setTimeout(() => setter(""), 650);
    }, []);

    useEffect(() => {
        localStorage.setItem("money", JSON.stringify(money));
    }, [money]);

    useEffect(() => {
        localStorage.setItem("myCardsArr", JSON.stringify(myCardsArr));
    }, [myCardsArr]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("char", JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        setChampions(localChampions);
    }, []);

    const filtered = useMemo(() => {
        const source = champions.length > 0 ? champions : cards;

        return source.filter((champion) => !EXCLUDED_CHAMPIONS.has(champion.id.toLowerCase()));
    }, [cards, champions]);

    const groupedByRole = useMemo(() => (
        Object.keys(rolePages).reduce((groups, role) => {
            groups[role] = filtered.filter((item) => item.tags.some((tag) => tag === role));
            return groups;
        }, {})
    ), [filtered]);

    useEffect(() => {
        const starts = Object.keys(rolePages).reduce((acc, role) => {
            acc[role] = randomStart(groupedByRole[role]?.length || 0);
            return acc;
        }, {});

        setCarouselStarts(starts);
    }, [groupedByRole]);

    const heroPicsMap = useMemo(() => (
        Object.keys(rolePages).map((role) => {
            const start = carouselStarts[role] || 0;
            const championPics = (groupedByRole[role] || []).slice(start, start + 3);

            return {
                id: rolePages[role],
                class: role === "Marksman" ? "Marksmen" : `${role}s`,
                heroPics: championPics,
                img: roleIcons[role],
            };
        })
    ), [carouselStarts, groupedByRole]);

    const pageNumbersCarousel = useMemo(() => (
        Array.from({ length: heroPicsMap.length }, (_, index) => index + 1)
    ), [heroPicsMap.length]);

    const displayedIChampionsCarousel = useMemo(() => (
        heroPicsMap.slice(carouselPage - 1, carouselPage)
    ), [carouselPage, heroPicsMap]);

    const handleRoleClick = useCallback((role) => {
        if (!role) {
            setRoleFilters([]);
            setCarouselPage(1);
            setCurrentPage(1);
            return;
        }

        setRoleFilters((currentRoles) => (
            currentRoles.includes(role)
                ? currentRoles.filter((currentRole) => currentRole !== role)
                : [...currentRoles, role]
        ));
        setCarouselPage(rolePages[role]);
        setCurrentPage(1);
    }, []);

    const handleRarityClick = useCallback((rarity) => {
        setRarityFilters((currentRarities) => (
            currentRarities.includes(rarity)
                ? currentRarities.filter((currentRarity) => currentRarity !== rarity)
                : [...currentRarities, rarity]
        ));
        setCurrentPage(1);
    }, []);

    const handleRegionClick = useCallback((region) => {
        if (!region) {
            setRegionFilters([]);
            setCurrentPage(1);
            return;
        }

        setRegionFilters((currentRegions) => (
            currentRegions.includes(region)
                ? currentRegions.filter((currentRegion) => currentRegion !== region)
                : [...currentRegions, region]
        ));
        setCurrentPage(1);
    }, []);

    const handleChange = useCallback((event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    }, []);

    const clearSearch = useCallback(() => {
        setSearch("");
        setCurrentPage(1);
    }, []);

    const handleCollectionFilterClick = useCallback((filter) => {
        setCollectionFilter(filter);
        setCurrentPage(1);
    }, []);

    const handleSortClick = useCallback((filter) => {
        setSortFilter(filter);
        setCurrentPage(1);
    }, []);

    const filteredChampions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const ownedIds = new Set(myCardsArr.map((champion) => champion.id));
        const collectionSource = collectionFilter === "owned"
            ? myCardsArr
            : uniqueById([...cards, ...myCardsArr]);

        const collectionFiltered = collectionFilter === "not-owned"
            ? collectionSource.filter((champion) => !ownedIds.has(champion.id))
            : collectionSource;

        const searched = collectionFiltered.filter((champion) => (
            champion.id.toLowerCase().includes(normalizedSearch) ||
            champion.name.toLowerCase().includes(normalizedSearch)
        ));

        const roleFiltered = roleFilters.length > 0
            ? searched.filter((champion) => champion.tags.some((tag) => roleFilters.includes(tag)))
            : searched;

        const regionFiltered = regionFilters.length > 0
            ? roleFiltered.filter((champion) => getChampionRegions(champion).some((region) => regionFilters.includes(region)))
            : roleFiltered;

        const rarityFiltered = rarityFilters.length > 0
            ? regionFiltered.filter((champion) => rarityFilters.includes(rarityFor(champion)))
            : regionFiltered;

        const priceFiltered = rarityFiltered.filter((champion) => getChampionBlueEssence(champion) <= maxPrice);
        const sorted = [...priceFiltered];

        if (sortFilter === "price-high") {
            sorted.sort((a, b) => getChampionBlueEssence(b) - getChampionBlueEssence(a));
        }

        if (sortFilter === "price-low") {
            sorted.sort((a, b) => getChampionBlueEssence(a) - getChampionBlueEssence(b));
        }

        if (sortFilter === "alphabetical") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortFilter === "rarity") {
            sorted.sort((a, b) => (
                rarityWeight[rarityFor(b)] - rarityWeight[rarityFor(a)] ||
                getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
                a.name.localeCompare(b.name)
            ));
        }

        return sorted;
    }, [cards, collectionFilter, maxPrice, myCardsArr, rarityFilters, regionFilters, roleFilters, search, sortFilter]);

    const totalPage = Math.ceil(filteredChampions.length / CHAMPIONS_PER_PAGE);
    const pageNumbers = useMemo(() => (
        Array.from({ length: totalPage }, (_, index) => index + 1)
    ), [totalPage]);

    const displayedIChampions = useMemo(() => {
        const startIndex = (currentPage - 1) * CHAMPIONS_PER_PAGE;

        return filteredChampions.slice(startIndex, startIndex + CHAMPIONS_PER_PAGE);
    }, [currentPage, filteredChampions]);

    const cartTotal = useMemo(() => (
        cartItems.reduce((total, champion) => total + getChampionBlueEssence(champion), 0)
    ), [cartItems]);
    const cartMissingBalance = Math.max(cartTotal - money, 0);

    const addToCart = useCallback((champion) => {
        if (!champion || myCardsArr.some((card) => card.id === champion.id)) {
            return;
        }

        const sourceChampion = [...champions, ...cards, ...filtered, champion].find((item) => item.id === champion.id) || champion;

        setCartItems((currentItems) => (
            currentItems.some((item) => item.id === champion.id) ? currentItems : [sourceChampion, ...currentItems]
        ));
        setAlertt(false);
    }, [cards, champions, filtered, myCardsArr]);

    const removeFromCart = useCallback((championId) => {
        setCartItems((currentItems) => currentItems.filter((champion) => champion.id !== championId));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const dailyRewardAvailable = lastDailyRewardClaim !== getTodayKey();

    const claimDailyReward = useCallback(() => {
        const todayKey = getTodayKey();

        if (lastDailyRewardClaim === todayKey) {
            return 0;
        }

        setMoney((currentMoney) => currentMoney + DAILY_REWARD_AMOUNT);
        setLastDailyRewardClaim(todayKey);

        return DAILY_REWARD_AMOUNT;
    }, [lastDailyRewardClaim]);

    const sellClick = useCallback((req) => {
        setCards((prevCards) => (
            prevCards.some((card) => card.id === req.id) ? prevCards : [req, ...prevCards]
        ));
        setMyCardsArr((prevCards) => prevCards.filter((card) => card.id !== req.id));
        setCartItems((prevItems) => prevItems.filter((card) => card.id !== req.id));
        setMoney((currentMoney) => currentMoney + getChampionBlueEssence(req));
        pulseCardState(setRecentlySoldId, req.id);
    }, [pulseCardState]);

    const buyClick = useCallback((hero) => {
        if (myCardsArr.some((card) => card.id === hero.id)) {
            setCards((prevCards) => prevCards.filter((card) => card.id !== hero.id));
            return;
        }

        if (getChampionBlueEssence(hero) > money) {
            setAlertt(true);
            pulseCardState(setDeniedChampionId, hero.id);
            return;
        }

        setMyCardsArr((prevCards) => (
            prevCards.some((card) => card.id === hero.id) ? prevCards : [hero, ...prevCards]
        ));
        setFilteredId((prevIds) => (
            prevIds.includes(hero.id) ? prevIds : [hero.id, ...prevIds]
        ));
        setCards((prevCards) => prevCards.filter((card) => card.id !== hero.id));
        setMoney((currentMoney) => currentMoney - getChampionBlueEssence(hero));
        setAlertt(false);
        pulseCardState(setRecentlyBoughtId, hero.id);
    }, [money, myCardsArr, pulseCardState]);

    const grantPackChampion = useCallback((champion, cost = 0) => {
        if (!champion) {
            return;
        }

        if (cost > 0) {
            setMoney((currentMoney) => Math.max(currentMoney - cost, 0));
        }

        setMyCardsArr((prevCards) => (
            prevCards.some((card) => card.id === champion.id) ? prevCards : [champion, ...prevCards]
        ));
        setFilteredId((prevIds) => (
            prevIds.includes(champion.id) ? prevIds : [champion.id, ...prevIds]
        ));
        setCards((prevCards) => prevCards.filter((card) => card.id !== champion.id));
        setCartItems((prevItems) => prevItems.filter((card) => card.id !== champion.id));
        setAlertt(false);
        pulseCardState(setRecentlyBoughtId, champion.id);
    }, [pulseCardState]);

    const checkoutCart = useCallback(() => {
        const availableItems = uniqueById(cartItems).filter(
            (champion) => !myCardsArr.some((card) => card.id === champion.id)
        );
        const total = availableItems.reduce((sum, champion) => sum + getChampionBlueEssence(champion), 0);

        if (availableItems.length === 0) {
            setCartItems([]);
            return;
        }

        if (total > money) {
            setAlertt(true);
            pulseCardState(setDeniedChampionId, availableItems[0].id);
            return;
        }

        const purchasedIds = new Set(availableItems.map((champion) => champion.id));
        setMyCardsArr((prevCards) => uniqueById([...availableItems, ...prevCards]));
        setFilteredId((prevIds) => availableItems.reduce((ids, champion) => (
            ids.includes(champion.id) ? ids : [champion.id, ...ids]
        ), prevIds));
        setCards((prevCards) => prevCards.filter((card) => !purchasedIds.has(card.id)));
        setMoney((currentMoney) => currentMoney - total);
        setCartItems([]);
        setAlertt(false);
        pulseCardState(setRecentlyBoughtId, availableItems[0].id);
    }, [cartItems, money, myCardsArr, pulseCardState]);

    const loadChampionDetails = useCallback((championId) => {
        if (!championId || championDetails[championId]) {
            return undefined;
        }

        const controller = new AbortController();

        fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion/${championId}.json`, {
            signal: controller.signal,
        })
            .then((response) => response.json())
            .then((json) => {
                const champion = json.data?.[championId];

                if (!champion) {
                    return;
                }

                const skills = [
                    passiveImage(champion.passive.image.full),
                    ...champion.spells.map((spell) => spellImage(spell.image.full)),
                ];

                skills.forEach((src) => {
                    const image = new Image();
                    image.src = src;
                });

                setChampionDetails((currentDetails) => ({
                    ...currentDetails,
                    [championId]: {
                        passive: {
                            name: champion.passive.name,
                            description: stripHtml(champion.passive.description),
                            src: passiveImage(champion.passive.image.full),
                        },
                        spells: champion.spells.map((spell) => ({
                            id: spell.id,
                            name: spell.name,
                            description: stripHtml(spell.description),
                            cooldown: spell.cooldownBurn,
                            cost: spell.costBurn,
                            src: spellImage(spell.image.full),
                        })),
                        lore: champion.lore,
                        skins: champion.skins.slice(0, 6).map((skin) => ({
                            id: skin.id,
                            num: skin.num,
                            name: skin.name === "default" ? champion.name : skin.name,
                        })),
                    },
                }));
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Champion details could not be loaded", error);
                }
            });

        return controller;
    }, [championDetails]);

    const openChampionModal = useCallback((champion) => {
        if (!champion) {
            return;
        }

        loadChampionDetails(champion.id);
        setSelectedChampion({
            id: champion.id,
            name: champion.name,
            title: champion.title,
            tags: champion.tags,
            info: champion.info,
            partype: champion.partype,
            story: champion.blurb,
            price: getChampionBlueEssence(champion),
        });
    }, [loadChampionDetails]);

    const closeChampionModal = useCallback(() => {
        setSelectedChampion(null);
    }, []);

    useEffect(() => {
        if (!selectedChampion) {
            return undefined;
        }

        const controller = loadChampionDetails(selectedChampion.id);

        return () => controller?.abort();
    }, [loadChampionDetails, selectedChampion]);

    const selectedChampionDetails = selectedChampion ? championDetails[selectedChampion.id] : null;
    const selectedChampionSkills = selectedChampionDetails ? [
        { key: "P", ...selectedChampionDetails.passive },
        ...selectedChampionDetails.spells.map((spell, index) => ({
            key: ["Q", "W", "E", "R"][index],
            name: spell.name,
            description: spell.description,
            cooldown: spell.cooldown,
            cost: spell.cost,
            src: spell.src,
        })),
    ] : [];

    const dots = pageNumbersCarousel.map((page) => (
        <button
            key={page}
            disabled={page === carouselPage}
            onClick={() => setCarouselPage(page)}
            aria-label={`Show carousel page ${page}`}
        />
    ));

    const data = {
        isSearch,
        searchClick: () => setIsSearch((current) => !current),
        setAlertt,
        alertt,
        money,
        recentlyBoughtId,
        recentlySoldId,
        deniedChampionId,
        cartItems,
        cartTotal,
        cartMissingBalance,
        dailyRewardAmount: DAILY_REWARD_AMOUNT,
        dailyRewardAvailable,
        claimDailyReward,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        sellClick,
        myCardsArr,
        filteredId,
        buyClick,
        grantPackChampion,
        openChampionModal,
        closeChampionModal,
        preloadChampionDetails: loadChampionDetails,
        selectedChampion,
        selectedChampionDetails,
        selectedChampionSkills,
        dotPageNextClick: () => setCarouselPage((page) => Math.min(page + 1, heroPicsMap.length)),
        dotPagePrevClick: () => setCarouselPage((page) => Math.max(page - 1, 1)),
        dots,
        displayedIChampionsCarousel,
        setCarouselPage,
        carouselPage,
        pageNumbersCarousel,
        filtered,
        displayedIChampions,
        totalPage,
        handlePageClick: setCurrentPage,
        pageNumbers,
        currentPage,
        championsPerPage: CHAMPIONS_PER_PAGE,
        handlePrevClick: () => setCurrentPage((page) => Math.max(page - 1, 1)),
        handleNextClick: () => setCurrentPage((page) => Math.min(page + 1, totalPage || 1)),
        sortFilter,
        handleSortClick,
        maxPrice,
        setMaxPrice: (value) => {
            setMaxPrice(Number(value));
            setCurrentPage(1);
        },
        clickedAllRoles: activeStyle(roleFilters.length === 0),
        clickedFighter: activeStyle(roleFilters.includes("Fighter")),
        clickedTank: activeStyle(roleFilters.includes("Tank")),
        clickedMage: activeStyle(roleFilters.includes("Mage")),
        clickedAssassin: activeStyle(roleFilters.includes("Assassin")),
        clickedMarksman: activeStyle(roleFilters.includes("Marksman")),
        clickedSupport: activeStyle(roleFilters.includes("Support")),
        roleFilters,
        regionOptions,
        regionFilters,
        getChampionRegions,
        getRegionStyle: (region) => activeStyle(region ? regionFilters.includes(region) : regionFilters.length === 0),
        clearRegionFilters: () => handleRegionClick(""),
        handleRegionClick,
        rarityFilters,
        handleRarityClick,
        collectionFilter,
        handleCollectionFilterClick,
        search,
        clearSearch,
        handleChange,
        allRoleCLick: () => handleRoleClick(""),
        fighterClick: () => handleRoleClick("Fighter"),
        tankClick: () => handleRoleClick("Tank"),
        mageClick: () => handleRoleClick("Mage"),
        assassinClick: () => handleRoleClick("Assassin"),
        marksmanClick: () => handleRoleClick("Marksman"),
        supportClick: () => handleRoleClick("Support"),
        roleIcons,
    };

    return (
        <CardContext.Provider value={data}>
            {children}
        </CardContext.Provider>
    );
};

export default CardContext;
