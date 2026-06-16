import { Sparkles } from 'lucide-react';
import { rarityConfig } from '../../utils/championMeta';

export default function RarityPill({ rarity }) {
    const config = rarityConfig[rarity];

    return (
        <span
            className='trending-rarity'
            style={{ color: config.color, borderColor: config.border, backgroundColor: `color-mix(in oklch, ${config.color} 14%, transparent)` }}
        >
            <Sparkles size={12} strokeWidth={2} aria-hidden='true' />
            {config.label}
        </span>
    );
}

