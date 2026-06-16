import BlueEssenceIcon from './BlueEssenceIcon';

export default function PriceAmount({ value, className = '' }) {
    return (
        <span className={`price-amount ${className}`.trim()}>
            <span>{value.toLocaleString()}</span>
            <BlueEssenceIcon />
        </span>
    );
}
