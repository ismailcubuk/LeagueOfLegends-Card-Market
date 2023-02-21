import { createContext, useState, useEffect } from "react";

const CardContext = createContext();

export const CardContextprovider = ({ children }) => {
    const [champions, setChampions] = useState([])
    const [isfetch, setIsFtech] = useState(false)
    const [cards, setCards] = useState([])
    const moneyFromLocalStorage = JSON.parse(localStorage.getItem('money') || '[30]')
    const [money, setMoney] = useState(moneyFromLocalStorage)
    useEffect(() => {
        localStorage.setItem("money", JSON.stringify(money))
    }, [money])

    const fetchData = async () => {
        await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
            .then(response => response.json())
            .then(json => setChampions(json.data))
        setIsFtech(true)
    }

    useEffect(() => {
        fetchData();
        if (isfetch) {
        }
    }, [isfetch])

    const [roleFilter, SetRoleFilter] = useState("")

    //               + ALLROLES +
    const [activeAllRoles, setActiveAllRoles] = useState(true)
    const clickedAllRoles = {
        marginLeft: activeAllRoles ? "-4px" : "",
        opacity: activeAllRoles ? 1 : "",
        borderLeft: activeAllRoles ? "4px solid red" : "",
        borderTop: activeAllRoles ? "none" : "",
        paddingLeft: activeAllRoles ? "10px" : ""
    }
    const allRoleCLick = () => {
        SetRoleFilter("")
        setActiveAllRoles(true)
        setActiveFighter(false)
        setActiveTank(false)
        setActiveMage(false)
        setActiveAssassin(false)
        setActiveMarksman(false)
        setActiveSupport(false)
        setCarouselPage(1)
        setCurrentPage(1)
    }
    //               + FİGHTER +
    const [activeFighter, setActiveFighter] = useState(false)
    const clickedFighter = {
        marginLeft: activeFighter ? "-4px" : "",
        opacity: activeFighter ? 1 : "",
        borderLeft: activeFighter ? "4px solid red" : "",
        borderTop: activeFighter ? "none" : "",
    }
    const fighterClick = () => {
        SetRoleFilter("Fighter")
        setActiveAllRoles(false)
        setActiveFighter(true)
        setActiveTank(false)
        setActiveMage(false)
        setActiveAssassin(false)
        setActiveMarksman(false)
        setActiveSupport(false)
        setCarouselPage(1)
        setCurrentPage(1)
    }
    //                 + TANK +
    const [activeTank, setActiveTank] = useState(false)
    const clickedTank = {
        marginLeft: activeTank ? "-4px" : "",
        opacity: activeTank ? 1 : "",
        borderLeft: activeTank ? "4px solid red" : "",
        borderTop: activeTank ? "none" : "",
    }
    const tankClick = () => {
        SetRoleFilter("Tank")
        setActiveAllRoles(false)
        setActiveFighter(false)
        setActiveTank(true)
        setActiveMage(false)
        setActiveAssassin(false)
        setActiveMarksman(false)
        setActiveSupport(false)
        setCarouselPage(2)
        setCurrentPage(1)
    }
    //                 + MAGE +
    const [activeMage, setActiveMage] = useState(false)
    const clickedMage = {
        marginLeft: activeMage ? "-4px" : "",
        opacity: activeMage ? 1 : "",
        borderLeft: activeMage ? "4px solid red" : "",
        borderTop: activeMage ? "none" : "",
    }
    const mageClick = () => {
        SetRoleFilter("Mage")
        setActiveAllRoles(false)
        setActiveFighter(false)
        setActiveTank(false)
        setActiveMage(true)
        setActiveAssassin(false)
        setActiveMarksman(false)
        setActiveSupport(false)
        setCarouselPage(3)
        setCurrentPage(1)

    }
    //                 + ASSASSİN +
    const [activeAssassin, setActiveAssassin] = useState(false)
    const clickedAssassin = {
        marginLeft: activeAssassin ? "-4px" : "",
        opacity: activeAssassin ? 1 : "",
        borderLeft: activeAssassin ? "4px solid red" : "",
        borderTop: activeAssassin ? "none" : "",
    }
    const assassinClick = () => {
        SetRoleFilter("Assassin")
        setActiveAllRoles(false)
        setActiveFighter(false)
        setActiveTank(false)
        setActiveMage(false)
        setActiveAssassin(true)
        setActiveMarksman(false)
        setActiveSupport(false)
        setCarouselPage(4)
        setCurrentPage(1)
    }
    //               + MARKSMAN +
    const [activeMarksman, setActiveMarksman] = useState(false)
    const clickedMarksman = {
        marginLeft: activeMarksman ? "-4px" : "",
        opacity: activeMarksman ? 1 : "",
        borderLeft: activeMarksman ? "4px solid red" : "",
        borderTop: activeMarksman ? "none" : "",
    }
    const marksmanClick = () => {
        SetRoleFilter("Marksman")
        setActiveAllRoles(false)
        setActiveFighter(false)
        setActiveTank(false)
        setActiveMage(false)
        setActiveAssassin(false)
        setActiveMarksman(true)
        setActiveSupport(false)
        setCarouselPage(5)
        setCurrentPage(1)
    }
    //               + SUPPORT +
    const [activeSupport, setActiveSupport] = useState(false)
    const clickedSupport = {
        marginLeft: activeSupport ? "-4px" : "",
        opacity: activeSupport ? 1 : "",
        borderLeft: activeSupport ? "4px solid red" : "",
        borderTop: activeSupport ? "none" : "",
    }
    const supportClick = () => {
        SetRoleFilter("Support")
        setActiveAllRoles(false)
        setActiveFighter(false)
        setActiveTank(false)
        setActiveMage(false)
        setActiveAssassin(false)
        setActiveMarksman(false)
        setActiveSupport(true)
        setCarouselPage(6)
        setCurrentPage(1)
    }
    //              + UP MONEY +
    const [filterUpMoney, setFilterUpMoney] = useState(false)
    const filterUpMoneyActive = {
        marginLeft: filterUpMoney ? "-4px" : "",
        opacity: filterUpMoney ? 1 : "",
        borderLeft: filterUpMoney ? "4px solid red" : "",
        borderTop: filterUpMoney ? "none" : "",
    }
    const filterUpMoneyClick = () => {
        setFilterUpMoney(true);
        setFilterDownMoney(false);
        setUnFilteredMoney(false)
    }
    //             + DOWN MONEY +
    const [filterDownMoney, setFilterDownMoney] = useState(false)
    const filterDownMoneyActive = {
        marginLeft: filterDownMoney ? "-4px" : "",
        opacity: filterDownMoney ? 1 : "",
        borderLeft: filterDownMoney ? "4px solid red" : "",
        borderTop: filterDownMoney ? "none" : "",
    }
    const filterDownMoneyClick = () => {
        setFilterDownMoney(true);
        setFilterUpMoney(false)
        setUnFilteredMoney(false)
    }
    //             + UNFİLTERED MONEY +
    const [unFilteredMoney, setUnFilteredMoney] = useState(true)
    const unFilteredMoneyActive = {
        marginLeft: unFilteredMoney ? "-4px" : "",
        opacity: unFilteredMoney ? 1 : "",
        borderLeft: unFilteredMoney ? "4px solid red" : "",
        borderTop: unFilteredMoney ? "none" : "",
    }
    const unFilteredMoneyClick = () => {
        setUnFilteredMoney(true)
        setFilterDownMoney(false);
        setFilterUpMoney(false)
    }

    //                + DELETE UNREADVALUES +
    const result = (Object.keys(champions).map((key) => champions[key]));
    const filtered = result.filter(filtered =>
        filtered.id.toLowerCase().includes("") -
        (filtered.id.toLowerCase().includes("akshan") +
            filtered.id.toLowerCase().includes("rell") +
            filtered.id.toLowerCase().includes("vex") +
            filtered.id.toLowerCase().includes("seraphine"))
    )

    //                  + CAROUSEL +
    const [randomFighter, setRandomFighter] = useState()
    const [randomTank, setRandomTank] = useState()
    const [randomMage, setRandomMage] = useState()
    const [randomAssassin, setRandomAssassin] = useState()
    const [randomMarksman, setRandomMarksman] = useState()
    const [randomSupport, setRandomSupport] = useState()

    const addThreeChamp = 3
    // CAROUSEL FİGHTER PİCS
    const filteredFighter = filtered.filter(item => item.tags.some(tags => tags.includes("Fighter")))
    useEffect(() => {
        setRandomFighter(Math.floor(Math.random() * (filteredFighter.length - 4)))
    }, [filteredFighter.length])
    const slicePicsFighter = filteredFighter.slice(randomFighter, randomFighter + addThreeChamp)
    const filteredFighterPics = slicePicsFighter.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL TANK PİCS
    const filteredTank = filtered.filter(item => item.tags.some(tags => tags.includes("Tank")))
    useEffect(() => {
        setRandomTank(Math.floor(Math.random() * (filteredTank.length - 4)))
    }, [filteredTank.length])
    const slicePicsTank = filteredTank.slice(randomTank, randomTank + addThreeChamp)
    const filteredTankPics = slicePicsTank?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL MAGE PİCS
    const filteredMage = filtered.filter(item => item.tags.some(tags => tags.includes("Mage")))
    useEffect(() => {
        setRandomMage(Math.floor(Math.random() * (filteredMage.length - 4)))
    }, [filteredMage.length])
    const slicePicsMage = filteredMage.slice(randomMage, randomMage + addThreeChamp)
    const filteredMagePics = slicePicsMage?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL ASSASSİN PİCS
    const filteredAssassin = filtered.filter(item => item.tags.some(tags => tags.includes("Assassin")))
    useEffect(() => {
        setRandomAssassin(Math.floor(Math.random() * (filteredAssassin.length - 4)))
    }, [filteredAssassin.length])
    const slicePicsAssassin = filteredAssassin.slice(randomAssassin, randomAssassin + addThreeChamp)
    const filteredAssassinPics = slicePicsAssassin?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL MARKSMAN PİCS
    const filteredMarksman = filtered.filter(item => item.tags.some(tags => tags.includes("Marksman")))
    useEffect(() => {
        setRandomMarksman(Math.floor(Math.random() * (filteredMarksman.length - 4)))
    }, [filteredMarksman.length])
    const slicePicsMarksman = filteredMarksman.slice(randomMarksman, randomMarksman + addThreeChamp)
    const filteredMarksmanPics = slicePicsMarksman?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL SUPPORT PİCS
    const filteredSupport = filtered.filter(item => item.tags.some(tags => tags.includes("Support")))
    useEffect(() => {
        setRandomSupport(Math.floor(Math.random() * (filteredSupport.length - 4)))
    }, [filteredSupport.length])
    const slicePicsSupport = filteredSupport.slice(randomSupport, randomSupport + addThreeChamp)
    const filteredSupportPics = slicePicsSupport?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // CAROUSEL HERO PİCTURES ARRAY
    const heroPicsMap = [
        {
            id: 1,
            class: "Fighters",
            heroPics: filteredFighterPics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png"
        },
        {
            id: 2,
            class: "Tanks",
            heroPics: filteredTankPics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png"
        },
        {
            id: 3,
            class: "Mages",
            heroPics: filteredMagePics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png"
        },
        {
            id: 4,
            class: "Assassins",
            heroPics: filteredAssassinPics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png"
        },
        {
            id: 5,
            class: "Marksmans",
            heroPics: filteredMarksmanPics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png"
        },
        {
            id: 6,
            class: "Supports",
            heroPics: filteredSupportPics,
            img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png"
        },
    ]
    //                     + CAROUSEL PAGİNATİON +
    const [carouselPage, setCarouselPage] = useState(1);
    const startIndexCarousel = (carouselPage - 1) * 1;
    const endIndexCarousel = startIndexCarousel + 1;
    const displayedIChampionsCarousel = heroPicsMap.slice(startIndexCarousel, endIndexCarousel);
    const totalPageCarousel = Math.ceil(heroPicsMap.length / 1)
    const pageNumbersCarousel = Array.from({ length: totalPageCarousel }, (_, index) => index + 1)

    const dotPageClick = (page) => {
        setCarouselPage(page)
    }

    const dotPageNextClick = () => {
        setCarouselPage(carouselPage + 1);
    };
    const dotPagePrevClick = () => {
        setCarouselPage(carouselPage - 1);
    }

    const dots = pageNumbersCarousel.map((page) => (
        <button
            key={page}
            disabled={page === carouselPage}
            onClick={() => dotPageClick(page)}
        > {page} </button>
    ))

    //                 + ARRAY TO STATE +

    useEffect(() => {
        setCards(filtered)
    }, [isfetch])

    //                + FİLTER SİDE BAR +
    const [search, setSearch] = useState("")
    const handleChange = (e) => {
        setSearch(e.target.value)
    }
    const filteredChamp = cards.filter(filteredText =>
        filteredText.id.toLowerCase().includes(search.toLowerCase()))

    const filteredTags = filteredChamp.filter(item =>
        item.tags.some(tags => tags.includes(roleFilter)))

    const newArray = filterUpMoney === true ?
        filteredTags.sort(function (a, b) { return b.info.difficulty - a.info.difficulty })
        : filterDownMoney === true ?
            filteredTags.sort(function (a, b) { return a.info.difficulty - b.info.difficulty })
            : unFilteredMoney === true ? filteredTags
                : filteredTags

    //                + BUY SOLD CLİCK +
    const [filteredId, setFilteredId] = useState([])
    const myCardsArrFromLocalStorage = JSON.parse(localStorage.getItem('myCardsArr') || '[]')
    const [myCardsArr, setMyCardsArr] = useState(myCardsArrFromLocalStorage)
    useEffect(() => {
        localStorage.setItem("myCardsArr", JSON.stringify(myCardsArr))
    }, [myCardsArr])

    const [alertt, setAlertt] = useState(false)
    const sellClick = (req) => {
        const newcard = myCardsArr.find((item) => item.id === req.id)
        setCards([newcard, ...cards])
        setMyCardsArr([...myCardsArr.filter((card) => card.id !== req.id)])
        setMoney(money + req.info.difficulty)
    }
    const buyClick = (hero) => {
        setMyCardsArr(hero.info.difficulty > money ? [...myCardsArr] : [hero, ...myCardsArr])
        setFilteredId([hero.id, ...filteredId])
        setCards(hero.info.difficulty > money ? [...cards] : [...cards.filter((card) => card.id !== hero.id)])
        setMoney(money >= hero.info.difficulty ? money - hero.info.difficulty : money)
        setAlertt(money >= hero.info.difficulty ? false : true)
    }

    //                + PAGİNATİON +
    const championsPerPage = 12
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * championsPerPage;
    const endIndex = startIndex + championsPerPage;
    const displayedIChampions = newArray.slice(startIndex, endIndex);
    const totalPage = Math.ceil((newArray.length) / championsPerPage)
    const pageNumbers = Array.from({ length: totalPage }, (_, index) => index + 1)
    const handlePrevClick = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleNextClick = () => {
        setCurrentPage(currentPage + 1);
    };
    const handlePageClick = (page) => {
        setCurrentPage(page)
    }



    const data = {
        setAlertt,
        alertt,
        money,
        sellClick,
        myCardsArr,
        filteredId,
        buyClick,
        dotPageNextClick,
        dotPagePrevClick,
        dots,
        displayedIChampionsCarousel,
        setCarouselPage,
        carouselPage,
        pageNumbersCarousel,
        filtered,
        displayedIChampions,
        totalPage,
        handlePageClick,
        pageNumbers,
        currentPage,
        championsPerPage,
        handlePrevClick,
        handleNextClick,
        unFilteredMoneyActive,
        filterDownMoneyActive,
        filterUpMoneyActive,
        filterUpMoneyClick,
        filterDownMoneyClick,
        unFilteredMoneyClick,
        clickedAllRoles,
        clickedFighter,
        clickedTank,
        clickedMage,
        clickedAssassin,
        clickedMarksman,
        clickedSupport,
        handleChange,
        allRoleCLick,
        fighterClick,
        tankClick,
        mageClick,
        assassinClick,
        marksmanClick,
        supportClick
    }
    return (
        <CardContext.Provider value={data}>
            {children}
        </CardContext.Provider>
    )
}

export default CardContext