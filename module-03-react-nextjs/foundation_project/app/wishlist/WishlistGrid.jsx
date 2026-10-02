'use client';

import Link from 'next/link';
import { useShop } from '@/components/Providers';

// Client because the wishlist is private to this browser. Like DishFilter, it never
// renders a dish itself: the server-rendered cards arrive as `children` and the ones
// not on the wishlist are hidden with CSS.
export default function WishlistGrid({ ids, children }) {
  const { wishlist, loaded } = useShop();

  if (!loaded) {
    return <p className="result-count">Loading your wishlist…</p>;
  }

  const wished = ids.filter((id) => wishlist.includes(id));

  if (wished.length === 0) {
    return (
      <div className="empty-state">
        <p>Your wishlist is empty.</p>
        <Link href="/menu" className="btn">
          Browse the Menu
        </Link>
      </div>
    );
  }

  const hiddenSelector = ids
    .filter((id) => !wishlist.includes(id))
    .map((id) => `#dish-${id}`)
    .join(',');

  return (
    <>
      {hiddenSelector && <style>{`${hiddenSelector}{display:none}`}</style>}
      {children}
    </>
  );
}
