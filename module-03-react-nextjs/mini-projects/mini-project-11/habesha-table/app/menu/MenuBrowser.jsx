'use client';

import { useState } from 'react';
import CategoryTabs from './CategoryTabs';
import DishCollection from './DishCollection';

export default function MenuBrowser({ allDishes, categories }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredDishes =
    activeCategory === 'All'
      ? allDishes
      : allDishes.filter((d) => d.category === activeCategory);

  return (
    <>
      {/* Category Filter Bar */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Filtered Dishes Grid */}
      <DishCollection dishes={filteredDishes} />
    </>
  );
}
