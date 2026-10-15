'use client';

import { useEffect, useRef } from 'react';

// Why disabled={pending} isn't enough: `pending` turns true only after React re-renders, and two
// taps (or a double Enter) can both land before that. Each submit then starts its own action. In
// the day 44 test, two clicks in the same instant placed two orders.
//
// The handler this returns lets the first submit through and cancels the rest until that one has
// finished (pending went true, then false again). A cancelled submit event never reaches the
// form's action.
export function useSubmitOnce(pending) {
  const inFlight = useRef(false);

  useEffect(() => {
    if (!pending) inFlight.current = false;
  }, [pending]);

  return (event) => {
    if (inFlight.current) {
      event.preventDefault();
      return;
    }
    inFlight.current = true;
  };
}
