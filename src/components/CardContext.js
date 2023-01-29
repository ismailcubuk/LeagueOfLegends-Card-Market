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
    const allRoleCLick = () => {
        setDatas("")
    }
    const tankClick = () => {
        setDatas("Tank")
    }
    const mageClick = () => {
        setDatas("Mage")
    }
    const assassinClick = () => {
        setDatas("Assassin")
    }
    const marksmanClick = () => {
        setDatas("Marksman")
    }
    const supportClick = () => {
        setDatas("Support")
    }
    const fighterClick = () => {
        setDatas("Fighter")
    }

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
    const newArray = filtered.filter(item => item.tags.some(tags => tags.includes(datas))).map(obj => {
        return obj;
    });

    const data = {
        newArray,
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