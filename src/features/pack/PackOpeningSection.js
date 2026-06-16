import { useMemo } from 'react';
import BlueEssenceIcon from '../../components/common/BlueEssenceIcon';
import { championLoadingImage, HEXTECH_CHEST_ICON_URL } from '../../utils/championMedia';
import { rarityConfig, rarityFor } from '../../utils/championMeta';
import { PACK_OPEN_COST, PACK_PREVIEW_CHAMPION_IDS, PACK_RARITY_CHANCES } from '../../utils/packOpening';

export default function PackOpeningSection({ champions, ownedChampions, onOpenPack, isOpening, money }) {
    const availableCount = champions.filter((champion) => !ownedChampions.some((owned) => owned.id === champion.id)).length;
    const packPreviewChampions = useMemo(() => {
        return PACK_PREVIEW_CHAMPION_IDS
            .map((id) => champions.find((champion) => champion.id === id))
            .filter(Boolean);
    }, [champions]);
    const canAfford = money >= PACK_OPEN_COST;
    const disabled = isOpening || champions.length === 0 || !canAfford;

    return (
        <section className='pack-opening-section' aria-labelledby='pack-opening-title'>
            <button type='button' className={`pack-opening-card ${isOpening ? 'is-opening' : ''} ${!canAfford ? 'is-locked' : ''}`} onClick={onOpenPack} disabled={disabled}>
                <span className='pack-opening-aura' aria-hidden='true' />
                <span className='pack-opening-preview' aria-hidden='true'>
                    {packPreviewChampions.map((champion) => {
                        const rarity = rarityFor(champion);

                        return (
                            <span
                                className={`pack-opening-preview-card rarity-${rarity}`}
                                key={champion.id}
                                style={{
                                    '--preview-color': rarityConfig[rarity].color,
                                    '--preview-glow': rarityConfig[rarity].glow,
                                }}
                            >
                                <img src={championLoadingImage(champion.id)} alt='' loading='lazy' draggable='false' />
                            </span>
                        );
                    })}
                </span>
                <span className='pack-opening-seal'>
                    <img src={HEXTECH_CHEST_ICON_URL} alt='' aria-hidden='true' />
                </span>
                <span className='pack-opening-copy'>
                    <span className='pack-opening-kicker'>Champion Pack</span>
                    <strong id='pack-opening-title'>Open a Mystery Pack</strong>
                    <span className='pack-opening-status'>{availableCount > 0 ? `${availableCount} champions waiting` : 'Duplicate protection active'}</span>
                    <span className='pack-opening-odds' aria-label='Pack drop chances'>
                        {PACK_RARITY_CHANCES.map((item) => (
                            <span key={item.rarity} style={{ '--odds-color': rarityConfig[item.rarity].color }}>
                                {rarityConfig[item.rarity].label} {item.chance}%
                            </span>
                        ))}
                    </span>
                </span>
                <span className='pack-opening-action'>
                    {isOpening ? <span className='pack-action-label'>Opening</span> : null}
                    {!isOpening ? (
                        <span className='pack-action-price'>
                            <span className='wallet-coin'>
                                <BlueEssenceIcon />
                            </span>
                            <span>{PACK_OPEN_COST.toLocaleString('tr-TR')}</span>
                        </span>
                    ) : null}
                </span>
            </button>
        </section>
    );
}


