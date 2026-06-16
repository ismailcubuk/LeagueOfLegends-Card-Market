import { getChampionBlueEssence } from '../components/component/championPrices';

export const rarityConfig = {
    common: { label: 'Common', color: 'var(--rarity-common)', border: 'rgba(170,180,200,0.5)', glow: 'rgba(170,180,200,0.35)' },
    rare: { label: 'Rare', color: 'var(--rarity-rare)', border: 'rgba(90,160,255,0.6)', glow: 'rgba(90,160,255,0.35)' },
    epic: { label: 'Epic', color: 'var(--rarity-epic)', border: 'rgba(190,110,255,0.6)', glow: 'rgba(190,110,255,0.36)' },
    legendary: { label: 'Legendary', color: 'var(--rarity-legendary)', border: 'rgba(232,196,110,0.75)', glow: 'rgba(232,196,110,0.36)' },
    mythic: { label: 'Mythic', color: 'var(--rarity-mythic)', border: 'rgba(255,110,120,0.7)', glow: 'rgba(255,110,120,0.36)' },
};

export const rarityWeight = {
    mythic: 5,
    legendary: 4,
    epic: 3,
    rare: 2,
    common: 1,
};

export function scoreChampion(champion) {
    return champion.info.attack + champion.info.defense + champion.info.magic + champion.info.difficulty;
}

export function rarityFor(champion) {
    const price = getChampionBlueEssence(champion);

    if (price >= 6300) {
        return 'mythic';
    }

    if (price >= 4800) {
        return 'legendary';
    }

    if (price >= 3150) {
        return 'epic';
    }

    if (price >= 1350) {
        return 'rare';
    }

    return 'common';
}
