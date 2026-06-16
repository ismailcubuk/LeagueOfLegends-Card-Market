import { Check, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react';
import BlueEssenceIcon from '../../components/common/BlueEssenceIcon';
import FilterSection from './FilterSection';
import { rarityConfig } from '../../utils/championMeta';

export default function FilterPanel({
    openFilterSections,
    toggleFilterSection,
    sidebarRoles,
    roleFilters,
    roleIcons,
    roleActions,
    regionFilters,
    clearRegionFilters,
    regionOptions,
    handleRegionClick,
    maxPrice,
    setMaxPrice,
    rarityFilters,
    handleRarityClick,
    collectionFilter,
    handleCollectionFilterClick,
    sortOptions,
    sortFilter,
    handleSortClick,
}) {
    return (
        <aside className='filter-panel'>
            <div className='filter-shell'>
                <div className='filter-panel-title'>
                    <div>
                        <SlidersHorizontal size={16} strokeWidth={2.2} />
                        <span>Filters</span>
                    </div>
                </div>

                <div className='filter-panel-body'>
                    <FilterSection title='Role' isOpen={openFilterSections.role} onToggle={() => toggleFilterSection('role')}>
                        <div className='filter-role-grid'>
                            {sidebarRoles.map((role) => (
                                <button type='button' key={role} className={`filter-role-button ${roleFilters.includes(role) ? 'active' : ''}`} onClick={roleActions[role]}>
                                    <img src={roleIcons[role]} alt='' />
                                    {role}
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Region' isOpen={openFilterSections.region} onToggle={() => toggleFilterSection('region')}>
                        <div className='filter-region-grid'>
                            <button type='button' className={`filter-region-button ${regionFilters.length === 0 ? 'active' : ''}`} onClick={clearRegionFilters}>
                                <span className='filter-region-icon filter-region-icon-empty'>
                                    <MapPin size={16} strokeWidth={2.2} />
                                </span>
                                <span>All Regions</span>
                            </button>
                            {regionOptions.map((region) => (
                                <button type='button' key={region.id} className={`filter-region-button ${regionFilters.includes(region.id) ? 'active' : ''}`} onClick={() => handleRegionClick(region.id)}>
                                    <span className='filter-region-icon'>
                                        <img src={region.image} alt='' />
                                    </span>
                                    <span>{region.label}</span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Price Range' isOpen={openFilterSections.price} onToggle={() => toggleFilterSection('price')}>
                        <div className='filter-price-range'>
                            <div>
                                <span className='filter-price-value'>
                                    <BlueEssenceIcon />
                                    <span>450</span>
                                </span>
                                <strong className='filter-price-value'>
                                    <span>{maxPrice.toLocaleString()}</span>
                                    <BlueEssenceIcon />
                                </strong>
                            </div>
                            <input type='range' min='450' max='6300' step='450' value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} aria-label='Maximum price' />
                        </div>
                    </FilterSection>

                    <FilterSection title='Rarity' isOpen={openFilterSections.rarity} onToggle={() => toggleFilterSection('rarity')}>
                        <div className='filter-rarity-list'>
                            {Object.entries(rarityConfig).map(([key, rarity]) => (
                                <button type='button' key={key} className={`filter-rarity-button ${rarityFilters.includes(key) ? 'active' : ''}`} onClick={() => handleRarityClick(key)}>
                                    <span className='filter-check-box' style={rarityFilters.includes(key) ? { '--filter-rarity-color': rarity.color } : undefined}>
                                        {rarityFilters.includes(key) ? <Check size={13} strokeWidth={3} aria-hidden='true' /> : null}
                                    </span>
                                    <span style={rarityFilters.includes(key) ? { color: rarity.color } : undefined}>
                                        {['legendary', 'mythic'].includes(key) ? <Sparkles size={12} strokeWidth={2} style={{ color: rarity.color }} aria-hidden='true' /> : null}
                                        {rarity.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </FilterSection>

                    <FilterSection title='Collection' isOpen={openFilterSections.collection} onToggle={() => toggleFilterSection('collection')}>
                        <div className='filter-collection-list'>
                            <button type='button' className={collectionFilter === 'all' ? 'active' : ''} onClick={() => handleCollectionFilterClick('all')}>
                                All Cards
                                {collectionFilter === 'all' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                            <button type='button' className={collectionFilter === 'owned' ? 'active' : ''} onClick={() => handleCollectionFilterClick('owned')}>
                                Owned
                                {collectionFilter === 'owned' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                            <button type='button' className={collectionFilter === 'not-owned' ? 'active' : ''} onClick={() => handleCollectionFilterClick('not-owned')}>
                                Not Owned
                                {collectionFilter === 'not-owned' ? <Check size={16} strokeWidth={2.2} /> : null}
                            </button>
                        </div>
                    </FilterSection>

                    <FilterSection title='Sort By' isOpen={openFilterSections.sort} onToggle={() => toggleFilterSection('sort')} last>
                        <div className='filter-sort-list'>
                            {sortOptions.map((option) => (
                                <button type='button' key={option.key} className={sortFilter === option.key ? 'active' : ''} onClick={() => handleSortClick(option.key)}>
                                    <span>{option.label}</span>
                                    {sortFilter === option.key ? <Check size={16} strokeWidth={2.2} /> : null}
                                </button>
                            ))}
                        </div>
                    </FilterSection>
                </div>
            </div>
        </aside>
    );
}

