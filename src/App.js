import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useMemo, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {
    AiOutlineArrowDown,
    AiOutlineArrowUp,
    AiOutlineClose,
    AiOutlineHeart,
    AiOutlineLeft,
    AiOutlinePlayCircle,
    AiOutlineRight,
    AiOutlineSearch,
    AiOutlineShoppingCart,
    AiOutlineStar,
} from 'react-icons/ai';
import { BsCollection, BsGrid3X3Gap, BsWallet2 } from 'react-icons/bs';
import CardContext from './components/component/CardContext';
import Alert from './components/Body/Alert/Alert';
import Pagination from './components/Body/Pagination/Pagination';

const LOL_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/lol_icon.png';
const championLoadingImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`;
const championSplashImage = (id) => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`;

const roles = ['Fighter', 'Tank', 'Mage', 'Assassin', 'Marksman', 'Support'];

function scoreChampion(champion) {
    return champion.info.attack + champion.info.defense + champion.info.magic + champion.info.difficulty;
}

function rarityFor(champion) {
    const score = scoreChampion(champion);

    if (score >= 29) {
        return 'mythic';
    }

    if (score >= 25) {
        return 'legendary';
    }

    if (score >= 21) {
        return 'epic';
    }

    if (score >= 16) {
        return 'rare';
    }

    return 'common';
}

function ChampionCard({ champion, owned = false, onAction, onOpen, roleIcons }) {
    const rarity = rarityFor(champion);

    return (
        <article className={`market-card rarity-${rarity}`}>
            <button type='button' className='market-card-media' onClick={() => onOpen(champion)} aria-label={`${champion.name} details`}>
                <img src={championLoadingImage(champion.id)} alt={champion.name} loading='lazy' />
                <span className='market-card-price'>${champion.info.difficulty}</span>
                <span className='market-card-rarity'>{rarity}</span>
            </button>
            <div className='market-card-body'>
                <div>
                    <h3>{champion.name}</h3>
                    <p>{champion.title}</p>
                </div>
                <div className='market-card-roles'>
                    {champion.tags.map((tag) => (
                        <img key={tag} src={roleIcons[tag]} alt={tag} title={tag} />
                    ))}
                </div>
                <div className='stat-row'>
                    <span>ATK {champion.info.attack}</span>
                    <span>DEF {champion.info.defense}</span>
                    <span>MAG {champion.info.magic}</span>
                </div>
                <button type='button' className={owned ? 'sell-action' : 'buy-action'} onClick={() => onAction(champion)}>
                    {owned ? 'Sell Card' : 'Buy Card'}
                </button>
            </div>
        </article>
    );
}

function HeroStat({ label, value, tone }) {
    return (
        <div className='hero-stat'>
            <span>{label}</span>
            <div className='hero-stat-track'>
                <i style={{ width: `${Math.max(value, 1) * 10}%` }} className={`tone-${tone}`} />
            </div>
            <strong>{value}</strong>
        </div>
    );
}

