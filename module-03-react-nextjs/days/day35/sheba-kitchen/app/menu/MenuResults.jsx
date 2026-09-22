'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DishGrid from './DishGrid';

export default function MenuResults({ dishes }) {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const simulateError = searchParams.get('error') === 'true';
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    setIsPending(true);
    const timer = setTimeout(() => setIsPending(false), 1000);
    return () => clearTimeout(timer);
  }, [category, simulateError]);

  if (isPending) {
    return <div className="sk-skeleton" style={{ height: '180px', borderRadius: 'var(--sk-r-md)' }} />;
  }

  if (simulateError) {
    throw new Error('Failed to load the menu. Please try again.');
  }

  const visibleDishes = category ? dishes.filter((dish) => dish.category === category) : dishes;

  if (visibleDishes.length === 0) {
    return (
      <div className="sk-empty">
        <span className="sk-empty-icon" aria-hidden="true">
          🍽️
        </span>
        <h2 style={{ fontSize: '1.1rem' }}>No dishes in this category</h2>
        <p className="sk-subtitle">Try a different category.</p>
      </div>
    );
  }

  return <DishGrid dishes={visibleDishes} />;
}
