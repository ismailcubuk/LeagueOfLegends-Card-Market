import { AiOutlineClose } from 'react-icons/ai';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import RarityPill from '../common/RarityPill';
import { championLoadingImage, HEXTECH_CHEST_ICON_URL } from '../../utils/championMedia';
import { rarityConfig, rarityFor } from '../../utils/championMeta';
import { PACK_OPEN_COST } from '../../utils/packOpening';

export default function PackOverlays({ packConfirmOpen, packReward, packModalPreviewChampions, closePackConfirm, handlePackOpen }) {
    return (
        <>
            {packConfirmOpen && !packReward ? (
                <div className='pack-reward-overlay pack-confirm-overlay' aria-live='polite'>
                    <span className='pack-reward-backdrop' onClick={closePackConfirm} />
                    <div className='pack-confirm-stage' role='dialog' aria-modal='true' aria-labelledby='pack-confirm-title'>
                        <span className='pack-confirm-frame' aria-hidden='true' />
                        <span className='pack-confirm-preview' aria-hidden='true'>
                            {packModalPreviewChampions.map((champion) => {
                                const rarity = rarityFor(champion);

                                return (
                                    <span className={`pack-confirm-preview-card rarity-${rarity}`} key={champion.id} style={{ '--preview-color': rarityConfig[rarity].color, '--preview-glow': rarityConfig[rarity].glow }}>
                                        <img src={championLoadingImage(champion.id)} alt='' loading='lazy' draggable='false' />
                                    </span>
                                );
                            })}
                        </span>
                        <button type='button' className='pack-confirm-close' onClick={closePackConfirm} aria-label='Close mystery pack'>
                            <AiOutlineClose />
                        </button>
                        <div className='pack-confirm-header'>
                            <span className='pack-confirm-kicker' id='pack-confirm-title'>Mystery Pack</span>
                            <span className='pack-confirm-chest'>
                                <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                            </span>
                        </div>
                        <button type='button' className='pack-confirm-spin' onClick={handlePackOpen}>
                            <span className='pack-confirm-spin-aura' aria-hidden='true' />
                            <span className='pack-action-label'>Open</span>
                            <span className='pack-action-price'>
                                <span className='wallet-coin'><BlueEssenceIcon /></span>
                                <span>{PACK_OPEN_COST.toLocaleString('tr-TR')}</span>
                            </span>
                        </button>
                    </div>
                </div>
            ) : null}
            {packReward ? (
                <div className='pack-reward-overlay' aria-live='polite'>
                    <span className='pack-reward-backdrop' />
                    <div className={`pack-case-stage phase-${packReward.phase}`}>
                        <div className='pack-case-header'>
                            <span className='pack-case-chest'>
                                <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                            </span>
                            <div>
                                <span>Hextech Chest</span>
                                <strong>{packReward.phase === 'won' ? 'Kazanan kart' : packReward.phase === 'flying' ? 'Koleksiyona ekleniyor' : 'Kasa aÃ§Ä±lÄ±yor'}</strong>
                            </div>
                        </div>
                        <div className='pack-roulette-window'>
                            <span className='pack-roulette-marker' aria-hidden='true' />
                            <div className='pack-roulette-track' style={{ '--winner-offset': `${packReward.winnerIndex * 144 + 66}px` }}>
                                {packReward.items.map((item) => {
                                    const rarity = rarityFor(item.champion);

                                    return (
                                        <article className={`pack-roulette-card rarity-${rarity} ${item.isWinner ? 'is-winner' : ''}`} key={item.key}>
                                            <img src={championLoadingImage(item.champion.id)} alt='' />
                                            <span className='pack-roulette-card-shade' />
                                            <span className='pack-roulette-card-name'>{item.champion.name}</span>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='pack-winner-panel'>
                            <article className={`pack-winner-card rarity-${rarityFor(packReward.champion)}`} style={{ '--pack-flight-x': packReward['--pack-flight-x'] || '0px', '--pack-flight-y': packReward['--pack-flight-y'] || '0px' }}>
                                <img src={championLoadingImage(packReward.champion.id)} alt={packReward.champion.name} />
                                <span className='pack-reward-shine' />
                                <span className='pack-reward-content'>
                                    <RarityPill rarity={rarityFor(packReward.champion)} />
                                    <strong>{packReward.champion.name}</strong>
                                    <span>{packReward.champion.title}</span>
                                </span>
                            </article>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
