import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose, AiOutlineStar, AiOutlineTrophy } from 'react-icons/ai';
import { BsCollection } from 'react-icons/bs';
import { Check, ChevronRight, MapPin, Pencil, Plus, Shield, ShoppingCart, Sparkles, Swords } from 'lucide-react';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import { getChampionBlueEssence } from '../component/championPrices';
import { sidebarRoles } from '../../config/navigation';
import { PROFILE_ICON_DATA_URL, defaultProfileIconGroups, profileIconFallbackGroup, profileIconGroupForId, profileIconGroupsFromData, profileIconImage } from '../../config/profileIcons';
import { championOrigins, originImageUrls } from '../../data/championOrigins';
import { championLoadingImage, championSplashImage } from '../../utils/championMedia';
import { rarityConfig, rarityFor, rarityWeight } from '../../utils/championMeta';

export default function CollectionPanel({ champions, ownedChampions, showcaseIds = [], selectedProfileIconId, setSelectedProfileIconId, onClearShowcaseSlot, onOpenShowcasePicker, impactWave, openChampionModal, onOpenStore }) {
    const [profileRoleFilter, setProfileRoleFilter] = useState('all');
    const [profileRarityFilter, setProfileRarityFilter] = useState('all');
    const [profileRegionFilter, setProfileRegionFilter] = useState('all');
    const [profileSortFilter, setProfileSortFilter] = useState('value');
    const [isProfileIconPickerOpen, setIsProfileIconPickerOpen] = useState(false);
    const [profileIconGroups, setProfileIconGroups] = useState(defaultProfileIconGroups);
    const [hasLoadedProfileIcons, setHasLoadedProfileIcons] = useState(false);
    const selectedIconGroup = profileIconGroupForId(profileIconGroups, selectedProfileIconId);
    const [activeProfileIconGroup, setActiveProfileIconGroup] = useState(selectedIconGroup?.key || profileIconFallbackGroup.key);
    const activeProfileIcons = profileIconGroups.find((group) => group.key === activeProfileIconGroup)?.ids || profileIconFallbackGroup.ids;
    const total = champions.length;
    const ownedCount = ownedChampions.length;
    const pct = total > 0 ? Math.round((ownedCount / total) * 100) : 0;
    const legendaryCount = ownedChampions.filter((champion) => ['legendary', 'mythic'].includes(rarityFor(champion))).length;
    const collectionValue = ownedChampions.reduce((sum, champion) => sum + getChampionBlueEssence(champion), 0);
    const ownedSorted = [...ownedChampions].sort((a, b) => (
        getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
        a.name.localeCompare(b.name)
    ));
    const featuredChampion = ownedSorted[0];
    const collectionLevel = Math.max(1, Math.floor(ownedCount / 8) + 1);
    const nextLevelAt = collectionLevel * 8;
    const levelProgress = nextLevelAt > 0 ? Math.round((ownedCount / nextLevelAt) * 100) : 0;
    const championRegion = (champion) => championOrigins[champion.id] || 'Runeterra';
    const roleCounts = sidebarRoles.map((role) => ({
        role,
        count: ownedChampions.filter((champion) => champion.tags?.includes(role)).length,
    })).sort((a, b) => b.count - a.count || a.role.localeCompare(b.role));
    const favoriteRole = roleCounts.find((item) => item.count > 0)?.role || 'Unclaimed';
    const allRegions = Array.from(new Set(champions.map((champion) => championRegion(champion)))).sort();
    const regionProgress = allRegions.map((region) => {
        const regionTotal = champions.filter((champion) => championRegion(champion) === region).length;
        const regionOwned = ownedChampions.filter((champion) => championRegion(champion) === region).length;

        return {
            region,
            owned: regionOwned,
            total: regionTotal,
            pct: regionTotal > 0 ? Math.round((regionOwned / regionTotal) * 100) : 0,
        };
    }).sort((a, b) => b.owned - a.owned || b.pct - a.pct || a.region.localeCompare(b.region));
    const favoriteRegion = regionProgress.find((region) => region.owned > 0) || regionProgress[0] || { region: 'Runeterra', owned: 0, total: 0, pct: 0 };
    const rarityProgress = Object.keys(rarityConfig).map((rarity) => {
        const rarityTotal = champions.filter((champion) => rarityFor(champion) === rarity).length;
        const rarityOwned = ownedChampions.filter((champion) => rarityFor(champion) === rarity).length;

        return {
            rarity,
            owned: rarityOwned,
            total: rarityTotal,
            pct: rarityTotal > 0 ? Math.round((rarityOwned / rarityTotal) * 100) : 0,
        };
    });
    const showcaseCards = [0, 1, 2].map((index) => (
        ownedChampions.find((champion) => champion.id === showcaseIds[index]) || null
    ));
    const milestones = [
        { label: 'First Card', value: 'Starter', complete: ownedCount > 0 },
        { label: '10 Owned', value: 'Collector', complete: ownedCount >= 10 },
        { label: 'Legendary+', value: 'Elite', complete: legendaryCount > 0 },
        { label: `${favoriteRegion.region} Set`, value: `${favoriteRegion.pct}%`, complete: favoriteRegion.total > 0 && favoriteRegion.owned === favoriteRegion.total },
        { label: 'Half Roster', value: '50%', complete: pct >= 50 },
    ];
    const profileFilteredCards = (() => {
        const filteredCards = ownedChampions.filter((champion) => {
            const matchesRole = profileRoleFilter === 'all' || champion.tags?.includes(profileRoleFilter);
            const matchesRarity = profileRarityFilter === 'all' || rarityFor(champion) === profileRarityFilter;
            const matchesRegion = profileRegionFilter === 'all' || championRegion(champion) === profileRegionFilter;

            return matchesRole && matchesRarity && matchesRegion;
        });
        const sortedCards = [...filteredCards];

        if (profileSortFilter === 'name') {
            sortedCards.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (profileSortFilter === 'rarity') {
            sortedCards.sort((a, b) => (
                rarityWeight[rarityFor(b)] - rarityWeight[rarityFor(a)] ||
                getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
                a.name.localeCompare(b.name)
            ));
        }

        if (profileSortFilter === 'value') {
            sortedCards.sort((a, b) => getChampionBlueEssence(b) - getChampionBlueEssence(a) || a.name.localeCompare(b.name));
        }

        return sortedCards;
    })();
    const stats = [
        { icon: BsCollection, label: 'Owned', value: `${ownedCount}/${total}` },
        { icon: AiOutlineTrophy, label: 'Completion', value: `${pct}%` },
        { icon: AiOutlineStar, label: 'Legendary+', value: String(legendaryCount) },
    ];

    useEffect(() => {
        if (!isProfileIconPickerOpen || hasLoadedProfileIcons) {
            return;
        }

        let isMounted = true;

        fetch(PROFILE_ICON_DATA_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to load profile icon data');
                }

                return response.json();
            })
            .then((data) => {
                if (!isMounted) {
                    return;
                }

                const loadedGroups = profileIconGroupsFromData(data);

                if (loadedGroups.length > 0) {
                    setProfileIconGroups(loadedGroups);
                    setActiveProfileIconGroup((currentGroup) => (
                        profileIconGroupForId(loadedGroups, selectedProfileIconId)?.key ||
                        (loadedGroups.some((group) => group.key === currentGroup) ? currentGroup : loadedGroups[0].key)
                    ));
                }
            })
            .catch(() => {
                if (isMounted) {
                    setProfileIconGroups(defaultProfileIconGroups);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setHasLoadedProfileIcons(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [hasLoadedProfileIcons, isProfileIconPickerOpen, selectedProfileIconId]);

    return (
        <section
            className={`collection-panel profile-collection-panel ${impactWave ? 'is-pack-impacting' : ''}`}
            id='profile'
            style={impactWave ? {
                '--impact-color': impactWave.color,
                '--impact-glow': impactWave.glow,
            } : undefined}
        >
            <div className='profile-hero-shell'>
                {featuredChampion ? <img className='profile-hero-bg' src={championSplashImage(featuredChampion.id)} alt='' aria-hidden='true' /> : null}
                <span className='profile-hero-shade' />
                <div className='profile-identity'>
                    <button
                        type='button'
                        className='profile-avatar'
                        onClick={() => setIsProfileIconPickerOpen(true)}
                        aria-label='Choose profile icon'
                        aria-haspopup='dialog'
                    >
                        <img src={profileIconImage(selectedProfileIconId)} alt='' />
                    </button>
                    <div className='profile-title-block'>
                        <span><Shield size={15} strokeWidth={2.3} /> Summoner Profile</span>
                        <h2>League Market</h2>
                        <p>{favoriteRole} specialist from {favoriteRegion.region}</p>
                    </div>
                    <div className='profile-level-card'>
                        <div className='profile-level-ring' style={{ '--profile-level-pct': Math.min(levelProgress, 100) }}>
                            <svg viewBox='0 0 100 100'>
                                <circle cx='50' cy='50' r='42' />
                                <circle cx='50' cy='50' r='42' />
                            </svg>
                            <span>{collectionLevel}</span>
                        </div>
                        <div>
                            <strong>Collection Level</strong>
                            <span>{Math.max(nextLevelAt - ownedCount, 0)} cards to next</span>
                        </div>
                    </div>
                </div>

                <div className='profile-showcase'>
                    <div className='profile-showcase-head'>
                        <span><Sparkles size={15} strokeWidth={2.2} /> Showcase</span>
                        <strong>{showcaseCards.filter(Boolean).length}/3</strong>
                    </div>
                    <div className='profile-showcase-grid'>
                        {showcaseCards.map((champion, index) => (
                            champion ? (
                                <article
                                    key={champion.id}
                                    className={`profile-showcase-card rarity-${rarityFor(champion)}`}
                                    aria-label={`Preview ${champion.name}`}
                                    style={{
                                        '--showcase-color': rarityConfig[rarityFor(champion)].color,
                                        '--showcase-glow': rarityConfig[rarityFor(champion)].glow,
                                    }}
                                >
                                    <button
                                        type='button'
                                        className='profile-showcase-preview'
                                        onClick={() => openChampionModal(champion)}
                                        aria-label={`Preview ${champion.name}`}
                                    >
                                        <img src={championLoadingImage(champion.id)} alt='' />
                                        <span />
                                        <strong>{champion.name}</strong>
                                    </button>
                                    <button type='button' className='profile-showcase-edit' onClick={(event) => {
                                        event.stopPropagation();
                                        onOpenShowcasePicker(index);
                                    }} aria-label={`Edit showcase slot ${index + 1}`}>
                                        <Pencil size={14} strokeWidth={2.4} />
                                    </button>
                                    <button type='button' className='profile-showcase-clear' onClick={(event) => {
                                        event.stopPropagation();
                                        onClearShowcaseSlot(index);
                                    }} aria-label={`Clear showcase slot ${index + 1}`}>
                                        <AiOutlineClose />
                                    </button>
                                </article>
                            ) : (
                                <button type='button' className='profile-showcase-empty' key={`empty-${index}`} onClick={() => onOpenShowcasePicker(index)} aria-label={`Choose showcase slot ${index + 1}`}>
                                    <Plus size={18} strokeWidth={2.4} />
                                    <span>Select from roster</span>
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <Modal show={isProfileIconPickerOpen} onHide={() => setIsProfileIconPickerOpen(false)} centered dialogClassName='profile-icon-picker-dialog' contentClassName='profile-icon-picker-content'>
                <Modal.Body>
                    <div className='profile-icon-picker-head'>
                        <div>
                            <span><Shield size={15} strokeWidth={2.3} /> Summoner Icons</span>
                            <h3>Choose Profile Icon</h3>
                        </div>
                        <button type='button' onClick={() => setIsProfileIconPickerOpen(false)} aria-label='Close profile icon picker'>
                            <AiOutlineClose />
                        </button>
                    </div>
                    <div className='profile-icon-tabs' role='tablist' aria-label='Profile icon categories'>
                        {profileIconGroups.map((group) => (
                            <button
                                type='button'
                                key={group.key}
                                className={activeProfileIconGroup === group.key ? 'is-active' : ''}
                                onClick={() => setActiveProfileIconGroup(group.key)}
                                role='tab'
                                aria-selected={activeProfileIconGroup === group.key}
                            >
                                <span>{group.label}</span>
                                <small>{group.ids.length}</small>
                            </button>
                        ))}
                    </div>
                    <div className='profile-icon-grid'>
                        {activeProfileIcons.map((iconId) => {
                            const iconIdValue = String(iconId);
                            const isSelected = iconIdValue === selectedProfileIconId;

                            return (
                                <button
                                    type='button'
                                    key={iconId}
                                    className={isSelected ? 'is-selected' : ''}
                                    onClick={() => {
                                        setSelectedProfileIconId(iconIdValue);
                                        window.localStorage.setItem('league-market-profile-icon-id', iconIdValue);
                                        setIsProfileIconPickerOpen(false);
                                    }}
                                    aria-label={`Choose profile icon ${iconId}`}
                                    aria-pressed={isSelected}
                                >
                                    <img src={profileIconImage(iconId)} alt='' loading='lazy' />
                                    {isSelected ? <span><Check size={14} strokeWidth={3} /></span> : null}
                                </button>
                            );
                        })}
                    </div>
                </Modal.Body>
            </Modal>

            <div className='collection-stat-chips profile-stat-chips'>
                {stats.map((stat) => (
                    <div key={stat.label}>
                        <stat.icon />
                        <p>{stat.value}</p>
                        <span>{stat.label}</span>
                    </div>
                ))}
                <div>
                    <BlueEssenceIcon />
                    <p>{collectionValue.toLocaleString()}</p>
                    <span>Vault Value</span>
                </div>
            </div>

            <div className='profile-insight-grid'>
                <section className='profile-progress-panel profile-rarity-panel'>
                    <div className='profile-panel-heading'>
                        <span><AiOutlineStar /> Rarity Progress</span>
                    </div>
                    <div className='profile-rarity-progress'>
                        {rarityProgress.map(({ rarity, owned, total: rarityTotal, pct: rarityPct }) => (
                            <div key={rarity} className={`profile-progress-row ${rarityTotal > 0 && owned === rarityTotal ? 'is-complete' : ''}`} style={{ '--progress-color': rarityConfig[rarity].color, '--progress-glow': rarityConfig[rarity].glow }}>
                                <div>
                                    <span>{rarityConfig[rarity].label}</span>
                                    <strong>
                                        <span className='profile-progress-owned-count'>{owned}</span>
                                        <span className='profile-progress-total-count'>/{rarityTotal}</span>
                                    </strong>
                                </div>
                                <i><b style={{ width: `${rarityPct}%` }} /></i>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='profile-progress-panel'>
                    <div className='profile-panel-heading'>
                        <span><MapPin size={15} strokeWidth={2.3} /> Region Mastery</span>
                    </div>
                    <div className='profile-region-list'>
                        {regionProgress.map((region) => (
                            <div className='profile-region-row' key={region.region}>
                                <span className='profile-region-thumb'>
                                    {originImageUrls[region.region] ? <img src={originImageUrls[region.region]} alt='' /> : <MapPin size={16} strokeWidth={2.3} />}
                                </span>
                                <div>
                                    <strong>{region.region}</strong>
                                    <i><b style={{ width: `${region.pct}%` }} /></i>
                                </div>
                                <span>{region.owned}/{region.total}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='profile-progress-panel profile-milestone-panel'>
                    <div className='profile-panel-heading'>
                        <span><AiOutlineTrophy /> Milestones</span>
                    </div>
                    <div className='profile-milestones'>
                        {milestones.map((milestone) => (
                            <div className={milestone.complete ? 'is-complete' : ''} key={milestone.label}>
                                <span>{milestone.complete ? <Check size={14} strokeWidth={2.8} /> : <Sparkles size={14} strokeWidth={2.3} />}</span>
                                <div>
                                    <strong>{milestone.label}</strong>
                                    <small>{milestone.value}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className='profile-focus-strip'>
                <div>
                    <span><Swords size={16} strokeWidth={2.4} /> Favorite Role</span>
                    <strong>{favoriteRole}</strong>
                    <small>{roleCounts.find((item) => item.role === favoriteRole)?.count || 0} owned cards</small>
                </div>
                <div>
                    <span><MapPin size={16} strokeWidth={2.4} /> Strongest Region</span>
                    <strong>{favoriteRegion.region}</strong>
                    <small>{favoriteRegion.owned}/{favoriteRegion.total} collected</small>
                </div>
                <div>
                    <span><AiOutlineTrophy /> Next Goal</span>
                    <strong>{Math.max(nextLevelAt - ownedCount, 0)} Cards</strong>
                    <small>to collection level {collectionLevel + 1}</small>
                </div>
                <a href='#marketplace' onClick={onOpenStore}>
                    <ShoppingCart size={18} strokeWidth={2.4} />
                    Store
                </a>
            </div>

            <div className='profile-collection-layout'>
                <div className='profile-card-library'>
                    <div className='profile-card-library-head'>
                        <div>
                            <span><Sparkles size={15} strokeWidth={2.2} /> Owned Cards</span>
                            <h3>Personal Roster</h3>
                        </div>
                        <a href='#marketplace' className='profile-store-link' onClick={onOpenStore}>
                            Store
                            <ChevronRight size={16} strokeWidth={2.4} />
                        </a>
                    </div>

                    <div className='profile-library-controls'>
                        <select value={profileRoleFilter} onChange={(event) => setProfileRoleFilter(event.target.value)} aria-label='Filter owned cards by role'>
                            <option value='all'>All Roles</option>
                            {sidebarRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <select value={profileRarityFilter} onChange={(event) => setProfileRarityFilter(event.target.value)} aria-label='Filter owned cards by rarity'>
                            <option value='all'>All Rarities</option>
                            {Object.entries(rarityConfig).map(([key, rarity]) => <option key={key} value={key}>{rarity.label}</option>)}
                        </select>
                        <select value={profileRegionFilter} onChange={(event) => setProfileRegionFilter(event.target.value)} aria-label='Filter owned cards by region'>
                            <option value='all'>All Regions</option>
                            {regionProgress.map((region) => <option key={region.region} value={region.region}>{region.region}</option>)}
                        </select>
                        <select value={profileSortFilter} onChange={(event) => setProfileSortFilter(event.target.value)} aria-label='Sort owned cards'>
                            <option value='value'>Highest Value</option>
                            <option value='rarity'>Rarity</option>
                            <option value='name'>Name</option>
                        </select>
                    </div>

                    {profileFilteredCards.length > 0 ? (
                        <div className='profile-owned-grid'>
                            {profileFilteredCards.map((champion) => {
                                const rarity = rarityFor(champion);
                                const selectedShowcaseSlot = showcaseIds.indexOf(champion.id);

                                return (
                                    <article
                                        key={champion.id}
                                        className={`profile-owned-card rarity-${rarity} ${selectedShowcaseSlot >= 0 ? 'is-in-showcase' : ''}`}
                                        aria-label={`Preview ${champion.name}`}
                                        style={{
                                            '--owned-rarity-color': rarityConfig[rarity].color,
                                            '--owned-rarity-glow': rarityConfig[rarity].glow,
                                        }}
                                    >
                                        <button
                                            type='button'
                                            className='profile-owned-preview'
                                            onClick={() => openChampionModal(champion)}
                                            aria-label={`Preview ${champion.name}`}
                                        >
                                            <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                            <span className='profile-owned-glow' />
                                            <span className='profile-owned-rarity'>{rarityConfig[rarity].label}</span>
                                            {selectedShowcaseSlot >= 0 ? <span className='profile-owned-showcase-badge'>Showcase {selectedShowcaseSlot + 1}</span> : null}
                                            <span className='profile-owned-copy'>
                                                <strong>{champion.name}</strong>
                                                <small>{champion.tags?.[0] || 'Champion'}</small>
                                            </span>
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className='profile-library-empty'>
                            <BsCollection />
                            <p>No owned cards here</p>
                            <a href='#marketplace' onClick={onOpenStore}>Browse the store</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

