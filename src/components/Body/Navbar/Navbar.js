import './navbar.css';
import Wallet from './Wallet';

function TopNavbar() {
    return (
        <nav className='nav'>
            <div className="menu">
                <div className='menu-left'>
                    <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png" alt="Lol logo" />
                    <div className='lol'>League of Legends Card Shop</div>
                </div>
                <div className='menu-right'>
                    <div className='money'>
                        <Wallet />
                    </div>
                </div>
            </div>

            <div className='drop-down'>
                <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png" alt="Lol logo" />
                <div className='lol'>League of Legends Card Shop</div>
                <Wallet />
            </div>
        </nav >

    );
}

export default TopNavbar; 