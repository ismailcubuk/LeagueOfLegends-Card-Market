import { Heart } from 'lucide-react';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import { championLoadingImage } from '../../utils/championMedia';

export default function FlightEffects({ cartFlight, favoriteFlight, collectionFlights, dailyEssenceFlights, packEssenceFlights, packImpactWave }) {
    return (
        <>
            {cartFlight ? (
                <span key={cartFlight.id} className='cart-flight-card' style={{ left: cartFlight.left, top: cartFlight.top, width: cartFlight.width, height: cartFlight.height, '--flight-x': cartFlight['--flight-x'], '--flight-y': cartFlight['--flight-y'] }} aria-hidden='true'>
                    <img src={championLoadingImage(cartFlight.championId)} alt='' />
                </span>
            ) : null}
            {favoriteFlight ? (
                <span key={favoriteFlight.id} className='favorite-flight-card' style={{ left: favoriteFlight.left, top: favoriteFlight.top, width: favoriteFlight.width, height: favoriteFlight.height, '--favorite-flight-x': favoriteFlight['--favorite-flight-x'], '--favorite-flight-y': favoriteFlight['--favorite-flight-y'] }} aria-hidden='true'>
                    <img src={championLoadingImage(favoriteFlight.championId)} alt='' />
                    <span><Heart size={17} strokeWidth={2.5} /></span>
                </span>
            ) : null}
            {collectionFlights.map((flight) => (
                <span key={flight.id} className='collection-flight-card' style={{ left: flight.left, top: flight.top, width: flight.width, height: flight.height, '--flight-x': flight['--flight-x'], '--flight-y': flight['--flight-y'], '--flight-delay': flight['--flight-delay'] }} aria-hidden='true'>
                    <img src={championLoadingImage(flight.championId)} alt='' />
                </span>
            ))}
            {dailyEssenceFlights.map((flight) => (
                <span key={flight.id} className='daily-essence-flight' style={{ left: flight.left, top: flight.top, '--essence-x': flight['--essence-x'], '--essence-y': flight['--essence-y'], '--essence-arc': flight['--essence-arc'], '--essence-delay': flight['--essence-delay'] }} aria-hidden='true' />
            ))}
            {packEssenceFlights.map((flight) => (
                <span key={flight.id} className='pack-essence-flight' style={{ left: flight.left, top: flight.top, '--essence-x': flight['--essence-x'], '--essence-y': flight['--essence-y'], '--essence-delay': flight['--essence-delay'] }} aria-hidden='true'>
                    <BlueEssenceIcon />
                </span>
            ))}
            {packImpactWave ? (
                <span key={packImpactWave.id} className={`pack-impact-wave rarity-${packImpactWave.rarity}`} style={{ left: packImpactWave.left, top: packImpactWave.top, '--impact-color': packImpactWave.color, '--impact-glow': packImpactWave.glow }} aria-hidden='true'>
                    <span /><span /><span /><i /><i /><i /><i /><i /><i />
                </span>
            ) : null}
        </>
    );
}
