'use client';

import Link from 'next/link';
import { useCartContext } from './Providers';

export default function CartNavLink() {
  const { itemCount } = useCartContext();

  return (
    <Link href="/cart" className="nav-link cart-link" id="nav-cart-link">
      🛒 Cart{itemCount > 0 ? ` (${itemCount})` : ''}
    </Link>
  );
}
