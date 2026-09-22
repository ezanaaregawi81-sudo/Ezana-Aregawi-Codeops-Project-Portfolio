'use client';

import { useRouter } from 'next/navigation';
import { useBasket } from '../../../lib/basket-context';

export default function AddToBasketButton({ dish }) {
  const router = useRouter();
  const { addLine } = useBasket();

  function handleClick() {
    addLine(dish);
    router.push('/cart');
  }

  return (
    <button type="button" className="sk-btn sk-btn--solid sk-btn--full" onClick={handleClick}>
      Add {dish.name} to basket
    </button>
  );
}
