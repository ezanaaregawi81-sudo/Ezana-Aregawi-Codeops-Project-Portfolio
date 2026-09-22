'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { addToCart, getCart, removeFromCart, updateItemQuantity } from '@/lib/cart';
import { getDishById } from '@/lib/dishes';
import { useCartContext } from '../Providers';

export default function CartPage({ searchParams }) {
  const resolvedSearchParams = use(searchParams);
  const [cartItems, setCartItems] = useState([]);
  const { refreshCart } = useCartContext();

  useEffect(() => {
    const addDishId = resolvedSearchParams?.add;
    let nextItems = getCart();

    if (addDishId) {
      const dish = getDishById(addDishId);
      if (dish) {
        nextItems = addToCart(dish);
      }
    }

    setCartItems(nextItems);
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSearchParams]);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0),
    [cartItems],
  );
  const deliveryFee = cartItems.length > 0 ? 100 : 0;
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + deliveryFee + tax;

  const handleQtyChange = (id, nextQty) => {
    const normalizedQty = Number(nextQty) || 1;
    const updatedItems = updateItemQuantity(id, normalizedQty);
    setCartItems(updatedItems);
    refreshCart();
  };

  const handleRemove = (id) => {
    const updatedItems = removeFromCart(id);
    setCartItems(updatedItems);
    refreshCart();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Your Food Order Cart</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review your selected Ethiopian dishes before checking out.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.length === 0 ? (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛒</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Add some signature Ethiopian dishes to get started.</p>
              <Link href="/menu" className="btn btn-primary" id="empty-cart-menu-link">
                Browse the Menu
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{item.image}</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Qty:
                      <select
                        value={item.qty}
                        onChange={(event) => handleQtyChange(item.id, event.target.value)}
                        style={{
                          marginLeft: '0.5rem',
                          background: '#1c1f26',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          padding: '0.25rem 0.5rem',
                          colorScheme: 'dark',
                        }}
                        aria-label={`Quantity for ${item.name}`}
                      >
                        {[1, 2, 3, 4, 5].map((qty) => (
                          <option key={qty} value={qty} style={{ background: '#1c1f26', color: 'var(--text-primary)' }}>
                            {qty}
                          </option>
                        ))}
                      </select>
                      × {Number(item.price || 0)} ETB
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
                    {Number(item.price || 0) * Number(item.qty || 0)} ETB
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', alignItems: 'center' }}>
                    <Link href={`/menu/${item.id}`} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}>
                      View Dish
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--accent-red)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Link href="/menu" className="btn btn-secondary" id="cart-continue-shopping-link">
                &larr; Add More Dishes
              </Link>
            </div>
          )}
        </div>

        <div className="card" style={{ height: 'fit-content', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>{subtotal} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee (Addis)</span>
              <span>{deliveryFee} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>VAT (15%)</span>
              <span>{tax} ETB</span>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent-gold)' }}>{total} ETB</span>
            </div>
          </div>

          <Link href={cartItems.length > 0 ? '/checkout' : '/menu'} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} id="cart-proceed-checkout-btn">
            {cartItems.length > 0 ? 'Proceed to Checkout →' : 'Choose Dishes First'}
          </Link>
        </div>
      </div>
    </div>
  );
}
