import './navbar.css';
import Wallet from './Wallet';

const LOL_ICON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/lol_icon.png';

function TopNavbar() {
    const logo = <img className='lol-logo' src={LOL_ICON_URL} alt='League of Legends icon' />;

    return (
        <nav className='nav'>
            <div className="menu">
                <div className='menu-left'>
                    {logo}
                    <div className='lol'>League of Legends Card Shop</div>
                </div>
                <div className='menu-right'>
                    <div className='money'>
                        <Wallet />
                    </div>
                </div>
            </div>

            <div className='drop-down'>
                {logo}
                <div className='lol'>League of Legends Card Shop</div>
                <Wallet />
            </div>
        </nav >

    );
}

export default TopNavbar; 
