export const sidebarRoles = ['Assassin', 'Mage', 'Fighter', 'Tank', 'Marksman', 'Support'];

export const navLinks = [
    { label: 'Profile', href: '#profile', view: 'profile' },
    { label: 'Trends', href: '#trending', view: 'market' },
    { label: 'Store', href: '#marketplace', view: 'market' },
];

export const profileNavLink = navLinks.find((link) => link.view === 'profile');
export const marketNavLinks = navLinks.filter((link) => link.view === 'market');

export const previewTabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'abilities', label: 'Abilities' },
    { key: 'lore', label: 'Lore' },
    { key: 'skins', label: 'Skins' },
];

export const HERO_AUTOPLAY_MS = 5000;
