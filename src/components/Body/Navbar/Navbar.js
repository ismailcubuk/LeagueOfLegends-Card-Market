import './navbar.css';
import { MdMenu } from 'react-icons/md';
import Dropdown from 'react-bootstrap/Dropdown';
import Wallet from './Wallet';

function TopNavbar() {
    return (
        <nav className='nav'>
            <div className="menu">
                <div className='menu-left'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png" alt="Lol logo" />
                    <div className='lol'>League of Legends Card Shop</div>
                    <div className='menu-button'>
                        <a href="/">Shop</a>
                        <a href="MyCards">MyCards</a>
                        <a href="xa">xa</a>
                    </div>
                </div>
                <div className='menu-right'>
                    <div className='money'>
                        <Wallet />
                    </div>
                </div>
            </div>

            <Dropdown className='drop-down'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png" alt="Lol logo" />
                <div className='lol'>League of Legends Card Shop</div>
                <Dropdown.Toggle className='drop-toggle' variant="secondary">
                    <MdMenu />
                </Dropdown.Toggle>
                <Wallet />
                <Dropdown.Menu className='drop-menu' variant="dark">
                    <Dropdown.Item href="/">Shop</Dropdown.Item>
                    <Dropdown.Item href="MyCards">MyCards</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </nav >
    );
}

export default TopNavbar; 