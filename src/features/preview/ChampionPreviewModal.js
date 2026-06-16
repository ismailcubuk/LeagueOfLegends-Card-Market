import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai';
import { MapPin } from 'lucide-react';
import PriceAmount from '../../components/common/PriceAmount';
import { championLoadingImage, championSplashImage } from '../../utils/championMedia';
import { rarityFor } from '../../utils/championMeta';

export default function ChampionPreviewModal({
    selectedChampion,
    selectedChampionOwned,
    selectedChampionInCart,
    selectedChampionDetails,
    selectedChampionSkills,
    selectedSkinNum,
    setSelectedSkinNum,
    activePreviewTab,
    setActivePreviewTab,
    previewTabs,
    previewStats,
    closeChampionModal,
    addToCart,
    roleIcons,
    ResourceIcon,
    selectedChampionOrigin,
    selectedChampionOriginImage,
    sameOriginChampions,
    openChampionModal,
    preloadChampionDetails,
}) {
    if (!selectedChampion) return null;

    return (
        <Modal show onHide={closeChampionModal} size='xl' centered dialogClassName='champion-preview-dialog' contentClassName='champion-preview-content'>
            <Modal.Body className='modal-body'>
                <button type='button' className='champion-preview-close' onClick={closeChampionModal} aria-label='Close preview'>
                    <AiOutlineClose />
                </button>
                <div className={`champion-preview rarity-${rarityFor(selectedChampion)} ${selectedChampionOwned ? 'is-owned-preview' : ''}`}>
                    <div className='champion-preview-art'>
                        <img loading='lazy' src={championSplashImage(selectedChampion.id, selectedSkinNum)} alt={selectedChampion.name} />
                        <div className='champion-preview-owned-glow' />
                        <div className='champion-preview-art-shade' />
                        <div className='champion-preview-frame' />
                        <div className='champion-preview-title'>
                            <span>{selectedChampion.tags?.join(' / ') || selectedChampion.partype || 'Champion'}</span>
                            <h2>{selectedChampion.name}</h2>
                            <p>{selectedChampion.title}</p>
                        </div>
                    </div>

                    <aside className='champion-preview-panel'>
                        <div className='champion-preview-header'>
                            <div>
                                <span className='champion-preview-kicker'>Champion Preview</span>
                                <h3>{selectedChampion.name}</h3>
                            </div>
                            {selectedChampionOwned ? (
                                <div className='champion-preview-showcase-control'>
                                    <div>
                                        <span>In Collection</span>
                                        <PriceAmount value={selectedChampion.price} />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type='button'
                                    className='champion-preview-price'
                                    onClick={() => addToCart(selectedChampion)}
                                    disabled={selectedChampionInCart}
                                >
                                    <span>{selectedChampionInCart ? 'In Cart' : 'Add to Cart'}</span>
                                    <PriceAmount value={selectedChampion.price} />
                                </button>
                            )}
                        </div>

                        <div className='champion-preview-tabs' role='tablist' aria-label='Champion preview sections'>
                            {previewTabs.map((tab) => (
                                <button
                                    type='button'
                                    key={tab.key}
                                    className={activePreviewTab === tab.key ? 'active' : ''}
                                    onClick={() => setActivePreviewTab(tab.key)}
                                    role='tab'
                                    aria-selected={activePreviewTab === tab.key}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className='champion-preview-tab-panel'>
                            {activePreviewTab === 'overview' ? (
                                <>
                                    <div className='champion-preview-meta-grid'>
                                        {(selectedChampion.tags || []).map((tag) => (
                                            <div className='champion-preview-meta' key={tag}>
                                                {roleIcons[tag] ? <img src={roleIcons[tag]} alt='' /> : null}
                                                <span>{tag}</span>
                                            </div>
                                        ))}
                                        <div className='champion-preview-meta'>
                                            <ResourceIcon size={18} strokeWidth={2.4} aria-hidden='true' />
                                            <span>{selectedChampion.partype || 'No Resource'}</span>
                                        </div>
                                        {!selectedChampionOriginImage ? (
                                            <div className='champion-preview-meta'>
                                                <MapPin size={18} strokeWidth={2.4} aria-hidden='true' />
                                                <span>{selectedChampionOrigin}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                    {selectedChampionOriginImage ? (
                                        <div className='champion-preview-origin-block'>
                                            <div className='champion-preview-origin-card'>
                                                <img src={selectedChampionOriginImage} alt={`${selectedChampionOrigin} region`} loading='lazy' />
                                                <span>
                                                    {selectedChampionOrigin}
                                                </span>
                                            </div>
                                            {sameOriginChampions.length > 0 ? (
                                                <div className='same-origin-roster' aria-label={`${selectedChampionOrigin} champions`}>
                                                    {sameOriginChampions.map((champion) => (
                                                        <button
                                                            type='button'
                                                            key={champion.id}
                                                            className={champion.id === selectedChampion.id ? 'active' : ''}
                                                            onClick={() => openChampionModal(champion)}
                                                            onMouseEnter={() => preloadChampionDetails(champion.id)}
                                                            aria-label={`Preview ${champion.name}`}
                                                        >
                                                            <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                                            <span>{champion.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}

                                    <div className='champion-preview-stats'>
                                        {previewStats.map((stat) => {
                                            const value = selectedChampion.info?.[stat.key] || 0;
                                            const StatIcon = stat.icon;

                                            return (
                                            <div className={`preview-stat-row stat-${stat.tone} ${value >= 10 ? 'is-complete' : ''}`} key={stat.label}>
                                                <div className='preview-stat-heading'>
                                                    <span>
                                                        <StatIcon size={15} strokeWidth={2.3} aria-hidden='true' />
                                                        {stat.label}
                                                    </span>
                                                    <strong>
                                                        <b>{value}</b>
                                                        <span>/10</span>
                                                    </strong>
                                                </div>
                                                <div className='preview-stat-track'>
                                                    <i className={`tone-${stat.tone}`} style={{ width: `${Math.min(Math.max(value * 10, 0), 100)}%` }} />
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : null}

                            {activePreviewTab === 'abilities' ? (
                                <section className='preview-section preview-section-flush'>
                                    <div className='preview-section-title'>Abilities</div>
                                    <div className='preview-abilities'>
                                        {selectedChampionSkills.length > 0 ? selectedChampionSkills.map((skill) => (
                                            <article className='preview-ability' key={skill.key}>
                                                <div className='preview-ability-icon'>
                                                    <img src={skill.src} alt={skill.name} />
                                                    <span>{skill.key}</span>
                                                </div>
                                                <div>
                                            <div className='preview-ability-heading'>
                                                <h4>{skill.name}</h4>
                                            </div>
                                                    {skill.description ? <p>{skill.description}</p> : null}
                                                </div>
                                            </article>
                                        )) : ['P', 'Q', 'W', 'E', 'R'].map((skill) => (
                                            <div className='preview-ability preview-ability-loading' key={skill}>
                                                <div className='preview-ability-icon'>
                                                    <span>{skill}</span>
                                                </div>
                                                <div>
                                                    <h4>Loading</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ) : null}

                            {activePreviewTab === 'lore' ? (
                                <section className='preview-section preview-section-flush'>
                                    <div className='preview-section-title'>Lore</div>
                                    <p className='preview-lore preview-lore-full'>{selectedChampionDetails?.lore || selectedChampion.story}</p>
                                </section>
                            ) : null}

                            {activePreviewTab === 'skins' ? (
                                <section className='preview-section preview-section-flush'>
                                    <div className='preview-section-head'>
                                        <div className='preview-section-title'>Skins</div>
                                        <span>{selectedChampionDetails?.skins?.length || 1} looks</span>
                                    </div>
                                    <div className='preview-skins preview-skins-grid'>
                                        {(selectedChampionDetails?.skins || [{ num: 0, name: selectedChampion.name }]).map((skin) => (
                                            <button
                                                type='button'
                                                key={skin.id || skin.num}
                                                className={`preview-skin ${selectedSkinNum === skin.num ? 'active' : ''}`}
                                                onClick={() => setSelectedSkinNum(skin.num)}
                                            >
                                                <img src={championSplashImage(selectedChampion.id, skin.num)} alt={skin.name} loading='lazy' />
                                                <span>{skin.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </Modal.Body>
        </Modal>
    );
}

