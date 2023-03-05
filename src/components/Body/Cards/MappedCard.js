import './Cards.css';
import React, { useContext, useState } from 'react'
import CardContext from '../../component/CardContext'
import Modal from 'react-bootstrap/Modal';
import attack from '../../../Images/Stats/attack.png'
import defanse from '../../../Images/Stats/defanse.png'
import magic from '../../../Images/Stats/magic.png'
import Alert from '../Alert/Alert';

function MappedCard() {
    const { displayedIChampions, myCardsArr, buyClick, sellClick, handleChange, isSearch } = useContext(CardContext)
    const [story, setStory] = useState("")
    const [show, setShow] = useState(false);
    const [modalPrice, setModalPrice] = useState()
    const [championsId, setChampionsId] = useState("")
    const handleClose = () => setShow(false);
    const handleShow = (champID, story, modalPrice) => {
        setChampionsId(champID)
        setStory(story)
        setShow(true);
        setModalPrice(modalPrice)
    }

    const myCards = myCardsArr.map((req) => {
        return <div className='hero-border' key={req.id} id={req.id}>
            <div className='hero-id'>{req.id}</div>
            <div className='hero-image'>
                {/* back */}
                <div className="flip-card" onClick={() => handleShow(req.id, req.blurb, req.info.difficulty)}>
                    <div className="flip-card-inner">
                        <div className='hero-image-back'  >
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${req.id}_0.jpg`} alt="champions" />
                            <div className='back-list'>
                                <div className='header-back' >
                                    <div className='hero-title'>{req.title}</div>
                                    <div className='info'>
                                        <div>
                                            <img src={attack} alt="" />
                                            <div className='info-img'>{req.info.attack}</div>
                                        </div>
                                        <div>
                                            <img src={defanse} alt="" />
                                            <div className='info-img'>{req.info.defense}</div>
                                        </div>
                                        <div>
                                            <img src={magic} alt="" />
                                            <div className='info-img'>{req.info.magic}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='hero-image'>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${req.id}_0.jpg`} alt="champions" />
                            <div className='hero-money'>${req.info.difficulty}</div>
                            <div className='hero-tags'>
                                {(req.tags).map(
                                    a => a === "Fighter"
                                        ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" width="40px" height="40px" alt="" />
                                        : a === "Tank" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" width="40px" height="40px" alt="" />
                                            : a === "Mage" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" width="40px" height="40px" alt="" />
                                                : a === "Assassin" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" width="40px" height="40px" alt="" />
                                                    : a === "Marksman" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" width="40px" height="40px" alt="" />
                                                        : a === "Support" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" width="40px" height="40px" alt="" />
                                                            : a)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-trade'>
                <button className='sell-button' onClick={() => sellClick(req)}>SELL</button>
            </div>
        </div>
    })
    const mapped = displayedIChampions.map((hero) => {
        return <div className='hero-border' key={hero.id} id={hero.id}>
            <div className='hero-id'>{hero.id}</div>
            <div className='hero-image'>
                {/* back */}
                <div className="flip-card" onClick={() => handleShow(hero.id, hero.blurb, hero.info.difficulty)}>
                    <div className="flip-card-inner">
                        <div className='hero-image-back'  >
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
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
                        {/* front */}
                        <div className='hero-image'>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${hero.id}_0.jpg`} alt="champions" />
                            <div className='hero-money'>${hero.info.difficulty}</div>
                            <div className='hero-tags'>
                                {(hero.tags).map(
                                    a => a === "Fighter"
                                        ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" width="40px" height="40px" alt="" />
                                        : a === "Tank" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" width="40px" height="40px" alt="" />
                                            : a === "Mage" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" width="40px" height="40px" alt="" />
                                                : a === "Assassin" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" width="40px" height="40px" alt="" />
                                                    : a === "Marksman" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" width="40px" height="40px" alt="" />
                                                        : a === "Support" ? <img src="httpss://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" width="40px" height="40px" alt="" />
                                                            : a)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card-trade'>
                <button className='buy-button' onClick={() => buyClick(hero)}>BUY</button>
            </div>
        </div >
    })
    return (
        <div className='right-main'>
            <div className='search-mobile'>
                {isSearch === true ? <input type="text" spellCheck="false" placeholder='Search Champ..' onChange={handleChange} /> : null}
            </div>
            <div className='parent'>
                <div className='my-cards'>
                    <div className='cards-header'>
                        <h1 className='my-cards-header'>MY CARDS</h1>
                    </div>
                    <div className='mapped-my-cards'>
                        {myCards}
                    </div>
                </div>
                <div className='shop'>
                    <div className='cards-header'>
                        <h1 className='shop-cards-header'>SHOP</h1>
                    </div>
                    <div className='mapped-card'>
                        {mapped}
                    </div>
                </div>
                {championsId !== "" ? <Modal show={show} onHide={handleClose} size="xl">
                    <div className='modal-title'>{championsId} </div>
                    <Modal.Body className='modal-body'>
                        <img src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championsId}_0.jpg`} width="100%" height="100%" alt="champions" />
                        <div className='champion-skills'>
                            <div className='skill-press'>
                                <img src={require(`../../../Images/Passive/${championsId}P.png`)} alt="" />
                                <div className='skill-button'>P</div>
                            </div>
                            <div className='skill-press'>
                                <img src={require(`../../../Images/Skills/${championsId}Q.png`)} alt="" />
                                <div className='skill-button'>Q</div>
                            </div>
                            <div className='skill-press'>
                                <img src={require(`../../../Images/Skills/${championsId}W.png`)} alt="" />
                                <div className='skill-button'>W</div>
                            </div>
                            <div className='skill-press'>
                                <img src={require(`../../../Images/Skills/${championsId}E.png`)} alt="" />
                                <div className='skill-button'>E</div>
                            </div>

                            <div className='skill-press'>
                                <img src={require(`../../../Images/Skills/${championsId}R.png`)} alt="" />
                                <div className='skill-button'>R</div>
                            </div>
                        </div>
                        <div className='modal-price'>
                            ${modalPrice}
                        </div>
                        <div className='short-story'>
                            {story}
                        </div>
                    </Modal.Body>
                </Modal> : null}
                <Alert />
            </div>
        </div>
    )
}

export default MappedCard