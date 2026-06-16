

export default function HeroStat({ label, value, tone }) {
    const scaledValue = Math.min(Math.max(value * 10, 0), 100);

    return (
        <div className='hero-stat'>
            <span>{label}</span>
            <div className='hero-stat-track'>
                <i style={{ width: `${scaledValue}%` }} className={`tone-${tone}`} />
            </div>
            <strong>{scaledValue}</strong>
        </div>
    );
}

