import { createContext, useState, useEffect } from "react";

const CardContext = createContext();

export const CardContextprovider = ({ children }) => {
    const [champions, setChampions] = useState([])

    const fetchData = async () => {
        await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
            .then(response => response.json())
            .then(json => setChampions(json.data))
    }

    useEffect(() => {
        fetchData();
    }, [])
    // filter area
    const [search, setSearch] = useState("")
    const [datas, setDatas] = useState("")

    // CHAMPİON SEARCH
    const handleChange = (e) => {
        setSearch(e.target.value)
    }
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
        setDatas("")
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
    //               - ALLROLES -
    //               + FİGHTER +
    const [activeFighter, setActiveFighter] = useState(false)
    const clickedFighter = {
        marginLeft: activeFighter ? "-4px" : "",
        opacity: activeFighter ? 1 : "",
        borderLeft: activeFighter ? "4px solid red" : "",
        borderTop: activeFighter ? "none" : "",
    }
    const fighterClick = () => {
        setDatas("Fighter")
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
    //               - FİGHTER -
    //                 + TANK +
    const [activeTank, setActiveTank] = useState(false)
    const clickedTank = {
        marginLeft: activeTank ? "-4px" : "",
        opacity: activeTank ? 1 : "",
        borderLeft: activeTank ? "4px solid red" : "",
        borderTop: activeTank ? "none" : "",
    }
    const tankClick = () => {
        setDatas("Tank")
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
    //                 - TANK -
    //                 + MAGE +
    const [activeMage, setActiveMage] = useState(false)
    const clickedMage = {
        marginLeft: activeMage ? "-4px" : "",
        opacity: activeMage ? 1 : "",
        borderLeft: activeMage ? "4px solid red" : "",
        borderTop: activeMage ? "none" : "",
    }
    const mageClick = () => {
        setDatas("Mage")
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
    //                 - MAGE -
    //                 + ASSASSİN +
    const [activeAssassin, setActiveAssassin] = useState(false)
    const clickedAssassin = {
        marginLeft: activeAssassin ? "-4px" : "",
        opacity: activeAssassin ? 1 : "",
        borderLeft: activeAssassin ? "4px solid red" : "",
        borderTop: activeAssassin ? "none" : "",
    }
    const assassinClick = () => {
        setDatas("Assassin")
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
    //               - ASSASSİN -
    //               + MARKSMAN +
    const [activeMarksman, setActiveMarksman] = useState(false)
    const clickedMarksman = {
        marginLeft: activeMarksman ? "-4px" : "",
        opacity: activeMarksman ? 1 : "",
        borderLeft: activeMarksman ? "4px solid red" : "",
        borderTop: activeMarksman ? "none" : "",
    }
    const marksmanClick = () => {
        setDatas("Marksman")
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
    //               - MARKSMAN -
    //               + SUPPORT +
    const [activeSupport, setActiveSupport] = useState(false)
    const clickedSupport = {
        marginLeft: activeSupport ? "-4px" : "",
        opacity: activeSupport ? 1 : "",
        borderLeft: activeSupport ? "4px solid red" : "",
        borderTop: activeSupport ? "none" : "",
    }
    const supportClick = () => {
        setDatas("Support")
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
    //               - SUPPORT -
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
    //             - UP MONEY -
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
    //             - DOWN MONEY -
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
    //             - UNFİLTERED MONEY -

    //                + FİLTER AREA +  
    //                + DELETE UNREADVALUES +
    const result = (Object.keys(champions).map((key) => champions[key]));
    const filtered = result.filter(filtered =>
        filtered.id.toLowerCase().includes("") -
        (filtered.id.toLowerCase().includes("akshan") +
            filtered.id.toLowerCase().includes("rell") +
            filtered.id.toLowerCase().includes("vex") +
            filtered.id.toLowerCase().includes("seraphine"))
    )
    //                - DELETE UNREADVALUES -
    //                + FİLTER SİDE BAR +
    const filteredChamp = filtered.filter(filteredText => filteredText.id.toLowerCase().includes(search.toLowerCase()))
    const filteredTags = filteredChamp.filter(item => item.tags.some(tags => tags.includes(datas)))
    const newArray = filterUpMoney === true ? filteredTags.sort(function (a, b) { return b.info.difficulty - a.info.difficulty })
        : filterDownMoney === true ? filteredTags.sort(function (a, b) { return a.info.difficulty - b.info.difficulty })
            : unFilteredMoney === true ? filteredTags : filteredTags
                .map(obj => {
                    return obj;
                });
    //                - FİLTER SİDE BAR -
    //                + PAGİNATİON +

    const [filteredId, setFilteredId] = useState([])
    const [myCardsArr, setMyCardsArr] = useState([])
    const [count, setCount] = useState(0)
    const [counter, setCounter] = useState(0)
    const buyClick = (hero) => {
        setMyCardsArr([hero, ...myCardsArr])
        setFilteredId([hero.id, ...filteredId])
        setCount(count + 1)
        setCounter(counter - 1)
    }

    // DÜZELİTELECEK NOKTA...................................................................
    const championsPerPage = 12
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * championsPerPage;
    const endIndex = startIndex + championsPerPage;
    const displayedIChampions = newArray.slice(startIndex, endIndex);
    // const displayedIChampions = newArray.slice(startIndex, endIndex + count);
    const totalPage = Math.ceil((newArray.length) / championsPerPage)
    // const totalPage = Math.ceil((newArray.length - count) / championsPerPage)
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
    //                - PAGİNATİON -
    //                - FİLTER AREA - 



    //                  +CAROUSEL 
    const [randomFighter, setRandomFighter] = useState()
    const [randomTank, setRandomTank] = useState()
    const [randomMage, setRandomMage] = useState()
    const [randomAssassin, setRandomAssassin] = useState()
    const [randomMarksman, setRandomMarksman] = useState()
    const [randomSupport, setRandomSupport] = useState()


    // FİGHTER PİCS
    const filteredFighter = filtered.filter(item => item.tags.some(tags => tags.includes("Fighter")))
    useEffect(() => {
        let randomFighter = Math.floor(Math.random() * filteredFighter.length)
        setRandomFighter(randomFighter)
    }, [filteredFighter.length])
    const slicePicsFighter = filteredFighter.slice(randomFighter, randomFighter + 3)
    const filteredFighterPics = slicePicsFighter.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // TANK PİCS
    const filteredTank = filtered.filter(item => item.tags.some(tags => tags.includes("Tank")))
    useEffect(() => {
        let randomTank = Math.floor(Math.random() * filteredTank.length)
        setRandomTank(randomTank)
    }, [filteredTank.length])
    const slicePicsTank = filteredTank.slice(randomTank, randomTank + 3)
    const filteredTankPics = slicePicsTank?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MAGE PİCS
    const filteredMage = filtered.filter(item => item.tags.some(tags => tags.includes("Mage")))
    useEffect(() => {
        let randomMage = Math.floor(Math.random() * filteredMage.length)
        setRandomMage(randomMage)
    }, [filteredMage.length])
    const slicePicsMage = filteredMage.slice(randomMage, randomMage + 3)
    const filteredMagePics = slicePicsMage?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // ASSASSİN PİCS
    const filteredAssassin = filtered.filter(item => item.tags.some(tags => tags.includes("Assassin")))
    useEffect(() => {
        let randomAssassin = Math.floor(Math.random() * filteredAssassin.length)
        setRandomAssassin(randomAssassin)
    }, [filteredAssassin.length])
    const slicePicsAssassin = filteredAssassin.slice(randomAssassin, randomAssassin + 3)
    const filteredAssassinPics = slicePicsAssassin?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // MARKSMAN PİCS
    const filteredMarksman = filtered.filter(item => item.tags.some(tags => tags.includes("Marksman")))
    useEffect(() => {
        let randomMarksman = Math.floor(Math.random() * filteredMarksman.length)
        setRandomMarksman(randomMarksman)
    }, [filteredMarksman.length])
    const slicePicsMarksman = filteredMarksman.slice(randomMarksman, randomMarksman + 3)
    const filteredMarksmanPics = slicePicsMarksman?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    // SUPPORT PİCS
    const filteredSupport = filtered.filter(item => item.tags.some(tags => tags.includes("Support")))
    useEffect(() => {
        let randomSupport = Math.floor(Math.random() * filteredSupport.length)
        setRandomSupport(randomSupport)
    }, [filteredSupport.length])
    const slicePicsSupport = filteredSupport.slice(randomSupport, randomSupport + 3)
    const filteredSupportPics = slicePicsSupport?.map((heroPics) => {
        return <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${heroPics.id}_0.jpg`} width='150px' height='250px' alt="champions" />
    })

    const heroPicsMap = [
        { id: 1, class: "Fighters", heroPics: filteredFighterPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" },
        { id: 2, class: "Tanks", heroPics: filteredTankPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" },
        { id: 3, class: "Mages", heroPics: filteredMagePics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" },
        { id: 4, class: "Assassins", heroPics: filteredAssassinPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" },
        { id: 5, class: "Marksmans", heroPics: filteredMarksmanPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" },
        { id: 6, class: "Supports", heroPics: filteredSupportPics, img: "https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" },
    ]

    const [carouselPage, setCarouselPage] = useState(1);
    const startIndexCarousel = (carouselPage - 1) * 1;
    const endIndexCarousel = startIndexCarousel + 1;
    const displayedIChampionsCarousel = heroPicsMap.slice(startIndexCarousel, endIndexCarousel);
    const totalPageCarousel = Math.ceil(heroPicsMap.length / 1)
    const pageNumbersCarousel = Array.from({ length: totalPageCarousel }, (_, index) => index + 1)

    //                  -CAROUSEL 

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


    const data = {
        myCardsArr,
        filteredId,
        buyClick,
        filteredTags,
        dotPageNextClick,
        dotPagePrevClick,
        dots,
        displayedIChampionsCarousel,
        setCarouselPage,
        carouselPage,
        pageNumbersCarousel,
        // asd
        filtered,
        displayedIChampions,
        totalPage,
        handlePageClick,
        pageNumbers,
        currentPage,
        championsPerPage,
        filteredChamp,
        handlePrevClick,
        handleNextClick,
        unFilteredMoneyActive,
        filterDownMoneyActive,
        filterUpMoneyActive,
        filterUpMoneyClick,
        filterDownMoneyClick,
        unFilteredMoneyClick,
        newArray,
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