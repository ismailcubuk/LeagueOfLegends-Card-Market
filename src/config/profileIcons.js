export const PROFILE_ICON_DATA_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons.json';

export const profileIconImage = (id) => `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${id}.jpg`;

const fallbackProfileIconIds = [
    ...Array.from({ length: 30 }, (_, index) => index),
    ...Array.from({ length: 90 }, (_, index) => index + 500),
    ...Array.from({ length: 90 }, (_, index) => index + 900),
    ...Array.from({ length: 80 }, (_, index) => index + 1300),
    ...Array.from({ length: 80 }, (_, index) => index + 1600),
    ...Array.from({ length: 80 }, (_, index) => index + 2000),
    ...Array.from({ length: 80 }, (_, index) => index + 3000),
    ...Array.from({ length: 80 }, (_, index) => index + 4000),
];

const buildProfileIconGroups = (ids) => {
    const sortedIds = Array.from(new Set(ids.map(Number).filter(Number.isFinite))).sort((a, b) => a - b);

    return [
        {
            key: 'classic',
            label: 'Classic',
            ids: sortedIds.filter((id) => id < 100),
        },
        {
            key: 'champion',
            label: 'Champion',
            ids: sortedIds.filter((id) => id >= 100 && id < 1000),
        },
        {
            key: 'event',
            label: 'Event',
            ids: sortedIds.filter((id) => id >= 1000 && id < 3000),
        },
        {
            key: 'special',
            label: 'Special',
            ids: sortedIds.filter((id) => id >= 3000),
        },
    ].filter((group) => group.ids.length > 0);
};

export const defaultProfileIconGroups = buildProfileIconGroups(fallbackProfileIconIds);

export const profileIconFallbackGroup = defaultProfileIconGroups[0] || {
    key: 'classic',
    label: 'Classic',
    ids: [0],
};

export const profileIconGroupForId = (groups, iconId) => (
    groups.find((group) => group.ids.some((groupIconId) => String(groupIconId) === String(iconId)))
);

export const profileIconGroupsFromData = (data) => {
    const entries = Array.isArray(data) ? data : Object.entries(data || {}).map(([key, value]) => ({ id: key, ...value }));
    const ids = entries.map((icon) => Number(icon.id)).filter(Number.isFinite);

    return buildProfileIconGroups(ids);
};
