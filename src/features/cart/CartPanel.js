import { useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { Check, ShoppingCart } from 'lucide-react';
import PriceAmount from '../../components/common/PriceAmount';
import { getChampionBlueEssence } from '../../domain/championPrices';
import { championLoadingImage } from '../../utils/championMedia';

export default function CartPanel({ cartItems, cartTotal, cartMissingBalance, money, removeFromCart, clearCart, checkoutCart, collectionTargetRef, onCollectionFlights, openChampionModal }) {
    const hasItems = cartItems.length > 0;
    const cartListRef = useRef(null);

    const handleCheckout = () => {
        if (!hasItems || cartMissingBalance > 0) {
            return;
        }

        const targetRect = collectionTargetRef?.current?.getBoundingClientRect();
        const itemNodes = cartListRef.current ? Array.from(cartListRef.current.querySelectorAll('[data-cart-item-id]')) : [];

        if (targetRect && itemNodes.length > 0) {
            const flights = cartItems.map((champion, index) => {
                const itemRect = itemNodes[index]?.getBoundingClientRect();

                if (!itemRect) {
                    return null;
                }

                const startWidth = 58;
                const startHeight = 78;
                const startX = itemRect.left + 8;
                const startY = itemRect.top + itemRect.height / 2 - startHeight / 2;
                const columnOffset = (index % 5) * 18;
                const rowOffset = Math.floor(index / 5) * 14;
                const endX = targetRect.left + 54 + columnOffset - startX - startWidth / 2;
                const endY = targetRect.top + targetRect.height / 2 + rowOffset - startY - startHeight / 2;

                return {
                    id: `${champion.id}-collection-${Date.now()}-${index}`,
                    championId: champion.id,
                    left: `${startX}px`,
                    top: `${startY}px`,
                    width: `${startWidth}px`,
                    height: `${startHeight}px`,
                    '--flight-x': `${endX}px`,
                    '--flight-y': `${endY}px`,
                    '--flight-delay': `${index * 70}ms`,
                };
            }).filter(Boolean);

            onCollectionFlights?.(flights);
        }

        checkoutCart();
    };

    return (
        <aside className='cart-panel' aria-labelledby='cart-panel-title'>
            <div className='cart-panel-heading'>
                <div>
                    <span><ShoppingCart size={16} strokeWidth={2.4} />Cart</span>
                    <h3 id='cart-panel-title'>{cartItems.length} Cards</h3>
                </div>
                {hasItems ? (
                    <button type='button' className='cart-clear' onClick={clearCart}>
                        Clear
                    </button>
                ) : null}
            </div>

            {hasItems ? (
                <div className='cart-list' ref={cartListRef}>
                    {cartItems.map((champion) => (
                        <div
                            className='cart-item'
                            key={champion.id}
                            data-cart-item-id={champion.id}
                            role='button'
                            tabIndex='0'
                            onClick={() => openChampionModal(champion)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    openChampionModal(champion);
                                }
                            }}
                            aria-label={`Preview ${champion.name}`}
                        >
                            <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                            <div>
                                <strong>{champion.name}</strong>
                                <PriceAmount value={getChampionBlueEssence(champion)} />
                            </div>
                            <button
                                type='button'
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeFromCart(champion.id);
                                }}
                                onKeyDown={(event) => event.stopPropagation()}
                                aria-label={`Remove ${champion.name} from cart`}
                            >
                                <AiOutlineClose />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='cart-empty'>
                    <ShoppingCart size={22} strokeWidth={2.2} />
                    <span>No cards selected</span>
                </div>
            )}

            <div className='cart-totals'>
                <div>
                    <span>Total Blue Essence</span>
                    <PriceAmount value={cartTotal} />
                </div>
                <div>
                    <span>After Purchase</span>
                    <PriceAmount value={Math.max(money - cartTotal, 0)} />
                </div>
            </div>

            <button type='button' className='cart-checkout' onClick={handleCheckout} disabled={!hasItems || cartMissingBalance > 0}>
                <Check size={16} strokeWidth={2.6} />
                Buy All
            </button>
        </aside>
    );
}


