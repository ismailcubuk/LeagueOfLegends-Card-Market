import { createContext, useState, useEffect } from "react";

const CardContext = createContext();

export const CardContextprovider = ({ children }) => {
    const [champions, setChampions] = useState([])

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
            .then(response => response.json())
            .then(json => setChampions(json.data))
    }
    // filter area
    const [search, setSearch] = useState("")
    const [datas, setDatas] = useState("")


    const handleChange = (e) => {
        setSearch(e.target.value)
    }
    //               + ALLROLES +
    const [activeAllRoles, setActiveAllRoles] = useState(false)
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
    }
    //               - SUPPORT -

    const result = (Object.keys(champions).map((key) => champions[key]));
    const filtered = result.filter(filtered =>
        filtered.id.toLowerCase().includes("") -
        (filtered.id.toLowerCase().includes("akshan") +
            filtered.id.toLowerCase().includes("rell") +
            filtered.id.toLowerCase().includes("vex") +
            filtered.id.toLowerCase().includes("seraphine"))
    )

    // .slice(0, 20)
    const filteredChamp = filtered.filter(filteredText => filteredText.id.toLowerCase().includes(search))
    const newArray = filteredChamp.filter(item => item.tags.some(tags => tags.includes(datas))).map(obj => {
        return obj;
    });

    const data = {
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