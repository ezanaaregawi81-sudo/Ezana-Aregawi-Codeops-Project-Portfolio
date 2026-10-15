# Day 44: Keyboard and touch pass

**Method:** no mouse at all. A script drove Chrome with real **Tab / Shift+Tab / Enter / Escape** key presses and typing, against `next build && next start`, on 9 pages:
- `/`, `/menu`, `/menu/doro-wat`, `/cart`, `/checkout`
- `/orders`, `/orders/[id]`
- `/kitchen` and `/kitchen/reports`, signed in as staff

For each page it recorded:
- every Tab stop and whether a focus ring showed
- anything with a pointer cursor that the keyboard couldn't reach
- every control smaller than 44 × 44px at a 390px phone width

It ran once on the day 43 code, then after each fix.

## Results

| | Day 43 code | Now |
|---|---|---|
| Pointer-only elements (clickable divs or spans) | 0 | 0 |
| Tab stops with no visible focus | 1: the menu search box (`outline: none`) | 0 of 160 |
| Focus ring | Chrome's 1px default | 3px dark brown, 3px offset |
| Dead Tab stops | 2: the map markers | 0 |
| Controls under 44px at 390px wide | **94** across the 9 pages | **0** |
| Two clicks on "Place Order" in the same instant | **2 orders** | **1 order** |
| Hover-only information | 1: "Track this order" was only in a `title` tooltip | 0 |
| Unknown dish URL | 200 (soft 404) | 404 |

## 1. Clickable elements and visible focus

- **No clickable divs.** Every `onClick` in the app was already on a `<button>` or a `<Link>`, and the audit found nothing with a pointer cursor outside a focusable control.
- **Things fixed on the way:**
  - **The favourites +/− in the menu sidebar** were 24px buttons named only "-" and "+". They're now 44px, named "One fewer favourite" / "One more favourite", with the count announced (`aria-live`). They also have `type="button"`.
  - **The sidebar's "Table Note" label** wasn't tied to its input; now it is (`htmlFor`/`id`).
  - **The payment method choice** in checkout is a group of `aria-pressed` toggle buttons. It's now named as a group (`role="group"`, labelled by the "2. Payment Method" heading).
    - It stays as buttons on purpose. Each is a Tab stop chosen with Enter. Radio buttons would need the arrow keys, and Enter on a radio submits the form.
- **The focus ring:**
  - `:focus-visible { outline: 3px solid var(--text-primary); outline-offset: 3px }`.
  - It shows on every keyboard stop and not on mouse clicks. It's visible on the terracotta buttons and the cream page alike.
- **The menu search box** had `outline: none` and only a faint 15%-opacity glow. Its pill now carries the same ring through `:focus-within`.
- **Skip to content:** the first Tab stop on every page, jumping past the header into `<main>`.
- **Focus after a failed submit:** the submit buttons are disabled while pending, so focus used to drop to `<body>` when the result came back.
  - Checkout now focuses the first field marked `aria-invalid="true"`. Each field points at its error with `aria-describedby`.
  - Sign-in focuses the email field.

## 2. Every function by Tab, Enter and Escape

**A whole order, by keyboard only:**
1. From `/menu`: 10 Tabs to the Doro Wat card, then **Enter**.
2. Tab to **Add to Cart**, then **Enter**.
3. 8 Tabs to **Checkout** in the header, then **Enter**.
4. Type name and phone, then the area: typing "K" in the select picks Kazanchis.
5. Type the notes, choose a payment method with **Enter**, then **Place Order** with **Enter**.

**Everything else works the same way:**
- **Cart:** quantity and remove.
- **My Orders:** Cancel order.
- **Tracking:** Leaflet's zoom buttons.
- **Kitchen reports:** sort links, paging, the "Show the figures as a table" `<summary>` and the CSV download.

**Escape:** the only thing that "opens" in this app is a search.
- **Escape in the menu search box** now clears it and brings the category list back. Focus stays in the box.
- Chrome did this already for a `type="search"` box, but Firefox and Safari don't, so it's handled explicitly.
- A visible hint under the box says so: "Press Esc to clear".
- **Tested:** typing "tibs" showed results, and Escape emptied the box with focus still on it.

**The header on a phone** wraps onto two rows (brand and Cart, then the links). Every link is on-screen and reachable, so it needed no extra menu.

## 3. One order per double tap

All three forms already had `disabled={pending}`. Tested on the day 43 code:
- **Double Enter:** 1 order.
- **Two clicks in the same instant:** **2 orders.** `pending` only flips after a re-render, and both submits came before it.

**The fix, in two layers:**
1. **`lib/use-submit-once.js`:** an `onSubmit` that cancels every submit after the first until that one finishes. A cancelled submit never reaches the form action. Used by checkout and cancel order.
2. **A `requestId` for each checkout visit:** generated in the browser after hydration and sent as a hidden field. `createOrder` remembers `requestId → order` per account and returns the existing order for a repeat.
   - `POST /api/orders` takes the same as an `Idempotency-Key` header.
   - Tested on its own: the same key three times, two at once, gave **1** order. A new key gave a new order.

**Now:**
- Double Enter: **1** order.
- Two simultaneous clicks: **1**.
- A touch double tap on the 164 × 69px button at 390px: **1**.

(The first touch test placed 0 because the script tapped before scrolling the button into view. With the scroll, it's 1.)

## 4. Touch targets and hover

- **0 controls under 44 × 44px** on all 9 pages at 390px. What was raised:
  - nav links (36px → 44), the brand link
  - every `.btn` (37–43px → 44)
  - the category pills (35px)
  - the "Trigger Error UI" link (31px)
  - the search input (25px tall inside its pill)
  - checkout and sign-in inputs (41px)
  - the sidebar quick links (21px)
  - the sort links (20px), the "← Kitchen Order Board" back link (18px), the report `<summary>` (25px)
  - **Cancel order:** bare 0.8rem text, **15px** tall. Now a 44px outlined button.
  - Leaflet's zoom buttons (30px) and its attribution links
- **Hover:**
  - **The one piece of hover-only information** was on My Orders: "Track this order" lived only in the order link's `title` tooltip, which touch and keyboard users never see. The link now reads "AE-… · Track →" on screen.
  - **Every `:hover` rule** only changes colour or a small lift. None reveals content.
