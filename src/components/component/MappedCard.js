import { Button } from 'react-bootstrap';
import React, { useContext, useState } from 'react'
import CardContext from '../CardContext'
import Modal from 'react-bootstrap/Modal';
import attack from '../../Images/Stats/attack.png'
import defanse from '../../Images/Stats/defanse.png'
import magic from '../../Images/Stats/magic.png'

import AatroxQ from '../../Images/Skills/AatroxQ.png'
import AatroxW from '../../Images/Skills/AatroxW.png'
import AatroxE from '../../Images/Skills/AatroxE.png'
import AatroxR from '../../Images/Skills/AatroxR.png'

function MappedCard() {
    const { displayedIChampions } = useContext(CardContext)

    const [clicked, setHover] = useState(false);
    const [getId, setGetId] = useState()
    const [show, setShow] = useState(false);
    const [championsId, setChampionsId] = useState("")
    const handleClose = () => setShow(false);
    const handleShow = (champID) => {
        setChampionsId(champID)
        setShow(true);
    }

    const handleHover = (id) => {
        setHover(!clicked);
        setGetId(id)
    }

    const mapped = displayedIChampions.map((hero) => {
        return <div className='hero-border' key={hero.id} id={hero.id}>
            <div className='hero-id'>{hero.id}</div>
            <div className='hero-image' onMouseEnter={() => handleHover(hero.id)} onMouseLeave={() => handleHover(hero.id)} >
                {clicked === true && getId === hero.id
                    ? <div className='hero-image-back' >
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
                {console.log(championsId)}
                {console.log("asd", getId)}
                <Button className='buy-button' onClick={() => handleShow(hero.id)} variant="success">BUY</Button>
                <Modal show={show} onHide={handleClose} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title> {getId} </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={`http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championsId}_0.jpg`} alt="champions" />
                        {championsId === "" ? <img src={require(`../../Images/Skills/AatroxQ.png`)} height="100px" width="100px" alt="" /> : <img src={require(`../../Images/Skills/${championsId}Q.png`)} height="100px" width="100px" alt="" />}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
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