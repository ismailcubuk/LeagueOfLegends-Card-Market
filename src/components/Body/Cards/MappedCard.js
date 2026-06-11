import './Cards.css';
import React, { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import CardContext from '../../component/CardContext';
import { BLUE_ESSENCE_ICON_URL, getChampionBlueEssence } from '../../component/championPrices';
import attack from '../../../Images/Stats/attack.png';
import defanse from '../../../Images/Stats/defanse.png';
import magic from '../../../Images/Stats/magic.png';
import Alert from '../Alert/Alert';
import Pagination from '../Pagination/Pagination';

const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`;

function PriceAmount({ value }) {
    return (
        <span className='price-amount'>
            <span>{value.toLocaleString()}</span>
            <img className='blue-essence-icon' src={BLUE_ESSENCE_ICON_URL} alt='' aria-hidden='true' />
        </span>
    );
}

function ChampionCard({ champion, actionLabel, actionClass, onAction, onOpen, onPreview, roleIcons, statusClass = '' }) {
    const blueEssence = getChampionBlueEssence(champion);

    return (
        <article
            className={`hero-border ${statusClass}`.trim()}
            id={champion.id}
            onMouseEnter={() => onPreview(champion.id)}
            onFocus={() => onPreview(champion.id)}
            onTouchStart={() => onPreview(champion.id)}
        >
            <div className='hero-id'>{champion.id}</div>
            <button
                type='button'
                className='flip-card'
                onClick={onOpen}
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
                        <div className='hero-money'><PriceAmount value={blueEssence} /></div>
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
        addToCart,
        cartItems,
        cartTotal,
        cartMissingBalance,
        checkoutCart,
        clearCart,
        removeFromCart,
        sellClick,
        handleChange,
        isSearch,
        roleIcons,
        recentlyBoughtId,
        recentlySoldId,
        deniedChampionId,
        openChampionModal,
        closeChampionModal,
        preloadChampionDetails,
        selectedChampion,
        selectedChampionSkills,
    } = useContext(CardContext);

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
                                    onOpen={() => openChampionModal(champion)}
                                    onPreview={preloadChampionDetails}
                                    roleIcons={roleIcons}
                                    statusClass={recentlyBoughtId === champion.id ? 'is-new-card' : ''}
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
                    <div className='legacy-cart-panel'>
                        <div className='legacy-cart-summary'>
                            <strong>Cart: {cartItems.length} cards</strong>
                            <span>Total: <PriceAmount value={cartTotal} /></span>
                        </div>
                        <div className='legacy-cart-actions'>
                            <button type='button' onClick={checkoutCart} disabled={cartItems.length === 0 || cartMissingBalance > 0}>Buy All</button>
                            <button type='button' onClick={clearCart} disabled={cartItems.length === 0}>Clear</button>
                        </div>
                        {cartItems.length > 0 ? (
                            <div className='legacy-cart-items'>
                                {cartItems.map((champion) => (
                                    <button type='button' key={champion.id} onClick={() => removeFromCart(champion.id)}>
                                        {champion.name}
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    <div className='mapped-card'>
                        {displayedIChampions.length > 0 ? (
                            displayedIChampions.map((champion) => {
                                const inCart = cartItems.some((item) => item.id === champion.id);

                                return (
                                    <ChampionCard
                                        key={champion.id}
                                        champion={champion}
                                        actionLabel={inCart ? 'Added' : 'Cart'}
                                        actionClass={`buy-button ${inCart ? 'is-in-cart' : ''}`}
                                        onAction={inCart ? () => removeFromCart(champion.id) : addToCart}
                                        onOpen={() => openChampionModal(champion)}
                                        onPreview={preloadChampionDetails}
                                        roleIcons={roleIcons}
                                        statusClass={[
                                            recentlySoldId === champion.id ? 'is-new-card' : '',
                                            deniedChampionId === champion.id ? 'is-denied-card' : '',
                                        ].filter(Boolean).join(' ')}
                                    />
                                );
                            })
                        ) : (
                            <div className='empty-state'>No champions match the current filters.</div>
                        )}
                    </div>
                    <Pagination />
                </section>

                {selectedChampion ? (
                    <Modal show onHide={closeChampionModal} size='xl' centered>
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
                                {selectedChampionSkills.length > 0 ? selectedChampionSkills.map((skill) => (
                                    <div className='skill-press' key={skill.key}>
                                        <img src={skill.src} alt={skill.name} />
                                        <div className='skill-button'>{skill.key}</div>
                                    </div>
                                )) : ['P', 'Q', 'W', 'E', 'R'].map((skill) => (
                                    <div className='skill-press skill-loading' key={skill}>
                                        <div className='skill-button'>{skill}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='modal-price'><PriceAmount value={selectedChampion.price} /></div>
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
