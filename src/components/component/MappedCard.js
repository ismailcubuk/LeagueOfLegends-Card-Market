import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
function MappedCard() {
    const [champions, setChampions] = useState([])

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetch('http://ddragon.leagueoflegends.com/cdn/13.1.1/data/en_US/champion.json')
            .then(response => response.json())
            .then(json => setChampions(json.data))
    }
    const result = (Object.keys(champions).map((key) => champions[key]));
    const filtered = result.filter(filtered =>
        filtered.id.toLowerCase().includes("") -
        (filtered.id.toLowerCase().includes("akshan") +
            filtered.id.toLowerCase().includes("rell") +
            filtered.id.toLowerCase().includes("vex") +
            filtered.id.toLowerCase().includes("seraphine"))
    )
    const mappedSlice = filtered.slice(0, 20)



    // for (let i = 0; i < mappedSlice.length; i++) {
    //     if (mappedSlice[i].noname[0] === "Tank") {
    //         mappedSlice[i].noname[0] = "New Text";
    //     }
    // }

    let newArray = mappedSlice.map(obj => {
        obj.tags = obj.tags.map(x => x === "Fighter" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" width="40px" height="40px" alt="" /> : x)
        obj.tags = obj.tags.map(x => x === "Tank" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" width="40px" height="40px" alt="" /> : x)
        obj.tags = obj.tags.map(x => x === "Mage" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" width="40px" height="40px" alt="" /> : x)
        obj.tags = obj.tags.map(x => x === "Assassin" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" width="40px" height="40px" alt="" /> : x)
        obj.tags = obj.tags.map(x => x === "Marksman" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" width="40px" height="40px" alt="" /> : x)
        obj.tags = obj.tags.map(x => x === "Support" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" width="40px" height="40px" alt="" /> : x)
        return obj;
    });


    const mapped = newArray.map((hero) => {
        return <div className='hero-border' key={hero.id}>
            <div className='hero-id'>{hero.id}</div>
            <div className='hero-title'>{hero.title}</div>
            <div className='hero-image'>
                <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />

                <div className='hero-tags'> {hero.tags} </div>
            </div>
            <div className='info'>
                <div>
                    <div>Attack</div>
                    <div className='info-img'>{hero.info.attack}</div>
                </div>
                <div>
                    <div>Defense</div>
                    <div className='info-img'>{hero.info.defense}</div>
                </div>
                <div>
                    <div>Magic</div>


                    <div className='info-img'>
                        {
                            hero.info.magic
                        }


                    </div>



                </div>
            </div>
            <div className='card-trade'>
                <Button className='buy-button' variant="success">BUY</Button>
                <div className='hero-money'>${hero.info.difficulty}</div>
            </div>
        </div>
    })
    return (
        <div className='right-main'>
            <div className='parent'>
                {mapped}
            </div>
        </div>
    )
}

export default MappedCard