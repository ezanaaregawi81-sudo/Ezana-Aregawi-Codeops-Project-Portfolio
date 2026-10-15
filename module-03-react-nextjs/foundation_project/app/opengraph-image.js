import { ImageResponse } from 'next/og';

// The link-preview card (1200×630) every page shares, rendered once at build time.
// Only text and colour, in the app's green and gold: no emoji (they'd be fetched from a CDN)
// and no remote photo, so the build never depends on another server.
export const alt = 'Addis Eats: Ethiopian food from Bole, Addis Ababa, delivered and paid with TeleBirr';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: 'linear-gradient(120deg, #226e44 0%, #2e8b57 60%, #d4a017 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.9 }}>Addis Eats</div>
        <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.08, marginTop: 20 }}>Ethiopian food from Bole, to your door.</div>
        <div style={{ fontSize: 32, marginTop: 30, opacity: 0.92 }}>Order online, pay with TeleBirr, CBE Birr or cash on delivery.</div>
      </div>
    ),
    size,
  );
}
