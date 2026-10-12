import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getDishById } from '@/lib/dishes';

// One 1200×630 preview card per dish, made with ImageResponse from the dish record. It replaces
// the site-wide card on /menu/[id].
const size = { width: 1200, height: 630 };

// Each dish card gets its own alt text.
export async function generateImageMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  return [{ id: 'card', size, contentType: 'image/png', alt: dish ? `${dish.name} from Addis Eats, ${dish.priceFormatted}` : 'Addis Eats' }];
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return new ImageResponse(<div style={{ display: 'flex' }}>Addis Eats</div>, size);

  const photo = await readFile(join(process.cwd(), 'public', 'images', 'dishes', `${dish.id}.jpg`));
  const summary = dish.description.match(/^[^.!?]+[.!?]/)?.[0] ?? dish.description;
  const line = summary.length > 115 ? `${summary.slice(0, 112).replace(/\s+\S*$/, '')}…` : summary;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f8f3ec', color: '#2b2420', padding: 40, gap: 46 }}>
        <img src={`data:image/jpeg;base64,${photo.toString('base64')}`} width={450} height={550} style={{ objectFit: 'cover', borderRadius: 26 }} alt="" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 26, color: '#a8432a' }}>{`Addis Eats · ${dish.category}`}</div>
          <div style={{ display: 'flex', fontSize: dish.name.length > 24 ? 50 : 62, lineHeight: 1.06, color: '#3a8656' }}>{dish.name}</div>
          <div style={{ display: 'flex', fontSize: 26, color: '#6b5f54', lineHeight: 1.4 }}>{line}</div>
          <div style={{ display: 'flex', alignSelf: 'flex-start', padding: '10px 22px', borderRadius: 14, background: '#a8432a', color: '#fff8f1', fontSize: 40 }}>
            {dish.priceFormatted}
          </div>
        </div>
      </div>
    ),
    size
  );
}
