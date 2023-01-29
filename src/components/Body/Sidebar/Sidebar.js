import { BsSearch } from 'react-icons/bs';
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import './sidebar.css'
import { useContext } from 'react';
import CardContext from '../../CardContext';

function Sidebar() {
    const { handleChange, allRoleCLick, clickedAllRoles, clickedFighter, clickedTank, clickedMage, clickedAssassin, clickedMarksman, clickedSupport, fighterClick, tankClick, mageClick, assassinClick, marksmanClick, supportClick } = useContext(CardContext)
    return (
        <div className='sidebar-border'>
            <div className='sidebar-inside'>
                <div className='check'>
                    <button className='all-role'>
                        All Role
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
                        <div>Role Filter</div>
                    </div>
                    <div className='role-filter-main' >
                        <button className='role' onClick={fighterClick} style={clickedFighter}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-fighter.png" alt="" />
                            Fighter
                        </button>

                        <button className='role' onClick={tankClick} style={clickedTank}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-tank.png" alt="" />
                            Tank
                        </button>

                        <button className='role' onClick={mageClick} style={clickedMage}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-mage.png" alt="" />
                            Mage
                        </button>
                        <button className='role' onClick={assassinClick} style={clickedAssassin} >
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-assassin.png" alt="" />
                            Assassin
                        </button>
                        <button className='role' onClick={marksmanClick} style={clickedMarksman}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-marksman.png" alt="" />
                            Marksman
                        </button>
                        <button className='role' onClick={supportClick} style={clickedSupport}>
                            <img src="https://raw.communitydragon.org/7.20/plugins/rcp-fe-lol-champion-details/global/default/role-icon-support.png" alt="" />
                            Support
                        </button>
                    </div>
                    {/* BOTTOM FİLTER */}
                    <div className='filter-bottom'>
                        <div className='price-filter'>
                            Price Filter
                            <button className='sidebar-button'>
                                <AiOutlineArrowUp />
                                <div className='price-text'>
                                    Price High to Low
                                </div>
                                <AiOutlineArrowUp />
                            </button>
                            <button className='sidebar-button'>
                                <AiOutlineArrowLeft />
                                <div className='price-text'>
                                    Price Low to High
                                </div>
                                <AiOutlineArrowRight />
                            </button>
                            <button className='sidebar-button'>
                                <AiOutlineArrowDown />
                                <div className='price-text'>
                                    Price Low to High
                                </div>
                                <AiOutlineArrowDown />
                            </button>
                        </div>
                        {/* SEARCH */}
                        <div className='search'>
                            <BsSearch className='search-icon' />
                            <input type="text" placeholder='Champion Name' onChange={handleChange} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar