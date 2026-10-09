import { ImageResponse } from 'next/og';

// The link preview for every page that doesn't make its own: 1200×630, rendered once at build
// time. Next writes the og:image / twitter:image tags with absolute URLs (metadataBase).
export const alt = 'Addis Eats: a shared injera platter of wats, greens and ayib, with the line "Authentic Ethiopian food, delivered"';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The home page's hero (Wikimedia Commons, Shiefrallo, CC BY-SA 4.0), as Wikimedia's 1280px
// thumbnail rather than the 3 MB original. The credit is printed on the card.
const PHOTO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Injera%2C_Ethiopian%27s_traditional_food.JPG/1280px-Injera%2C_Ethiopian%27s_traditional_food.JPG';

async function loadPhoto() {
  try {
    const res = await fetch(PHOTO, { headers: { 'User-Agent': 'AddisEats/1.0 (link preview)' } });
    if (!res.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    return null; // the card still renders, just without the photo
  }
}

export default async function Image() {
  const photo = await loadPhoto();

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#faf5ea', color: '#2b2420' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 56px 0 72px', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 30, color: '#d9723f' }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: '#d9723f' }} />
            Addis Eats
          </div>
          <div style={{ fontSize: 64, lineHeight: 1.05, color: '#2f5233' }}>Authentic Ethiopian food, delivered</div>
          <div style={{ fontSize: 27, color: '#6f6156', lineHeight: 1.4 }}>
            Doro wat, special kitfo, tibs and fasting platters on fresh teff injera, across Addis Ababa.
          </div>
        </div>
        {photo && (
          <div style={{ width: 520, height: 630, display: 'flex', position: 'relative' }}>
            <img src={photo} width={520} height={630} style={{ objectFit: 'cover' }} alt="" />
            <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
              Photo: Shiefrallo, CC BY-SA 4.0
            </div>
          </div>
        )}
      </div>
    ),
    size
  );
}
