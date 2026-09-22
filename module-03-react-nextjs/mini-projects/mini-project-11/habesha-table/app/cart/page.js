'use client';

import Link from 'next/link';
import { use, useEffect, useMemo, useState } from 'react';
import { addToBasket, getOrderBasket, removeFromBasket, updateBasketItemQuantity } from '@/lib/order-basket';
import { getMenuItemById } from '@/lib/menu-catalog';

export default function CartPage({ searchParams }) {
  const resolvedSearchParams = use(searchParams);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const addDishId = resolvedSearchParams?.add;
    let nextItems = getOrderBasket();

    if (addDishId) {
      const dish = getMenuItemById(addDishId);
      if (dish) {
        nextItems = addToBasket(dish);
      }
    }

    setCartItems(nextItems);
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
    const updatedItems = updateBasketItemQuantity(id, normalizedQty);
    setCartItems(updatedItems);
  };

  const handleRemove = (id) => {
    const updatedItems = removeFromBasket(id);
    setCartItems(updatedItems);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '2.2rem', fontWeight: '700', marginBottom: '0.25rem' }}>Your Food Order Cart</h1>
      <p style={{ color: 'var(--ht-ink-soft)', marginBottom: '2rem' }}>Review your selected Ethiopian dishes before checking out.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
        <div className="ht-panel" style={{ height: 'fit-content', padding: '1.75rem' }}>
          <h3 style={{ fontFamily: 'var(--ht-font-head)', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem', borderBottom: '1px solid var(--ht-border)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ht-ink-soft)' }}>Subtotal</span>
              <span>{subtotal} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ht-ink-soft)' }}>Delivery Fee (Addis)</span>
              <span>{deliveryFee} ETB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--ht-ink-soft)' }}>VAT (15%)</span>
              <span>{tax} ETB</span>
            </div>

            <div style={{ borderTop: '1px dashed var(--ht-border)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--ht-accent-strong)' }}>{total} ETB</span>
            </div>
          </div>

          <Link href={cartItems.length > 0 ? '/checkout' : '/menu'} className="ht-btn ht-btn--primary" style={{ width: '100%', padding: '0.9rem' }} id="cart-proceed-checkout-btn">
            {cartItems.length > 0 ? 'Proceed to Checkout →' : 'Choose Dishes First'}
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.length === 0 ? (
            <div className="ht-panel" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛒</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Your cart is empty</h3>
              <p style={{ color: 'var(--ht-ink-soft)', marginBottom: '1rem' }}>Add some signature Ethiopian dishes to get started.</p>
              <Link href="/menu" className="ht-btn ht-btn--primary" id="empty-cart-menu-link">
                Browse the Menu
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="ht-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '2.5rem' }}>{item.image}</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--ht-ink-soft)' }}>
                      Qty:
                      <select
                        value={item.qty}
                        onChange={(event) => handleQtyChange(item.id, event.target.value)}
                        style={{
                          marginLeft: '0.5rem',
                          background: 'var(--ht-surface)',
                          border: '1px solid var(--ht-border)',
                          borderRadius: '6px',
                          color: 'var(--ht-ink)',
                          padding: '0.25rem 0.5rem',
                          colorScheme: 'light',
                        }}
                        aria-label={`Quantity for ${item.name}`}
                      >
                        {[1, 2, 3, 4, 5].map((qty) => (
                          <option key={qty} value={qty} style={{ background: 'var(--ht-surface)', color: 'var(--ht-ink)' }}>
                            {qty}
                          </option>
                        ))}
                      </select>
                      × {Number(item.price || 0)} ETB
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ht-accent-strong)' }}>
                    {Number(item.price || 0) * Number(item.qty || 0)} ETB
                  </span>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem', alignItems: 'center' }}>
                    <Link href={`/menu/${item.id}`} style={{ fontSize: '0.8rem', color: 'var(--ht-ink-soft)', textDecoration: 'underline' }}>
                      View Dish
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--ht-danger)',
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
              <Link href="/menu" className="ht-btn ht-btn--secondary" id="cart-continue-shopping-link">
                &larr; Add More Dishes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
