'use client';

import { useEffect, useState } from 'react';

// Holds back `value` until it has stayed the same for `wait` ms.
export function useDebounce(value, wait = 350) {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setSettled(value), wait);
    return () => clearTimeout(timeout);
  }, [value, wait]);

  return settled;
}
