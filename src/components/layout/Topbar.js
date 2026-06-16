import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import { Check, Gift, Heart, Menu, Search, ShoppingCart } from 'lucide-react';
import BlueEssenceIcon from '../common/BlueEssenceIcon';
import PriceAmount from '../common/PriceAmount';
import CartPanel from '../cart/CartPanel';
import FavoritesPanel from '../favorites/FavoritesPanel';
import { profileIconImage } from '../../config/profileIcons';
import { LOL_ICON_URL } from '../../utils/championMedia';

export default function Topbar({
    activeLink,
    marketNavLinks,
    profileNavLink,
    handleNavClick,
    openStoreView,
    search,
    handleChange,
    clearSearch,
    walletRef,
    walletCatching,
    displayMoney,
    dailyRewardButtonRef,
    dailyRewardAvailable,
    dailyRewardAmount,
    handleDailyRewardClaim,
    favoritesDropdownRef,
    favoritesButtonRef,
    favoritesOpen,
    setFavoritesOpen,
    favoritesCatching,
    favoriteItems,
    myCardsArr,
    cartItems,
    addToCart,
    removeFromCart,
    removeFavorite,
    clearFavorites,
    openChampionModal,
    cartDropdownRef,
    cartButtonRef,
    cartOpen,
    setCartOpen,
    cartCatching,
    cartTotal,
    cartMissingBalance,
    money,
    clearCart,
    checkoutCart,
    recentCardsTargetRef,
    showCollectionFlights,
    selectedProfileIconId,
    setMobileFiltersOpen,
}) {
    return (
        <header className='topbar'>
            <div className='topbar-inner'>
                <a href='#marketplace' className='brand' aria-label='Nexus home' onClick={openStoreView}>
                    <span className='brand-mark'>
                        <img src={LOL_ICON_URL} alt='League of Legends' />
                    </span>
                    <div className='brand-copy'>
                        <span>League</span>
                        <small>Champion Marketplace</small>
                    </div>
                </a>
                <div className='topbar-links'>
                    {marketNavLinks.map((link) => (
                        <a key={link.label} href={link.href} className={activeLink === link.label ? 'active' : ''} onClick={(event) => handleNavClick(event, link)}>
                            {link.label}
                            {activeLink === link.label ? <span className='topbar-link-underline' aria-hidden='true' /> : null}
                        </a>
                    ))}
                </div>
                <label className='top-search'>
                    <Search size={17} strokeWidth={2.2} />
                    <input type='text' spellCheck='false' placeholder='Search champions, roles, regions...' value={search} onChange={handleChange} />
                    {search ? (
                        <button type='button' onClick={clearSearch} aria-label='Clear search'>
                            <AiOutlineClose />
                        </button>
                    ) : <kbd>/</kbd>}
                </label>
                <motion.div ref={walletRef} key={money} className={`wallet-pill ${walletCatching ? 'is-catching' : ''}`} initial={{ scale: 1 }} animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 0.35 }}>
                    <span className='wallet-coin'><BlueEssenceIcon /></span>
                    <span>{displayMoney.toLocaleString()}</span>
                </motion.div>
                <button ref={dailyRewardButtonRef} type='button' className={`daily-reward-button ${dailyRewardAvailable ? 'is-available' : 'is-claimed'}`} onClick={handleDailyRewardClaim} disabled={!dailyRewardAvailable}>
                    {dailyRewardAvailable ? <Gift size={16} strokeWidth={2.4} /> : <Check size={16} strokeWidth={2.6} />}
                    <span>{dailyRewardAvailable ? 'Claim' : 'Claimed'}</span>
                    {dailyRewardAvailable ? <PriceAmount value={dailyRewardAmount} /> : null}
                </button>
                <div className='favorites-dropdown-shell' ref={favoritesDropdownRef}>
                    <button
                        ref={favoritesButtonRef}
                        type='button'
                        className={`favorites-pill ${favoritesOpen ? 'is-open' : ''} ${favoritesCatching ? 'is-catching' : ''}`}
                        onClick={() => {
                            setFavoritesOpen((open) => !open);
                            setCartOpen(false);
                        }}
                        aria-label={`${favoriteItems.length} favorite champions`}
                        aria-expanded={favoritesOpen}
                        aria-haspopup='dialog'
                    >
                        <Heart size={17} strokeWidth={2.4} />
                        <span>{favoriteItems.length}</span>
                    </button>
                    <AnimatePresence>
                        {favoritesOpen ? (
                            <motion.div className='favorites-dropdown' initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
                                <FavoritesPanel favorites={favoriteItems} ownedChampions={myCardsArr} cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} removeFavorite={removeFavorite} clearFavorites={clearFavorites} openChampionModal={openChampionModal} />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                <div className='cart-dropdown-shell' ref={cartDropdownRef}>
                    <button
                        ref={cartButtonRef}
                        type='button'
                        className={`cart-pill ${cartOpen ? 'is-open' : ''} ${cartCatching ? 'is-catching' : ''}`}
                        onClick={() => {
                            setCartOpen((open) => !open);
                            setFavoritesOpen(false);
                        }}
                        aria-label={`${cartItems.length} cards in cart`}
                        aria-expanded={cartOpen}
                        aria-haspopup='dialog'
                    >
                        <ShoppingCart size={17} strokeWidth={2.4} />
                        <span>{cartItems.length}</span>
                    </button>
                    <AnimatePresence>
                        {cartOpen ? (
                            <motion.div className='cart-dropdown' initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.16, ease: 'easeOut' }}>
                                <CartPanel cartItems={cartItems} cartTotal={cartTotal} cartMissingBalance={cartMissingBalance} money={money} removeFromCart={removeFromCart} clearCart={clearCart} checkoutCart={checkoutCart} collectionTargetRef={recentCardsTargetRef} onCollectionFlights={showCollectionFlights} openChampionModal={openChampionModal} />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
                {profileNavLink ? (
                    <a href={profileNavLink.href} className={`topbar-profile-link ${activeLink === profileNavLink.label ? 'active' : ''}`} onClick={(event) => handleNavClick(event, profileNavLink)} aria-label='Open profile'>
                        <span className='topbar-profile-icon'>
                            <img src={profileIconImage(selectedProfileIconId)} alt='' />
                        </span>
                        <span className='topbar-profile-label'>Profile</span>
                        {activeLink === profileNavLink.label ? <span className='topbar-link-underline' aria-hidden='true' /> : null}
                    </a>
                ) : null}
                <button type='button' className='icon-button mobile-menu-button' onClick={() => setMobileFiltersOpen(true)} aria-label='Menu'>
                    <Menu size={20} strokeWidth={2.2} />
                </button>
            </div>
        </header>
    );
}
