import { rarityFor } from './championMeta';

export const PACK_OPEN_COST = 1350;

export const PACK_RARITY_CHANCES = [
    { rarity: 'common', chance: 40 },
    { rarity: 'rare', chance: 30 },
    { rarity: 'epic', chance: 18 },
    { rarity: 'legendary', chance: 9 },
    { rarity: 'mythic', chance: 3 },
];

export const PACK_PREVIEW_CHAMPION_IDS = ['Zed', 'Yasuo', 'Jinx', 'Yone'];
export const PACK_MODAL_PREVIEW_COUNT = 12;

export function pickPackChampion(champions) {
    const pools = PACK_RARITY_CHANCES.reduce((groups, item) => ({
        ...groups,
        [item.rarity]: champions.filter((champion) => rarityFor(champion) === item.rarity),
    }), {});
    const activeChances = PACK_RARITY_CHANCES.filter((item) => pools[item.rarity].length > 0);
    const totalChance = activeChances.reduce((total, item) => total + item.chance, 0);
    let roll = Math.random() * totalChance;
    const selectedChance = activeChances.find((item) => {
        roll -= item.chance;
        return roll <= 0;
    }) || activeChances[activeChances.length - 1];
    const selectedPool = pools[selectedChance.rarity];

    return selectedPool[Math.floor(Math.random() * selectedPool.length)];
}

export function uniqueChampionsById(champions) {
    return Array.from(new Map(champions.filter(Boolean).map((champion) => [champion.id, champion])).values());
}

export function buildPackRouletteItems(packPool, champion) {
    const uniquePool = uniqueChampionsById([champion, ...packPool]);
    const shuffledPool = [...uniquePool].sort(() => Math.random() - 0.5);
    const winnerIndex = Math.min(36, Math.max(2, shuffledPool.length - 1));
    const withoutWinner = shuffledPool.filter((item) => item.id !== champion.id);
    const rouletteChampions = [
        ...withoutWinner.slice(0, winnerIndex),
        champion,
        ...withoutWinner.slice(winnerIndex),
    ];

    return {
        items: rouletteChampions.map((rouletteChampion, index) => ({
            key: `${rouletteChampion.id}-${index}`,
            champion: rouletteChampion,
            isWinner: rouletteChampion.id === champion.id,
        })),
        winnerIndex,
    };
}
