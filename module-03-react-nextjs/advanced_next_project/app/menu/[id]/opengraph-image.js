import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { dishPhotoSrc } from '@/lib/dish-photos';
import { getDishById } from '@/lib/dishes';

// One 1200×630 preview card per dish, made from the dish record at build time. This is what a
// dish link looks like when it's pasted into a chat. It replaces the site-wide card for this page.
const size = { width: 1200, height: 630 };

// Lets each dish card carry its own alt text (a plain `alt` export would be one string for all).
export async function generateImageMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  return [
    {
      id: 'card',
      size,
      contentType: 'image/png',
      alt: dish ? `${dish.name} from Addis Eats, ${dish.priceFormatted}` : 'Addis Eats',
    },
  ];
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return new ImageResponse(<div style={{ display: 'flex' }}>Addis Eats</div>, size);

  const photo = await readFile(join(process.cwd(), 'public', dishPhotoSrc(dish)));
  // No emoji: the renderer would have to fetch emoji artwork from a CDN for every card.
  const spice = dish.spiceLevel.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
  const firstLine = dish.description.split('. ')[0].replace(/\.$/, '');
  const line = firstLine.length > 110 ? `${firstLine.slice(0, 107).replace(/\s+\S*$/, '')}…` : firstLine;
  const tags = [dish.category, spice, ...(dish.isFasting && !dish.category.includes('Fasting') ? ['Fasting'] : [])];

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#faf5ea', color: '#2b2420', padding: 40, gap: 48 }}>
        <img
          src={`data:image/jpeg;base64,${photo.toString('base64')}`}
          width={460}
          height={550}
          style={{ objectFit: 'cover', borderRadius: 28 }}
          alt=""
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
          <div style={{ fontSize: 26, color: '#d9723f' }}>Addis Eats</div>
          <div style={{ fontSize: dish.name.length > 24 ? 50 : 60, lineHeight: 1.08, color: '#2f5233' }}>{dish.name}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 22 }}>
            {tags.map((tag) => (
              <div key={tag} style={{ display: 'flex', padding: '6px 16px', borderRadius: 999, border: '2px solid #e6d9c4', color: '#6f6156' }}>
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 25, color: '#6f6156', lineHeight: 1.4 }}>{line}</div>
          <div style={{ display: 'flex', alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 16, background: '#d9723f', color: '#fffdf8', fontSize: 40 }}>
            {dish.priceFormatted}
          </div>
        </div>
      </div>
    ),
    size
  );
}
