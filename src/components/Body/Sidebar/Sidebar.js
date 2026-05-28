import { BsSearch } from 'react-icons/bs';
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineSortAscending, AiOutlineAppstore, AiOutlineClose } from 'react-icons/ai';
import './sidebar.css'
import { useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CardContext from '../../component/CardContext';

function Sidebar() {
    const {
        searchClick,
        filterUpMoneyClick,
        unFilteredMoneyClick,
        unFilteredMoneyActive,
        filterDownMoneyActive,
        filterUpMoneyActive,
        filterDownMoneyClick,
        search,
        clearSearch,
        handleChange,
        allRoleCLick,
        clickedAllRoles,
        clickedFighter,
        clickedTank,
        clickedMage,
        clickedAssassin,
        clickedMarksman,
        clickedSupport,
        fighterClick,
        tankClick,
        mageClick,
        assassinClick,
        marksmanClick,
        supportClick,
        roleIcons,
    } = useContext(CardContext);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const classMenuRef = useRef(null);
    const priceMenuRef = useRef(null);

    const closeMobileMenus = () => {
        setIsClassOpen(false);
        setIsPriceOpen(false);
    };

    const handleClassToggle = () => {
        setIsClassOpen((current) => !current);
        setIsPriceOpen(false);
    };

    const handlePriceToggle = () => {
        setIsPriceOpen((current) => !current);
        setIsClassOpen(false);
    };

    const handleRoleSelect = (selectRole) => {
        selectRole();
        setIsClassOpen(false);
    };

    const handlePriceSelect = (selectPrice) => {
        selectPrice();
        setIsPriceOpen(false);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (classMenuRef.current && !classMenuRef.current.contains(event.target)) {
                setIsClassOpen(false);
            }

            if (priceMenuRef.current && !priceMenuRef.current.contains(event.target)) {
                setIsPriceOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsSearchModalOpen(false);
                closeMobileMenus();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <div className='sidebar-border'>
            <div className='sidebar-inside'>
                <div className='check'>
                    <div className='search-mobile-btn-border'>
                        <button className='search-mobile-btn'>
                            <BsSearch className='search-icon' onClick={searchClick} />
                        </button>
                    </div>
                    <div className='all-role-header'>
                        <div>All Role</div>
                    </div>
                    <button className='all-role'>
                        <div className='all-role-images' onClick={allRoleCLick} style={clickedAllRoles}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" alt="" />
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" alt="" />
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" alt="" />
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" alt="" />
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" alt="" />
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" alt="" />
                        </div>
                    </button>
                    <div className='role-filter-header'>
                        <div className='sidebar-header'>Role Filter</div>
                    </div>
                    <div className='role-filter-main' >
                        <button className='role' onClick={fighterClick} style={clickedFighter}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" alt="" />
                            <div>Fighter</div>
                        </button>

                        <button className='role' onClick={tankClick} style={clickedTank}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" alt="" />
                            <div>Tank</div>
                        </button>

                        <button className='role' onClick={mageClick} style={clickedMage}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" alt="" />
                            <div>Mage</div>
                        </button>
                        <button className='role' onClick={assassinClick} style={clickedAssassin} >
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" alt="" />
                            <div>Assassin</div>
                        </button>
                        <button className='role' onClick={marksmanClick} style={clickedMarksman}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" alt="" />
                            <div>Marksman</div>
                        </button>
                        <button className='role' onClick={supportClick} style={clickedSupport}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" alt="" />
                            <div>Support</div>
                        </button>
                    </div>
                    {/* BOTTOM FİLTER */}
                    <div className='filter-bottom'>
                        <div className='price-filter'>
                            <div className='sidebar-header'>Role Filter</div>
                            <button className='sidebar-button' onClick={filterUpMoneyClick} style={filterUpMoneyActive} >
                                <AiOutlineArrowUp />
                                <div className='price-text'>
                                    Price High to Low
                                </div>
                                <AiOutlineArrowUp />
                            </button>
                            <button className='sidebar-button' onClick={unFilteredMoneyClick} style={unFilteredMoneyActive} >
                                <AiOutlineArrowLeft />
                                <div className='price-text'>
                                    Price Unfiltered
                                </div>
                                <AiOutlineArrowRight />
                            </button>
                            <button className='sidebar-button' onClick={filterDownMoneyClick} style={filterDownMoneyActive}>
                                <AiOutlineArrowDown />
                                <div className='price-text'>
                                    Price Low to High
                                </div>
                                <AiOutlineArrowDown />
                            </button>
                            <div className='search'>
                                <BsSearch className='search-icon' />
                                <input type="text" spellCheck="false" placeholder='Search Champ..' value={search} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {createPortal(
                <div className='mobile-bottom-filter'>
                    <div className='mobile-filter-menu mobile-filter-menu--price' ref={priceMenuRef}>
                        {isPriceOpen ? (
                            <div className='mobile-dropdown mobile-dropdown-up'>
                                <button type='button' className='mobile-dropdown-item mobile-price-item' onClick={() => handlePriceSelect(filterUpMoneyClick)}><AiOutlineArrowUp />High to Low</button>
                                <button type='button' className='mobile-dropdown-item mobile-price-item' onClick={() => handlePriceSelect(unFilteredMoneyClick)}><AiOutlineArrowLeft />Unfiltered<AiOutlineArrowRight /></button>
                                <button type='button' className='mobile-dropdown-item mobile-price-item' onClick={() => handlePriceSelect(filterDownMoneyClick)}><AiOutlineArrowDown />Low to High</button>
                            </div>
                        ) : null}
                        <button type='button' className='mobile-filter-button' onClick={handlePriceToggle} aria-label='Price Filter' title='Price Filter'>
                            <AiOutlineSortAscending className='mobile-filter-icon' />
                        </button>
                    </div>

                    <button
                        type='button'
                        className='mobile-filter-button'
                        onClick={() => {
                            setIsSearchModalOpen(true);
                            closeMobileMenus();
                        }}
                        aria-label='Search'
                        title='Search'
                    >
                        <BsSearch className='mobile-filter-icon' />
                    </button>

                    <div className='mobile-filter-menu mobile-filter-menu--class' ref={classMenuRef}>
                        {isClassOpen ? (
                            <div className='mobile-dropdown mobile-dropdown-up'>
                                <button type='button' className='mobile-dropdown-item' onClick={() => handleRoleSelect(allRoleCLick)}>All Role</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(fighterClick)}><img src={roleIcons.Fighter} alt='' />Fighter</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(tankClick)}><img src={roleIcons.Tank} alt='' />Tank</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(mageClick)}><img src={roleIcons.Mage} alt='' />Mage</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(assassinClick)}><img src={roleIcons.Assassin} alt='' />Assassin</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(marksmanClick)}><img src={roleIcons.Marksman} alt='' />Marksman</button>
                                <button type='button' className='mobile-dropdown-item mobile-role-item' onClick={() => handleRoleSelect(supportClick)}><img src={roleIcons.Support} alt='' />Support</button>
                            </div>
                        ) : null}
                        <button type='button' className='mobile-filter-button' onClick={handleClassToggle} aria-label='Class Filter' title='Class Filter'>
                            <AiOutlineAppstore className='mobile-filter-icon' />
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {isSearchModalOpen ? createPortal(
                <div className='mobile-search-modal-overlay' onClick={() => setIsSearchModalOpen(false)}>
                    <div className='mobile-search-modal' onClick={(event) => event.stopPropagation()}>
                        <div className='mobile-search-modal-header'>
                            <h2>Search Champion</h2>
                            <div className='mobile-search-modal-actions'>
                                <button type='button' className='mobile-search-close' onClick={() => setIsSearchModalOpen(false)}>Close</button>
                            </div>
                        </div>
                        <div className='mobile-search-modal-input'>
                            <BsSearch className='search-icon' />
                            <input type='text' spellCheck='false' placeholder='Search Champ..' value={search} onChange={handleChange} autoFocus />
                            {search ? (
                                <button type='button' className='mobile-search-input-clear' onClick={clearSearch} aria-label='Clear Search' title='Clear Search'>
                                    <AiOutlineClose />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>,
                document.body
            ) : null}
        </div>
    )
}

export default Sidebar
