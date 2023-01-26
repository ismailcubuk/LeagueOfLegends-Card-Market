import { FaWallet } from 'react-icons/fa';
import './navbar.css';
function Wallet() {
    return (
        <div className='wallet-border'>
            <div className='w-icon-border'><FaWallet className='w-icon' /></div>
            <div className='money-wallet'>$100</div>
        </div>
    )
}

export default Wallet