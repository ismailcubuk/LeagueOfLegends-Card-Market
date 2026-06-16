import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import RarityPill from '../common/RarityPill';
import { getChampionBlueEssence } from '../component/championPrices';
import { championSplashImage } from '../../utils/championMedia';
import { rarityConfig, rarityFor, scoreChampion } from '../../utils/championMeta';

export default function TrendingCarousel({ champions, openChampionModal }) {
    const scrollerRef = useRef(null);
    const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });
    const trending = useMemo(() => (
        [...champions].sort((a, b) => scoreChampion(b) - scoreChampion(a)).slice(0, 12)
    ), [champions]);

    const updateScrollEdges = () => {
        const scroller = scrollerRef.current;

        if (!scroller) {
            setScrollEdges({ left: false, right: false });
            return;
        }

        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        const nextEdges = {
            left: scroller.scrollLeft > 1,
            right: scroller.scrollLeft < maxScrollLeft - 1,
        };

        setScrollEdges((currentEdges) => (
            currentEdges.left === nextEdges.left && currentEdges.right === nextEdges.right
                ? currentEdges
                : nextEdges
        ));
    };

    useEffect(() => {
        const scroller = scrollerRef.current;

        updateScrollEdges();

        if (!scroller) {
            return undefined;
        }

        scroller.addEventListener('scroll', updateScrollEdges, { passive: true });
        window.addEventListener('resize', updateScrollEdges);

        return () => {
            scroller.removeEventListener('scroll', updateScrollEdges);
            window.removeEventListener('resize', updateScrollEdges);
        };
    }, [trending.length]);

    const scrollByCards = (direction) => {
        if (!scrollerRef.current) {
            return;
        }

        scrollerRef.current.scrollBy({ left: direction * scrollerRef.current.clientWidth * 0.8, behavior: 'smooth' });
    };

    return (
        <section className='trending-section' id='trending'>
            <div className='trending-kicker'>
                <Flame size={16} strokeWidth={2.4} />
                Trending Now
            </div>
            <div className='trending-carousel'>
                <div className='trending-fade-left' />
                <div className='trending-fade-right' />
                {scrollEdges.left ? (
                    <button type='button' className='trending-arrow trending-arrow-left' onClick={() => scrollByCards(-1)} aria-label='Scroll left'>
                        <ChevronLeft size={20} />
                    </button>
                ) : null}
                {scrollEdges.right ? (
                    <button type='button' className='trending-arrow trending-arrow-right' onClick={() => scrollByCards(1)} aria-label='Scroll right'>
                        <ChevronRight size={20} />
                    </button>
                ) : null}
                <div className='trending-track' ref={scrollerRef}>
                    {trending.map((champion) => {
                        const rarity = rarityFor(champion);
                        const config = rarityConfig[rarity];

                        return (
                            <button
                                type='button'
                                key={champion.id}
                                className='trending-card'
                                onClick={() => openChampionModal(champion)}
                            >
                                <img src={championSplashImage(champion.id)} alt={champion.name} draggable='false' loading='lazy' />
                                <div className='trending-card-gradient' />
                                <div className='trending-card-glow' style={{ background: `radial-gradient(60% 80% at 80% 50%, ${config.glow}, transparent 70%)` }} />
                                <div className='trending-card-ring' style={{ boxShadow: `inset 0 0 30px ${config.glow}`, borderColor: config.border }} />
                                <div className='trending-card-content'>
                                    <RarityPill rarity={rarity} />
                                    <div>
                                        <p>{champion.name}</p>
                                        <span>{champion.title}</span>
                                        <strong className='trending-price'>
                                            <BlueEssenceIcon />
                                            <span>{getChampionBlueEssence(champion).toLocaleString()}</span>
                                        </strong>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

