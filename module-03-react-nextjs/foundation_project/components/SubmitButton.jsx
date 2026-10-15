'use client';

import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

// A submit button for server-action forms that sends one request per tap, however fast the
// taps come. Client only because useFormStatus reads the parent <form>'s pending state; the
// form itself stays a server-rendered server-action form that works with JavaScript off.
//
// disabled={pending} alone isn't enough: `pending` turns true only after React re-renders, and a
// double click lands two submits before that (measured: two cancel requests for one double
// click). So the first click is remembered, and any further click is cancelled until the
// action has finished.
export default function SubmitButton({ children, pendingText, className, style }) {
  const { pending } = useFormStatus();
  const sent = useRef(false);

  useEffect(() => {
    if (!pending) sent.current = false;
  }, [pending]);

  function onClick(event) {
    if (sent.current) {
      event.preventDefault();
      return;
    }
    sent.current = true;
  }

  return (
    <button type="submit" className={className} style={style} disabled={pending} onClick={onClick}>
      {pending ? pendingText : children}
    </button>
  );
}
