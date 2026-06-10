import './Alert.css';
import React, { useContext, useEffect } from 'react';
import CardContext from '../../component/CardContext';

const TOAST_DURATION = 4000;

function Alert() {
    const { alertt, setAlertt } = useContext(CardContext);

    useEffect(() => {
        if (!alertt) {
            return undefined;
        }

        const timeout = window.setTimeout(() => setAlertt(false), TOAST_DURATION);

        return () => window.clearTimeout(timeout);
    }, [alertt, setAlertt]);

    if (!alertt) {
        return null;
    }

    return (
        <div className='balance-toast' role='status' aria-live='polite'>
            <div className='balance-toast-icon' aria-hidden='true'>!</div>
            <div className='balance-toast-copy'>
                <strong>Insufficient balance</strong>
                <span>Earn more Blue Essence before unlocking this champion.</span>
            </div>
            <button type='button' className='balance-toast-close' onClick={() => setAlertt(false)} aria-label='Close notification'>
                ×
            </button>
            <span className='balance-toast-progress' style={{ animationDuration: `${TOAST_DURATION}ms` }} />
        </div>
    );
}

export default Alert;
