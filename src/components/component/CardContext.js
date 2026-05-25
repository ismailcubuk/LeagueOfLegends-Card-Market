import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const CardContext = createContext();

const DDRAGON_VERSION = "13.1.1";
const CHAMPIONS_PER_PAGE = 16;
const EXCLUDED_CHAMPIONS = new Set(["akshan", "rell", "vex", "seraphine"]);

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

export const CardContextprovider = ({ children }) => {
    const storedMoney = getStoredJson("money", 30);
    const initialMoney = Array.isArray(storedMoney) ? Number(storedMoney[0] || 30) : Number(storedMoney || 30);
    const storedCards = getStoredJson("char", []);

    const [champions, setChampions] = useState([]);
    const [cards, setCards] = useState(uniqueById(Array.isArray(storedCards) ? storedCards : Object.values(storedCards)));
    const [money, setMoney] = useState(initialMoney);
    const [roleFilter, setRoleFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("default");
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);
    const [filteredId, setFilteredId] = useState([]);
    const [myCardsArr, setMyCardsArr] = useState(uniqueById(getStoredJson("myCardsArr", [])));
    const [alertt, setAlertt] = useState(false);
    const [carouselPage, setCarouselPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [carouselStarts, setCarouselStarts] = useState({});
    const [recentlyBoughtId, setRecentlyBoughtId] = useState("");
    const [recentlySoldId, setRecentlySoldId] = useState("");
    const [deniedChampionId, setDeniedChampionId] = useState("");

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
        localStorage.setItem("char", JSON.stringify(cards));
    }, [cards]);

    useEffect(() => {
        if (cards.length > 0) {
            setChampions(cards);
            return;
        }

        const controller = new AbortController();

        fetch(`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/en_US/champion.json`, {
            signal: controller.signal,
        })
            .then((response) => response.json())
            .then((json) => {
                const fetchedChampions = Object.values(json.data || {}).filter(
                    (champion) => !EXCLUDED_CHAMPIONS.has(champion.id.toLowerCase())
                );
                setChampions(fetchedChampions);
                setCards(fetchedChampions);
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Champion data could not be loaded", error);
                }
            });

        return () => controller.abort();
    }, [cards.length]);

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
                heroPics: championPics.map((champion) => (
                    <figure className="carousel-champion-card" key={champion.id}>
                        <img
                            src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg`}
                            width="150"
                            height="250"
                            loading="lazy"
                            alt={champion.name}
                        />
                        <figcaption>{champion.name}</figcaption>
                    </figure>
                )),
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
        setRoleFilter(role);
        setCarouselPage(role ? rolePages[role] : 1);
        setCurrentPage(1);
    }, []);

    const handleChange = useCallback((event) => {
        setSearch(event.target.value);
        setCurrentPage(1);
    }, []);

    const filteredChampions = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        const searched = cards.filter((champion) => (
            champion.id.toLowerCase().includes(normalizedSearch) ||
            champion.name.toLowerCase().includes(normalizedSearch)
        ));

        const roleFiltered = roleFilter
            ? searched.filter((champion) => champion.tags.some((tag) => tag === roleFilter))
            : searched;

        const sorted = [...roleFiltered];

        if (priceFilter === "high") {
            sorted.sort((a, b) => b.info.difficulty - a.info.difficulty);
        }

        if (priceFilter === "low") {
            sorted.sort((a, b) => a.info.difficulty - b.info.difficulty);
        }

        return sorted;
    }, [cards, priceFilter, roleFilter, search]);

    const totalPage = Math.ceil(filteredChampions.length / CHAMPIONS_PER_PAGE);
    const pageNumbers = useMemo(() => (
        Array.from({ length: totalPage }, (_, index) => index + 1)
    ), [totalPage]);

    const displayedIChampions = useMemo(() => {
        const startIndex = (currentPage - 1) * CHAMPIONS_PER_PAGE;

        return filteredChampions.slice(startIndex, startIndex + CHAMPIONS_PER_PAGE);
    }, [currentPage, filteredChampions]);

    const sellClick = useCallback((req) => {
        setCards((prevCards) => (
            prevCards.some((card) => card.id === req.id) ? prevCards : [req, ...prevCards]
        ));
        setMyCardsArr((prevCards) => prevCards.filter((card) => card.id !== req.id));
        setMoney((currentMoney) => currentMoney + req.info.difficulty);
        pulseCardState(setRecentlySoldId, req.id);
    }, [pulseCardState]);

    const buyClick = useCallback((hero) => {
        if (myCardsArr.some((card) => card.id === hero.id)) {
            setCards((prevCards) => prevCards.filter((card) => card.id !== hero.id));
            return;
        }

        if (hero.info.difficulty > money) {
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
        setMoney((currentMoney) => currentMoney - hero.info.difficulty);
        setAlertt(false);
        pulseCardState(setRecentlyBoughtId, hero.id);
    }, [money, myCardsArr, pulseCardState]);

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
        sellClick,
        myCardsArr,
        filteredId,
        buyClick,
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
        unFilteredMoneyActive: activeStyle(priceFilter === "default"),
        filterDownMoneyActive: activeStyle(priceFilter === "low"),
        filterUpMoneyActive: activeStyle(priceFilter === "high"),
        filterUpMoneyClick: () => setPriceFilter("high"),
        filterDownMoneyClick: () => setPriceFilter("low"),
        unFilteredMoneyClick: () => setPriceFilter("default"),
        clickedAllRoles: activeStyle(roleFilter === ""),
        clickedFighter: activeStyle(roleFilter === "Fighter"),
        clickedTank: activeStyle(roleFilter === "Tank"),
        clickedMage: activeStyle(roleFilter === "Mage"),
        clickedAssassin: activeStyle(roleFilter === "Assassin"),
        clickedMarksman: activeStyle(roleFilter === "Marksman"),
        clickedSupport: activeStyle(roleFilter === "Support"),
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
