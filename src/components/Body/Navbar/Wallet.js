import { useContext } from 'react';
import { FaWallet } from 'react-icons/fa';
import CardContext from '../../CardContext';
import './navbar.css';

function Wallet() {
    const { money } = useContext(CardContext)
    return (
        <div className='wallet-border'>
            <div className='w-icon-border'><FaWallet className='w-icon' /></div>
            <div className='money-wallet'>${money}</div>
        </div>
    )
}

export default Wallet