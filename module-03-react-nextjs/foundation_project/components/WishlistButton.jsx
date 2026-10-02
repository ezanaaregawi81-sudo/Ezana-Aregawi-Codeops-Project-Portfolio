'use client';

import { useShop } from './Providers';

// Client because it handles onClick and reads/writes the wishlist store.
// `variant="icon"` is the heart on a dish card; `variant="full"` is the dish page button.
export default function WishlistButton({ dishId, dishName, variant = 'icon' }) {
  const { wishlist, toggleWishlist } = useShop();
  const wished = wishlist.includes(dishId);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        className={`wish-btn${wished ? ' wish-btn--active' : ''}`}
        onClick={() => toggleWishlist(dishId)}
        aria-pressed={wished}
        aria-label={`${wished ? 'Remove' : 'Add'} ${dishName} ${wished ? 'from' : 'to'} wishlist`}
      >
        <span aria-hidden="true">{wished ? '♥' : '♡'}</span>
      </button>
    );
  }

  return (
    <button type="button" className={`btn btn--outline${wished ? ' btn--wished' : ''}`} onClick={() => toggleWishlist(dishId)} aria-pressed={wished}>
      {wished ? '♥ In Wishlist' : '♡ Add to Wishlist'}
    </button>
  );
}
