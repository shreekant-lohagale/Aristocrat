import { ImageResponse } from 'next/og';
import { headers } from 'next/headers';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const alt = 'House of Aristocrat — Everyday Elegance';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const fontDirectory = path.join(process.cwd(), 'public', 'fonts');
const playfairRegular = readFile(path.join(fontDirectory, 'PlayfairDisplay-Regular.ttf'));
const playfairItalic = readFile(path.join(fontDirectory, 'PlayfairDisplay-Italic.ttf'));
const poppinsRegular = readFile(path.join(fontDirectory, 'Poppins-Regular.ttf'));

function assetUrl(origin: string, file: string) {
  const url = new URL('/api/assets', origin);
  url.searchParams.set('file', file);
  return url.toString();
}

export default async function OpenGraphImage() {
  const [playfair, playfairEmphasis, poppins] = await Promise.all([playfairRegular, playfairItalic, poppinsRegular]);
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'localhost:3000';
  const protocol = requestHeaders.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const origin = `${protocol}://${host}`;
  const hero = assetUrl(origin, 'new images/WhatsApp Image 2026-08-31 at 11.09.10 PM.jpeg');
  const logo = assetUrl(origin, 'House_of_Aristocrat_Logo_Transparent_2000px.png');

  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', overflow: 'hidden', background: '#001D3D', color: '#FCF7F0' }}>
        {/* The metadata renderer requires native image elements for remote assets. */}
        <img src={hero} alt="" width={1200} height={1600} style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 1600 }} />

        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', background: 'linear-gradient(90deg, rgba(0,29,61,0.98) 0%, rgba(1,27,60,0.88) 27%, rgba(1,27,60,0.50) 47%, rgba(71,37,35,0.18) 67%, rgba(95,43,31,0.08) 100%)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', background: 'linear-gradient(180deg, rgba(0,20,44,0.10), rgba(0,16,36,0.24))' }} />

        <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', alignItems: 'center', padding: '58px 68px' }}>
          <div style={{ display: 'flex', width: '46%', alignItems: 'center' }}>
            <img src={logo} alt="House of Aristocrat — Everyday Fashion" width={400} height={76} style={{ display: 'block', width: 400, height: 76 }} />
          </div>

          <div style={{ display: 'flex', width: '54%', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 180 }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Playfair Display', fontSize: 76, letterSpacing: -4, lineHeight: 0.84 }}>
              <span style={{ display: 'flex', color: '#FCF7F0' }}>Everyday</span>
              <span style={{ display: 'flex', marginLeft: 36, color: '#BD9569', fontStyle: 'italic' }}>Elegance</span>
            </div>

            <p style={{ display: 'flex', maxWidth: 370, margin: '30px 0 0', color: 'rgba(252,247,240,0.92)', fontFamily: 'Poppins', fontSize: 18, letterSpacing: 0.15, lineHeight: 1.5 }}>
              Modern Indian silhouettes, made for the way you live now.
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Playfair Display', data: playfair, style: 'normal', weight: 400 },
        { name: 'Playfair Display', data: playfairEmphasis, style: 'italic', weight: 400 },
        { name: 'Poppins', data: poppins, style: 'normal', weight: 400 },
      ],
    },
  );
}
