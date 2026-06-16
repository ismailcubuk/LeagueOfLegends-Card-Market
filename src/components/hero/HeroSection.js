import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineLeft, AiOutlineRight, AiOutlineStar } from 'react-icons/ai';
import { Check, Heart, Play, ShoppingCart } from 'lucide-react';
import PriceAmount from '../common/PriceAmount';
import HeroStat from './HeroStat';
import { getChampionBlueEssence } from '../component/championPrices';
import { championSplashImage } from '../../utils/championMedia';
import { rarityFor } from '../../utils/championMeta';

export default function HeroSection({ heroChampion, heroChampionOwned, heroChampionInCart, featured, activeHeroIndex, setActiveHeroIndex, heroProgress, setHeroPaused, showPrevHero, showNextHero, heroTextParent, heroTextItem, addToCart, preloadChampionDetails, openChampionModal, favoriteIds, toggleHeroFavorite }) {
    if (!heroChampion) return null;

    return (
        <section className={`hero-section rarity-${rarityFor(heroChampion)}`} onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)}>
            <AnimatePresence mode='sync'>
                <motion.div key={heroChampion.id} className='hero-image-layer' initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                    <img className='hero-bg' src={championSplashImage(heroChampion.id)} alt={heroChampion.name} />
                </motion.div>
            </AnimatePresence>
            <div className='hero-shade' />
            <button type='button' className='hero-nav hero-nav-left' onClick={showPrevHero} aria-label='Previous featured champion'><AiOutlineLeft /></button>
            <button type='button' className='hero-nav hero-nav-right' onClick={showNextHero} aria-label='Next featured champion'><AiOutlineRight /></button>
            <div className='hero-content'>
                <AnimatePresence mode='wait'>
                    <motion.div key={heroChampion.id} variants={heroTextParent} initial='hidden' animate='show' exit='exit'>
                        <motion.div variants={heroTextItem} className='hero-meta'>
                            <span className='hero-rarity'><AiOutlineStar />{rarityFor(heroChampion)}</span>
                            <span>Featured Â· {heroChampion.tags[0] || heroChampion.partype || 'Runeterra'}</span>
                        </motion.div>
                        <motion.h1 variants={heroTextItem}>{heroChampion.name}</motion.h1>
                        <motion.h2 variants={heroTextItem}>{heroChampion.title}</motion.h2>
                        <motion.p variants={heroTextItem}>{heroChampion.blurb}</motion.p>
                        <motion.div variants={heroTextItem} className='hero-stats'>
                            <HeroStat label='Attack' value={heroChampion.info.attack} tone='attack' />
                            <HeroStat label='Magic' value={heroChampion.info.magic} tone='magic' />
                            <HeroStat label='Defense' value={heroChampion.info.defense} tone='defense' />
                            <HeroStat label='Mobility' value={heroChampion.info.difficulty} tone='difficulty' />
                        </motion.div>
                        <motion.div variants={heroTextItem} className='hero-actions'>
                            <button type='button' className='hero-unlock' disabled={heroChampionOwned || heroChampionInCart} onClick={() => addToCart(heroChampion)}>
                                {heroChampionOwned || heroChampionInCart ? <Check size={16} strokeWidth={2.6} /> : <ShoppingCart size={16} strokeWidth={2.4} />}
                                {heroChampionOwned ? 'In Collection' : heroChampionInCart ? 'In Cart' : (
                                    <>
                                        <span>Add to Cart</span>
                                        <PriceAmount value={getChampionBlueEssence(heroChampion)} />
                                    </>
                                )}
                            </button>
                            <button type='button' className='hero-preview' onMouseEnter={() => preloadChampionDetails(heroChampion.id)} onClick={() => openChampionModal(heroChampion)}>
                                <Play size={16} strokeWidth={2.4} />
                                Preview
                            </button>
                            <button type='button' className={`hero-like ${favoriteIds.has(heroChampion.id) ? 'is-wished' : ''}`} onClick={(event) => toggleHeroFavorite(event, heroChampion)} aria-label={favoriteIds.has(heroChampion.id) ? `Remove ${heroChampion.name} from favorites` : `Add ${heroChampion.name} to favorites`}>
                                <Heart size={20} strokeWidth={2.2} />
                            </button>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className='hero-dots'>
                {featured.map((champion, index) => (
                    <button type='button' key={champion.id} className={index === activeHeroIndex % featured.length ? 'active' : ''} onClick={() => setActiveHeroIndex(index)} aria-label={`Show ${champion.name}`}>
                        {index === activeHeroIndex % featured.length ? <span style={{ width: `${heroProgress * 100}%` }} /> : null}
                    </button>
                ))}
            </div>
        </section>
    );
}
