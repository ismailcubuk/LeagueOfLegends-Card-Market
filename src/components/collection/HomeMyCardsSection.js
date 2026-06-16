import { BsCollection } from 'react-icons/bs';
import { championLoadingImage } from '../../utils/championMedia';
import { rarityConfig, rarityFor } from '../../utils/championMeta';

export default function HomeMyCardsSection({ ownedChampions, openChampionModal, targetRef, impactRarity }) {
    return (
        <section className={`home-my-cards-section ${impactRarity ? `is-rarity-impacting impact-${impactRarity}` : ''}`} aria-label='Recently Opened Cards' ref={targetRef}>
            <div className='section-heading home-my-cards-heading'>
                <div>
                    <span><BsCollection />Recently Opened Cards</span>
                </div>
                <span className='home-my-cards-count'>{ownedChampions.length}/10 Shown</span>
            </div>

            {ownedChampions.length > 0 ? (
                <div className='home-my-cards-grid'>
                    {ownedChampions.map((champion, index) => {
                        const rarity = rarityFor(champion);

                        return (
                            <article
                                key={champion.id}
                                className={`home-my-card rarity-${rarity} ${index === 0 ? 'is-new-recent-card' : ''}`}
                                style={{
                                    '--my-card-rarity-color': rarityConfig[rarity].color,
                                    '--my-card-rarity-glow': rarityConfig[rarity].glow,
                                }}
                            >
                                <button
                                    type='button'
                                    className='home-my-card-preview'
                                    onClick={() => openChampionModal(champion)}
                                    aria-label={`Preview ${champion.name}`}
                                >
                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                    <span className='home-my-card-shade' />
                                    <span className='home-my-card-rarity'>{rarityConfig[rarity].label}</span>
                                    <span className='home-my-card-copy'>
                                        <strong>{champion.name}</strong>
                                        <small>{champion.tags?.[0] || 'Champion'}</small>
                                    </span>
                                </button>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className='home-my-cards-empty'>
                    <BsCollection />
                    <p>Your collection is waiting for its first champion.</p>
                </div>
            )}
        </section>
    );
}

