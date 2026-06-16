import { AiOutlineClose } from 'react-icons/ai';
import { Check, Heart, ShoppingCart } from 'lucide-react';
import PriceAmount from '../../components/common/PriceAmount';
import { getChampionBlueEssence } from '../../domain/championPrices';
import { championLoadingImage } from '../../utils/championMedia';

export default function FavoritesPanel({ favorites, ownedChampions, cartItems, addToCart, removeFromCart, removeFavorite, clearFavorites, openChampionModal }) {
    const hasFavorites = favorites.length > 0;

    return (
        <section className='favorites-panel' aria-label='Favorite champions'>
            <div className='favorites-panel-head'>
                <div>
                    <span>
                        <Heart size={15} strokeWidth={2.4} />
                        Favorites
                    </span>
                    <strong>{favorites.length} saved</strong>
                </div>
                {hasFavorites ? (
                    <button type='button' onClick={clearFavorites}>
                        Clear
                    </button>
                ) : null}
            </div>

            {hasFavorites ? (
                <div className='favorites-list'>
                    {favorites.map((champion) => {
                        const owned = ownedChampions.some((card) => card.id === champion.id);
                        const inCart = cartItems.some((card) => card.id === champion.id);

                        return (
                            <article
                                className='favorite-item'
                                key={champion.id}
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
                                <div className='favorite-item-art'>
                                    <img src={championLoadingImage(champion.id)} alt='' loading='lazy' />
                                </div>
                                <div className='favorite-item-copy'>
                                    <strong>{champion.name}</strong>
                                    <span>{champion.title}</span>
                                    <PriceAmount value={getChampionBlueEssence(champion)} />
                                </div>
                                <div className='favorite-item-actions'>
                                    <button
                                        type='button'
                                        className='favorite-icon-button'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeFavorite(champion.id);
                                        }}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        aria-label={`Remove ${champion.name} from favorites`}
                                    >
                                        <AiOutlineClose />
                                    </button>
                                    <button
                                        type='button'
                                        className='favorite-add-button'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            inCart ? removeFromCart(champion.id) : addToCart(champion);
                                        }}
                                        onKeyDown={(event) => event.stopPropagation()}
                                        disabled={owned}
                                    >
                                        {owned || inCart ? <Check size={14} strokeWidth={2.8} /> : <ShoppingCart size={14} strokeWidth={2.4} />}
                                        <span>{owned ? 'Owned' : inCart ? 'Added' : 'Cart'}</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                <div className='favorites-empty'>
                    <Heart size={30} strokeWidth={2.1} />
                    <strong>No favorites yet</strong>
                    <span>Use the heart button on champion cards.</span>
                </div>
            )}
        </section>
    );
}


