import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCollection } from 'react-icons/bs';
import { Check, Search, Sparkles } from 'lucide-react';
import { getChampionBlueEssence } from '../../domain/championPrices';
import { sidebarRoles } from '../../config/navigation';
import { championLoadingImage } from '../../utils/championMedia';
import { rarityConfig, rarityFor } from '../../utils/championMeta';

export default function ShowcasePickerModal({ slotIndex, champions, ownedChampions, showcaseIds, onSelect, onClear, onClose }) {
    const [showcaseSearch, setShowcaseSearch] = useState('');
    const [showcaseRoleFilter, setShowcaseRoleFilter] = useState('all');
    const [showcaseRarityFilter, setShowcaseRarityFilter] = useState('all');
    const selectedChampionId = showcaseIds[slotIndex];
    const sortedChampions = [...ownedChampions].sort((a, b) => (
        getChampionBlueEssence(b) - getChampionBlueEssence(a) ||
        a.name.localeCompare(b.name)
    ));
    const filteredChampions = sortedChampions.filter((champion) => {
        const matchesSearch = champion.name.toLowerCase().includes(showcaseSearch.trim().toLowerCase());
        const matchesRole = showcaseRoleFilter === 'all' || champion.tags?.includes(showcaseRoleFilter);
        const matchesRarity = showcaseRarityFilter === 'all' || rarityFor(champion) === showcaseRarityFilter;

        return matchesSearch && matchesRole && matchesRarity;
    });

    return (
        <Modal show={slotIndex !== null} onHide={onClose} size='lg' centered dialogClassName='showcase-picker-dialog' contentClassName='showcase-picker-content'>
            <Modal.Body className='showcase-picker-body'>
                <div className='showcase-picker-head'>
                    <div>
                        <span><Sparkles size={15} strokeWidth={2.3} /> Showcase Slot {slotIndex + 1}</span>
                        <h3>Select Champion</h3>
                    </div>
                    <div className='showcase-picker-actions'>
                        <span className='showcase-picker-count'>{ownedChampions.length}/{champions.length} Owned</span>
                        {selectedChampionId ? (
                            <button type='button' className='showcase-picker-clear' onClick={() => onClear(slotIndex)}>
                                Clear Slot
                            </button>
                        ) : null}
                        <button type='button' className='showcase-picker-close' onClick={onClose} aria-label='Close showcase picker'>
                            <AiOutlineClose />
                        </button>
                    </div>
                </div>

                <div className='showcase-picker-filters'>
                    <label>
                        <Search size={16} strokeWidth={2.4} />
                        <input
                            type='search'
                            value={showcaseSearch}
                            onChange={(event) => setShowcaseSearch(event.target.value)}
                            placeholder='Search champion'
                            aria-label='Search showcase champions'
                        />
                    </label>
                    <select value={showcaseRoleFilter} onChange={(event) => setShowcaseRoleFilter(event.target.value)} aria-label='Filter showcase champions by role'>
                        <option value='all'>All Roles</option>
                        {sidebarRoles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                    <select value={showcaseRarityFilter} onChange={(event) => setShowcaseRarityFilter(event.target.value)} aria-label='Filter showcase champions by rarity'>
                        <option value='all'>All Rarities</option>
                        {Object.entries(rarityConfig).map(([key, rarity]) => <option key={key} value={key}>{rarity.label}</option>)}
                    </select>
                </div>

                {filteredChampions.length > 0 ? (
                    <div className='showcase-picker-grid'>
                        {filteredChampions.map((champion) => {
                            const rarity = rarityFor(champion);
                            const selected = selectedChampionId === champion.id;
                            const usedSlot = showcaseIds.indexOf(champion.id);

                            return (
                                <button
                                    type='button'
                                    key={champion.id}
                                    className={`showcase-picker-card rarity-${rarity} ${selected ? 'active' : ''}`}
                                    onClick={() => onSelect(slotIndex, champion.id)}
                                    style={{
                                        '--picker-rarity-color': rarityConfig[rarity].color,
                                        '--picker-rarity-glow': rarityConfig[rarity].glow,
                                    }}
                                >
                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                    <span className='showcase-picker-card-glow' />
                                    <span className='showcase-picker-card-rarity'>{rarityConfig[rarity].label}</span>
                                    {usedSlot >= 0 ? <span className='showcase-picker-card-slot'>Slot {usedSlot + 1}</span> : null}
                                    <span className='showcase-picker-card-copy'>
                                        <strong>{champion.name}</strong>
                                        <small>{champion.tags?.[0] || 'Champion'}</small>
                                    </span>
                                    {selected ? <span className='showcase-picker-check'><Check size={14} strokeWidth={3} /></span> : null}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className='showcase-picker-empty'>
                        <BsCollection />
                        <p>{sortedChampions.length > 0 ? 'No matching cards' : 'No owned cards yet'}</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}


