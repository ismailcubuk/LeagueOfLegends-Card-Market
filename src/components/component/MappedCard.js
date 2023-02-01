import { Button } from 'react-bootstrap';
import React, { useContext, useState } from 'react'
import CardContext from '../CardContext'
function MappedCard() {
    const { displayedIChampions } = useContext(CardContext)

    const [clicked, setClicked] = useState(false);
    const [getId, setGetId] = useState()

    const style1 = {
        // border: clicked === true ? "2px solid blue" : "0",
        // opacity: clicked === true ? "0.4" : "1",
    }
    const handleClick = (id) => {
        setClicked(!clicked);
        setGetId(id)
    }

    const mapped = displayedIChampions.map((hero) => {
        return <div className='hero-border' key={hero.id} id={hero.id}>
            <div className='hero-id'>{hero.id}</div>


            <div className='hero-image' onClick={() => handleClick(hero.id)} style={getId === hero.id ? style1 : null} >

                {clicked === true && getId === hero.id
                    ? <div className='hero-image-back'>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_1.jpg`} alt="champions" />
                        <div className='back-list'>
                            <div className='header-back' >
                                <div className='hero-title'>{hero.title}</div>
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
                                        <div className='info-img'>{hero.info.magic}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className='hero-image'>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                        <div className='hero-tags'>
                            {(hero.tags).map(
                                a => a === "Fighter"
                                    ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" width="40px" height="40px" alt="" />
                                    : a === "Tank" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" width="40px" height="40px" alt="" />
                                        : a === "Mage" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" width="40px" height="40px" alt="" />
                                            : a === "Assassin" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" width="40px" height="40px" alt="" />
                                                : a === "Marksman" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" width="40px" height="40px" alt="" />
                                                    : a === "Support" ? <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" width="40px" height="40px" alt="" />
                                                        : a)}
                        </div>
                    </div>
                }
            </div>

            <div className='card-trade'>
                <Button className='buy-button' variant="success">BUY</Button>
                <div className='hero-money'>${hero.info.difficulty}</div>
            </div>
        </div >
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