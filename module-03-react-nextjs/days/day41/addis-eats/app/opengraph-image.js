import { ImageResponse } from 'next/og';
import { getAllDishes } from '@/lib/dishes';

// The 1200×630 link preview for any page without its own. Built at build time; Next writes the
// og:image / twitter:image tags with absolute URLs thanks to metadataBase.
export const alt = 'Addis Eats: authentic Ethiopian food delivered, with prices for doro wat, special kitfo and more';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  // Real dishes and prices from the menu data, so the card can only show what we sell.
  const featured = getAllDishes().filter((dish) => dish.popular).slice(0, 3);

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 84px', background: '#f8f3ec', color: '#2b2420' }}>
        <div style={{ fontSize: 32, color: '#a8432a' }}>Addis Eats</div>
        <div style={{ fontSize: 70, lineHeight: 1.06, marginTop: 18, color: '#3a8656' }}>Authentic Ethiopian food, delivered</div>
        <div style={{ fontSize: 28, color: '#6b5f54', marginTop: 18 }}>Fresh teff injera, slow-simmered wats and fasting platters across Addis Ababa.</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          {featured.map((dish) => (
            <div key={dish.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px', borderRadius: 999, background: '#ffffff', border: '2px solid #e7dacb', fontSize: 26 }}>
              <div style={{ display: 'flex' }}>{dish.name.replace(/\s*\(.*\)$/, '')}</div>
              <div style={{ display: 'flex', color: '#a8432a' }}>{dish.priceFormatted}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
