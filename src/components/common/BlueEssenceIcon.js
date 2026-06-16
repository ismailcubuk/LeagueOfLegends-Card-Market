import { BLUE_ESSENCE_ICON_URL } from '../../domain/championPrices';

export default function BlueEssenceIcon({ className = '' }) {
    return (
        <img className={`blue-essence-icon ${className}`.trim()} src={BLUE_ESSENCE_ICON_URL} alt='' aria-hidden='true' />
    );
}