function App() {
    const {
        money,
        filtered,
        displayedIChampions,
        myCardsArr,
        buyClick,
        sellClick,
        search,
        clearSearch,
        handleChange,
        roleIcons,
        allRoleCLick,
        fighterClick,
        tankClick,
        mageClick,
        assassinClick,
        marksmanClick,
        supportClick,
        filterUpMoneyClick,
        filterDownMoneyClick,
        unFilteredMoneyClick,
        openChampionModal,
        closeChampionModal,
        preloadChampionDetails,
        selectedChampion,
        selectedChampionSkills,
        totalPage,
    } = useContext(CardContext);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);

    const roleActions = {
        Fighter: fighterClick,
        Tank: tankClick,
        Mage: mageClick,
        Assassin: assassinClick,
        Marksman: marksmanClick,
        Support: supportClick,
    };

    const featured = useMemo(() => (
        [...filtered].sort((a, b) => scoreChampion(b) - scoreChampion(a)).slice(0, 4)
    ), [filtered]);

    const trending = useMemo(() => (
        [...filtered].sort((a, b) => b.info.difficulty - a.info.difficulty || b.info.magic - a.info.magic).slice(0, 8)
    ), [filtered]);

    const totalOwnedValue = myCardsArr.reduce((sum, champion) => sum + champion.info.difficulty, 0);
    const selectedRoleNames = Array.from(new Set(filtered.flatMap((champion) => champion.tags)));
    const heroChampion = featured.length > 0 ? featured[activeHeroIndex % featured.length] : null;

    const showPrevHero = () => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => (index - 1 + featured.length) % featured.length);
    };

    const showNextHero = () => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => (index + 1) % featured.length);
    };

    useEffect(() => {
        if (featured.length === 0) {
            return;
        }

        setActiveHeroIndex((index) => index % featured.length);
    }, [featured.length]);

    useEffect(() => {
        if (featured.length < 2) {
            return undefined;
        }

        const interval = window.setInterval(() => {
            setActiveHeroIndex((index) => (index + 1) % featured.length);
        }, 3000);

        return () => window.clearInterval(interval);
    }, [featured.length]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'ArrowLeft') {
                showPrevHero();
            }

            if (event.key === 'ArrowRight') {
                showNextHero();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    });

    const filters = (
        <aside className='filter-panel'>
            <div className='panel-title'>
                <BsGrid3X3Gap />
                <span>Filters</span>
            </div>
            <div className='filter-group'>
                <button type='button' onClick={allRoleCLick}>All Roles</button>
                {roles.map((role) => (
                    <button type='button' key={role} onClick={roleActions[role]}>
                        <img src={roleIcons[role]} alt='' />
                        {role}
                    </button>
                ))}
            </div>
            <div className='filter-group'>
                <button type='button' onClick={filterUpMoneyClick}><AiOutlineArrowUp /> Price High</button>
                <button type='button' onClick={unFilteredMoneyClick}>Default Order</button>
                <button type='button' onClick={filterDownMoneyClick}><AiOutlineArrowDown /> Price Low</button>
            </div>
        </aside>
    );

    return (
        <div className='market-shell'>
            <nav className='topbar'>
                <div className='brand'>
                    <img src={LOL_ICON_URL} alt='League of Legends' />
                    <span>Nexus Card Market</span>
                </div>
                <label className='top-search'>
                    <AiOutlineSearch />
                    <input type='text' spellCheck='false' placeholder='Search champion' value={search} onChange={handleChange} />
                    {search ? (
                        <button type='button' onClick={clearSearch} aria-label='Clear search'>
                            <AiOutlineClose />
                        </button>
                    ) : null}
                </label>
                <div className='wallet-pill'>
                    <BsWallet2 />
                    <span>${money}</span>
                </div>
            </nav>

            <main className='market-main'>
                {heroChampion ? (
                    <section className={`hero-section rarity-${rarityFor(heroChampion)}`}>
                        <img className='hero-bg' src={championSplashImage(heroChampion.id)} alt='' />
                        <div className='hero-shade' />
                        <button type='button' className='hero-nav hero-nav-left' onClick={showPrevHero} aria-label='Previous featured champion'>
                            <AiOutlineLeft />
                        </button>
                        <button type='button' className='hero-nav hero-nav-right' onClick={showNextHero} aria-label='Next featured champion'>
                            <AiOutlineRight />
                        </button>
                        <div className='hero-content'>
                            <div className='hero-meta'>
                                <span className='hero-rarity'>{rarityFor(heroChampion)}</span>
                                <span>Featured</span>
                                <span>{heroChampion.tags[0]}</span>
                            </div>
                            <h1>{heroChampion.name}</h1>
                            <h2>{heroChampion.title}</h2>
                            <p>{heroChampion.blurb}</p>
                            <div className='hero-stats'>
                                <HeroStat label='Attack' value={heroChampion.info.attack} tone='attack' />
                                <HeroStat label='Magic' value={heroChampion.info.magic} tone='magic' />
                                <HeroStat label='Defense' value={heroChampion.info.defense} tone='defense' />
                                <HeroStat label='Difficulty' value={heroChampion.info.difficulty} tone='difficulty' />
                            </div>
                            <div className='hero-actions'>
                                <button type='button' className='hero-unlock' onClick={() => buyClick(heroChampion)}>
                                    <AiOutlineShoppingCart />
                                    Unlock / ${heroChampion.info.difficulty}
                                </button>
                                <button type='button' className='hero-preview' onMouseEnter={() => preloadChampionDetails(heroChampion.id)} onClick={() => openChampionModal(heroChampion)}>
                                    <AiOutlinePlayCircle />
                                    Preview
                                </button>
                                <button type='button' className='hero-like' onClick={() => openChampionModal(heroChampion)} aria-label={`Preview ${heroChampion.name}`}>
                                    <AiOutlineHeart />
                                </button>
                            </div>
                        </div>
                        <div className='hero-dots'>
                            {featured.map((champion, index) => (
                                <button
                                    type='button'
                                    key={champion.id}
                                    className={index === activeHeroIndex % featured.length ? 'active' : ''}
                                    onClick={() => setActiveHeroIndex(index)}
                                    aria-label={`Show ${champion.name}`}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                <section className='collection-strip' id='collection'>
                    <div className='collection-card'>
                        <BsCollection />
                        <div>
                            <span>Owned Cards</span>
                            <strong>{myCardsArr.length}</strong>
                        </div>
                    </div>
                    <div className='collection-card'>
                        <AiOutlineStar />
                        <div>
                            <span>Collection Value</span>
                            <strong>${totalOwnedValue}</strong>
                        </div>
                    </div>
                    <div className='collection-card'>
                        <AiOutlineShoppingCart />
                        <div>
                            <span>Market Cards</span>
                            <strong>{filtered.length}</strong>
                        </div>
                    </div>
                </section>

                <section className='trending-section'>
                    <div className='section-heading'>
                        <span>Trending</span>
                        <h2>High demand champions</h2>
                    </div>
                    <div className='trending-track'>
                        {trending.map((champion) => (
                            <button type='button' key={champion.id} onMouseEnter={() => preloadChampionDetails(champion.id)} onClick={() => openChampionModal(champion)}>
                                <img src={championSplashImage(champion.id)} alt={champion.name} loading='lazy' />
                                <span>{champion.name}</span>
                                <strong>${champion.info.difficulty}</strong>
                            </button>
                        ))}
                    </div>
                </section>

                <section className='shop-layout' id='marketplace'>
                    {filters}
                    <div className='shop-content'>
                        <div className='section-heading shop-heading'>
                            <div>
                                <span>Marketplace</span>
                                <h2>Champion cards</h2>
                            </div>
                            <button type='button' className='mobile-filter-toggle' onClick={() => setMobileFiltersOpen(true)}>
                                Filters
                            </button>
                        </div>
                        <div className='role-summary'>
                            {selectedRoleNames.slice(0, 6).map((role) => (
                                <span key={role}>{role}</span>
                            ))}
                        </div>
                        <div className='market-grid'>
                            {displayedIChampions.map((champion) => (
                                <ChampionCard
                                    key={champion.id}
                                    champion={champion}
                                    onAction={buyClick}
                                    onOpen={openChampionModal}
                                    roleIcons={roleIcons}
                                />
                            ))}
                        </div>
                        {displayedIChampions.length === 0 ? (
                            <div className='empty-market'>No champions match this search.</div>
                        ) : null}
                        {totalPage > 1 ? <Pagination /> : null}
                    </div>
                </section>

                <section className='owned-grid'>
                    <div className='section-heading'>
                        <span>Collection</span>
                        <h2>My cards</h2>
                    </div>
                    <div className='market-grid market-grid-owned'>
                        {myCardsArr.map((champion) => (
                            <ChampionCard
                                key={champion.id}
                                champion={champion}
                                owned
                                onAction={sellClick}
                                onOpen={openChampionModal}
                                roleIcons={roleIcons}
                            />
                        ))}
                    </div>
                    {myCardsArr.length === 0 ? (
                        <div className='empty-market'>Your collection is waiting for its first champion.</div>
                    ) : null}
                </section>
            </main>

            {mobileFiltersOpen ? (
                <div className='mobile-filter-drawer' onClick={() => setMobileFiltersOpen(false)}>
                    <div onClick={(event) => event.stopPropagation()}>
                        <button type='button' className='drawer-close' onClick={() => setMobileFiltersOpen(false)}>
                            <AiOutlineClose />
                        </button>
                        {filters}
                    </div>
                </div>
            ) : null}

            {selectedChampion ? (
                <Modal show onHide={closeChampionModal} size='xl' centered>
                    <div className='modal-title'>{selectedChampion.id}</div>
                    <Modal.Body className='modal-body'>
                        <img loading='lazy' src={championSplashImage(selectedChampion.id)} width='100%' height='100%' alt={selectedChampion.id} />
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
                        <div className='modal-price'>${selectedChampion.price}</div>
                        <div className='short-story'>{selectedChampion.story}</div>
                    </Modal.Body>
                </Modal>
            ) : null}

            <Alert />
        </div>
    );
}

export default App;
