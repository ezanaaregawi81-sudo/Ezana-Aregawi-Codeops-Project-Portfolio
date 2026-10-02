'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import CategoryList from './CategoryList';

// Client because the selected category lives in the URL (?category=Main) and a layout
// never receives searchParams. Reading the URL here, in a leaf, instead of in the
// server page is what keeps /menu static (ISR) rather than dynamic.
export default function CategoryBar({ categories }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === '/menu' ? (searchParams.get('category') ?? 'All') : null;

  return <CategoryList categories={categories} active={active} />;
}
