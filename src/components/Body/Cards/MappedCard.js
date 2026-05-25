import './Cards.css';
import React, { useContext, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CardContext from '../../component/CardContext';
import attack from '../../../Images/Stats/attack.png';
import defanse from '../../../Images/Stats/defanse.png';
import magic from '../../../Images/Stats/magic.png';
import Alert from '../Alert/Alert';

const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`;

function ChampionCard({ champion, actionLabel, actionClass, onAction, onOpen, roleIcons }) {
    return (
        <article className='hero-border' id={champion.id}>
            <div className='hero-id'>{champion.id}</div>
            <button
                type='button'
                className='flip-card'
                onClick={() => onOpen(champion.id, champion.blurb, champion.info.difficulty)}
                aria-label={`Open ${champion.name} details`}
            >
                <div className='flip-card-inner'>
                    <div className='hero-image-back'>
                        <img src={championLoadingImage(champion.id)} loading='lazy' alt='' />
                        <div className='back-list'>
                            <div className='header-back'>
                                <div className='hero-title'>{champion.title}</div>
                                <div className='info'>
                                    <div>
                                        <img src={attack} alt='Attack' />
                                        <div className='info-img'>{champion.info.attack}</div>
                                    </div>
                                    <div>
                                        <img src={defanse} alt='Defense' />
                                        <div className='info-img'>{champion.info.defense}</div>
                                    </div>
                                    <div>
                                        <img src={magic} alt='Magic' />
                                        <div className='info-img'>{champion.info.magic}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='hero-image'>
                        <img src={championLoadingImage(champion.id)} loading='lazy' alt={champion.name} />
                        <div className='hero-money'>${champion.info.difficulty}</div>
                        <div className='hero-tags'>
                            {champion.tags.map((tag) => (
                                <img key={tag} src={roleIcons[tag]} width='40' height='40' alt={tag} />
                            ))}
                        </div>
                    </div>
                </div>
            </button>
            <div className='card-trade'>
                <button className={actionClass} onClick={() => onAction(champion)}>{actionLabel}</button>
            </div>
        </article>
    );
}

function MappedCard() {
    const {
        displayedIChampions,
        myCardsArr,
        buyClick,
        sellClick,
        handleChange,
        isSearch,
        roleIcons,
    } = useContext(CardContext);
    const [selectedChampion, setSelectedChampion] = useState(null);

    const handleClose = () => setSelectedChampion(null);
    const handleShow = (id, story, price) => {
        setSelectedChampion({ id, story, price });
    };

    return (
        <main className='right-main'>
            <div className='search-mobile'>
                {isSearch ? (
                    <input type='text' spellCheck='false' placeholder='Search champion' onChange={handleChange} />
                ) : null}
            </div>
            <div className='parent'>
                <section className='my-cards' aria-labelledby='my-cards-title'>
                    <div className='cards-header'>
                        <h1 className='my-cards-header' id='my-cards-title'>My Cards</h1>
                    </div>
                    <div className='mapped-my-cards'>
                        {myCardsArr.length > 0 ? (
                            myCardsArr.map((champion) => (
                                <ChampionCard
                                    key={champion.id}
                                    champion={champion}
                                    actionLabel='Sell'
                                    actionClass='sell-button'
                                    onAction={sellClick}
                                    onOpen={handleShow}
                                    roleIcons={roleIcons}
                                />
                            ))
                        ) : (
                            <div className='empty-state'>Your collection is waiting for its first champion.</div>
                        )}
                    </div>
                </section>

                <section className='shop' aria-labelledby='shop-title'>
                    <div className='cards-header'>
                        <h1 className='shop-cards-header' id='shop-title'>Shop</h1>
                    </div>
                    <div className='mapped-card'>
                        {displayedIChampions.length > 0 ? (
                            displayedIChampions.map((champion) => (
                                <ChampionCard
                                    key={champion.id}
                                    champion={champion}
                                    actionLabel='Buy'
                                    actionClass='buy-button'
                                    onAction={buyClick}
                                    onOpen={handleShow}
                                    roleIcons={roleIcons}
                                />
                            ))
                        ) : (
                            <div className='empty-state'>No champions match the current filters.</div>
                        )}
                    </div>
                </section>

                {selectedChampion ? (
                    <Modal show onHide={handleClose} size='xl' centered>
                        <div className='modal-title'>{selectedChampion.id}</div>
                        <Modal.Body className='modal-body'>
                            <img
                                loading='lazy'
                                src={championSplashImage(selectedChampion.id)}
                                width='100%'
                                height='100%'
                                alt={selectedChampion.id}
                            />
                            <div className='champion-skills'>
                                {['P', 'Q', 'W', 'E', 'R'].map((skill) => (
                                    <div className='skill-press' key={skill}>
                                        <img
                                            src={
                                                skill === 'P'
                                                    ? require(`../../../Images/Passive/${selectedChampion.id}P.png`)
                                                    : require(`../../../Images/Skills/${selectedChampion.id}${skill}.png`)
                                            }
                                            alt={`${selectedChampion.id} ${skill}`}
                                        />
                                        <div className='skill-button'>{skill}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='modal-price'>${selectedChampion.price}</div>
                            <div className='short-story'>{selectedChampion.story}</div>
                        </Modal.Body>
                    </Modal>
                ) : null}
                <Alert />
            </div>
        </main>
    );
}

export default MappedCard;
