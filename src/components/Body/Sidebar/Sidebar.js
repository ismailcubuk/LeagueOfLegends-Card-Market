import { BsSearch } from 'react-icons/bs';
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './sidebar.css'
import { useContext, useState } from 'react';
import CardContext from '../../component/CardContext';

function Sidebar() {
    const { searchClick, filterUpMoneyClick, unFilteredMoneyClick, unFilteredMoneyActive, filterDownMoneyActive, filterUpMoneyActive, filterDownMoneyClick, handleChange, allRoleCLick, clickedAllRoles, clickedFighter, clickedTank, clickedMage, clickedAssassin, clickedMarksman, clickedSupport, fighterClick, tankClick, mageClick, assassinClick, marksmanClick, supportClick } = useContext(CardContext)

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
                                <input type="text" spellCheck="false" placeholder='Search Champ..' onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar