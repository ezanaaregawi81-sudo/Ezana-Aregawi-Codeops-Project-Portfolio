// Shared by every dish photo. Safe to import from client components (no data, no secrets).

// Every file in public/images/dishes is 1200×900. next/image needs the real size to reserve the
// box before the file arrives and to pick which resized copy to serve.
export const DISH_PHOTO = { width: 1200, height: 900 };

export function dishPhotoSrc(dish) {
  return `/images/dishes/${dish.id}.jpg`;
}

// Alt text describes what is on the plate, not only the name already shown in the heading.
// (The files in public/images/dishes are generated stand-ins; this text describes the dish
// photo each one stands in for. See PERF.md.)
export function dishPhotoAlt(dish) {
  const firstSentence = dish.description.split('.')[0];
  return `${dish.name}: ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}`;
}

// The card photo is a 140px column beside the text, and a full-width strip once the card stacks
// below 620px (viewport minus 1.5rem page padding and 1.5rem card padding on each side).
export const DISH_CARD_SIZES = '(max-width: 620px) calc(100vw - 6rem), 140px';
