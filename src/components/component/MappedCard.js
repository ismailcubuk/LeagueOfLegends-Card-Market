import React, { useContext, useState } from 'react'
import CardContext from '../CardContext'
import Modal from 'react-bootstrap/Modal';
import attack from '../../Images/Stats/attack.png'
import defanse from '../../Images/Stats/defanse.png'
import magic from '../../Images/Stats/magic.png'

function MappedCard() {
    const { displayedIChampions } = useContext(CardContext)
    const [story, setStory] = useState("")
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);
    const [getId, setGetId] = useState()
    const [modalPrice, setModalPrice] = useState()
    const [championsId, setChampionsId] = useState("Aatrox")
    const handleClose = () => setShow(false);
    const handleShow = (champID, story, modalPrice) => {
        setChampionsId(champID)
        setStory(story)
        setShow(true);
        setModalPrice(modalPrice)
    }
    const handleHover = (id) => {
        setHover(!hover);
        setGetId(id)
    }
    const [data, setData] = useState("")
    const buyClick = (e) => {
        setData(e.target.value)
    }

    const unFilteredMapped = displayedIChampions.map((hero) => {
        return <div className='hero-border' key={hero.id} id={hero.id}>
            <div className='hero-id'>{hero.id}</div>
            <div className='hero-image' onMouseEnter={() => handleHover(hero.id)} onMouseLeave={() => handleHover(hero.id)} >
                {hover === true && getId === hero.id
                    ? <div className='hero-image-back' onClick={() => handleShow(hero.id, hero.blurb, hero.info.difficulty,)} >
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                        <div className='back-list'>
                            <div className='header-back' >
                                <div className='hero-title'>{hero.title}</div>
                                <div className='info'>
                                    <div>
                                        <img src={attack} alt="" />
                                        <div className='info-img'>{hero.info.attack}</div>
                                    </div>
                                    <div>
                                        <img src={defanse} alt="" />
                                        <div className='info-img'>{hero.info.defense}</div>
                                    </div>
                                    <div>
                                        <img src={magic} alt="" />
                                        <div className='info-img'>{hero.info.magic}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className='hero-image'>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                        <div className='hero-money'>${hero.info.difficulty}</div>
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
                <button className='buy-button' value={hero.id} onClick={buyClick}>BUY</button>

            </div>
        </div >
    })




    const mapped = displayedIChampions.filter(name => name.id.includes(data)).map((hero) => {
        return <div className='hero-border' key={hero.id} id={hero.id}>
            <div className='hero-id'>{hero.id}</div>
            <div className='hero-image' onMouseEnter={() => handleHover(hero.id)} onMouseLeave={() => handleHover(hero.id)} >
                {hover === true && getId === hero.id
                    ? <div className='hero-image-back' onClick={() => handleShow(hero.id, hero.blurb, hero.info.difficulty,)} >
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                        <div className='back-list'>
                            <div className='header-back' >
                                <div className='hero-title'>{hero.title}</div>
                                <div className='info'>
                                    <div>
                                        <img src={attack} alt="" />
                                        <div className='info-img'>{hero.info.attack}</div>
                                    </div>
                                    <div>
                                        <img src={defanse} alt="" />
                                        <div className='info-img'>{hero.info.defense}</div>
                                    </div>
                                    <div>
                                        <img src={magic} alt="" />
                                        <div className='info-img'>{hero.info.magic}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className='hero-image'>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                        <div className='hero-money'>${hero.info.difficulty}</div>
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
                <button className='buy-button' value={hero.id} onClick={buyClick}>BUY</button>

            </div>
        </div >
    })
    return (
        <div className='right-main'>
            <div className='parent'>

                {mapped}
                {unFilteredMapped}
                <Modal show={show} onHide={handleClose} size="xl">
                    <div className='modal-title'>{championsId} </div>
                    <Modal.Body className='modal-body'>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championsId}_0.jpg`} width="100%" height="100%" alt="champions" />
                        <div className='champion-skills'>
                            {getId === ""
                                ? ""
                                : <div className='skill-press'><img src={require(`../../Images/Passive/${championsId}P.png`)} alt="" /><div className='skill-button'>P</div></div>
                            }
                            {getId === ""
                                ? ""
                                : <div className='skill-press'><img src={require(`../../Images/Skills/${championsId}Q.png`)} alt="" /><div className='skill-button'>Q</div></div>
                            }
                            {championsId === ""
                                ? ""
                                : <div className='skill-press'><img src={require(`../../Images/Skills/${championsId}W.png`)} alt="" /><div className='skill-button'>W</div></div>
                            }
                            {championsId === ""
                                ? ""
                                : <div className='skill-press'><img src={require(`../../Images/Skills/${championsId}E.png`)} alt="" /><div className='skill-button'>E</div></div>
                            }
                            {championsId === ""
                                ? ""
                                : <div className='skill-press'><img src={require(`../../Images/Skills/${championsId}R.png`)} alt="" /><div className='skill-button'>R</div></div>
                            }
                        </div>
                        <div className='modal-price'>
                            ${modalPrice}
                        </div>
                        <div className='short-story'>
                            {story}
                        </div>
                    </Modal.Body>
                    <button className='modal-button'>BUY</button>
                </Modal>
            </div>
        </div>
    )
}

export default MappedCard