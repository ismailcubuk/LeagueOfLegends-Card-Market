import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Eye, Heart, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import { getChampionBlueEssence } from '../component/championPrices';
import { championLoadingImage } from '../../utils/championMedia';
import { rarityConfig, rarityFor } from '../../utils/championMeta';

export default function ChampionCard({ champion, owned = false, inCart = false, favorite = false, justBought = false, onAction, onOpen, onFavoriteToggle, cartTargetRef, favoriteTargetRef, onCartFlight, onFavoriteFlight }) {
    const rarity = rarityFor(champion);
    const config = rarityConfig[rarity];
    const isHolo = rarity === 'legendary' || rarity === 'mythic';
    const primaryRole = champion.tags[0] || 'Champion';
    const blueEssence = getChampionBlueEssence(champion);
    const cardRef = useRef(null);
    const [hovered, setHovered] = useState(false);
    const [inCompare, setInCompare] = useState(false);
    const [cartAnimating, setCartAnimating] = useState(false);
    const [favoriteAnimating, setFavoriteAnimating] = useState(false);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3, -3]), { stiffness: 250, damping: 24 });
    const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 250, damping: 24 });
    const glareX = useTransform(mx, [-0.5, 0.5], ['0%', '100%']);

    const handleMove = (event) => {
        const element = cardRef.current;

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        mx.set((event.clientX - rect.left) / rect.width - 0.5);
        my.set((event.clientY - rect.top) / rect.height - 0.5);
    };

    const resetTilt = () => {
        mx.set(0);
        my.set(0);
        setHovered(false);
    };

    const toggleWished = (event) => {
        event.stopPropagation();

        if (!favorite && favoriteAnimating) {
            return;
        }

        if (!favorite) {
            setFavoriteAnimating(true);

            const cardRect = cardRef.current?.getBoundingClientRect();
            const favoriteRect = favoriteTargetRef?.current?.getBoundingClientRect();

            if (cardRect && favoriteRect) {
                const startWidth = Math.min(cardRect.width * 0.48, 94);
                const startHeight = startWidth * 1.36;
                const startX = cardRect.left + cardRect.width / 2 - startWidth / 2;
                const startY = cardRect.top + cardRect.height / 2 - startHeight / 2;
                const endX = favoriteRect.left + favoriteRect.width / 2 - startX - startWidth / 2;
                const endY = favoriteRect.top + favoriteRect.height / 2 - startY - startHeight / 2;

                onFavoriteFlight?.({
                    id: `${champion.id}-favorite-${Date.now()}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--favorite-flight-x': `${endX}px`,
                    '--favorite-flight-y': `${endY}px`,
                });
            }

            window.setTimeout(() => setFavoriteAnimating(false), 760);
            window.setTimeout(() => onFavoriteToggle?.(champion), 720);
            return;
        }

        onFavoriteToggle?.(champion);
    };

    const toggleCompare = (event) => {
        event.stopPropagation();
        setInCompare((current) => !current);
    };

    const previewChampion = (event) => {
        event.stopPropagation();
        onOpen(champion);
    };

    const handleMediaKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpen(champion);
        }
    };

    const handleAction = () => {
        if (!owned && !inCart && cartAnimating) {
            return;
        }

        if (!owned && !inCart) {
            setCartAnimating(true);

            const cardRect = cardRef.current?.getBoundingClientRect();
            const cartRect = cartTargetRef?.current?.getBoundingClientRect();

            if (cardRect && cartRect) {
                const startWidth = Math.min(cardRect.width * 0.56, 112);
                const startHeight = startWidth * 1.36;
                const startX = cardRect.left + cardRect.width / 2 - startWidth / 2;
                const startY = cardRect.top + cardRect.height / 2 - startHeight / 2;
                const endX = cartRect.left + cartRect.width / 2 - startX - startWidth / 2;
                const endY = cartRect.top + cartRect.height / 2 - startY - startHeight / 2;

                onCartFlight?.({
                    id: `${champion.id}-${Date.now()}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--flight-x': `${endX}px`,
                    '--flight-y': `${endY}px`,
                });
            }

            window.setTimeout(() => setCartAnimating(false), 860);
            window.setTimeout(() => onAction(champion), 760);
            return;
        }

        onAction(champion);
    };

    return (
        <motion.article
            ref={cardRef}
            className={`market-card rarity-${rarity} ${justBought ? 'is-purchase-animating' : ''} ${cartAnimating ? 'is-cart-animating' : ''} ${favoriteAnimating ? 'is-favorite-animating' : ''}`}
            onMouseMove={handleMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={resetTilt}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1000,
                '--card-rarity-border': hovered ? config.color : 'var(--border)',
                '--card-rarity-glow': hovered ? config.glow : 'rgba(0,0,0,0.6)',
            }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className='market-card-media' onClick={() => onOpen(champion)} onKeyDown={handleMediaKeyDown} role='button' tabIndex='0' aria-label={`${champion.name} details`}>
                <img src={championLoadingImage(champion.id)} alt={champion.name} loading='lazy' draggable='false' />
                <span className='market-card-vignette' />
                <span className='market-card-glow' style={{ background: `radial-gradient(70% 50% at 50% 100%, ${config.glow}, transparent 70%)` }} />
                {justBought ? (
                    <span className='purchase-burst' aria-hidden='true'>
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                ) : null}
                {isHolo ? <motion.span className='market-card-holo' aria-hidden style={{ backgroundPositionX: glareX }} animate={hovered ? { backgroundPosition: ['0% 0%', '200% 200%'] } : {}} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} /> : null}
                <span className='market-card-top'>
                    <span
                        className='market-card-rarity'
                        style={{ color: config.color, borderColor: config.border, backgroundColor: `color-mix(in srgb, #070b12 78%, ${config.color})` }}
                    >
                        {isHolo ? <Sparkles size={12} strokeWidth={2.2} aria-hidden='true' /> : null}
                        {config.label}
                    </span>
                    {owned ? (
                        <span className='market-card-owned'>
                            <Check size={12} strokeWidth={3} aria-hidden='true' />
                            Owned
                        </span>
                    ) : null}
                </span>
                <span className='market-card-quick-actions'>
                    <button type='button' className='market-card-icon-action' onClick={previewChampion} aria-label={`Preview ${champion.name}`}>
                        <Eye size={16} strokeWidth={2.2} />
                    </button>
                    <button type='button' className={`market-card-icon-action ${favorite ? 'is-wished' : ''}`} onClick={toggleWished} aria-label={favorite ? `Remove ${champion.name} from favorites` : `Add ${champion.name} to favorites`}>
                        <Heart size={16} strokeWidth={2.2} />
                    </button>
                    <button type='button' className={`market-card-icon-action ${inCompare ? 'is-compare' : ''}`} onClick={toggleCompare} aria-label='Compare'>
                        <Plus size={16} strokeWidth={2.2} />
                    </button>
                </span>
            </div>
            <div className='market-card-body'>
                <div className='market-card-title-row'>
                    <div>
                        <h3>{champion.name}</h3>
                        <p>{champion.title}</p>
                    </div>
                    <span className='market-card-role-badge'>{primaryRole}</span>
                </div>
                <div className='market-card-footer'>
                    <div className='market-card-price'>
                        <span aria-hidden='true'><BlueEssenceIcon /></span>
                        <strong>{blueEssence.toLocaleString()}</strong>
                    </div>
                    <motion.button type='button' whileTap={{ scale: 0.94 }} className={owned ? 'sell-action' : `buy-action ${inCart ? 'is-in-cart' : ''}`} onClick={handleAction} disabled={owned}>
                        {owned || inCart ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.4} />}
                        <span className='buy-action-label'>{owned ? 'Owned' : inCart ? 'Added' : 'Cart'}</span>
                        {cartAnimating ? (
                            <span className='button-cart-effect' aria-hidden='true'>
                                <span className='button-cart-sweep' />
                                <span className='button-cart-ring' />
                                <span className='button-cart-burst'>
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </span>
                            </span>
                        ) : null}
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
}

