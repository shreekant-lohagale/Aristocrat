import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'House of Aristocrat — Modern Indo-Western Fashion';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: '#141414', color: '#FFFFFF', fontFamily: 'serif' }}>
        <div style={{ position: 'absolute', width: 680, height: 680, borderRadius: '50%', border: '1px solid rgba(251, 169, 44, 0.42)', right: -175, top: -156 }} />
        <div style={{ position: 'absolute', width: 510, height: 510, borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.11)', right: -88, top: -72 }} />
        <div style={{ display: 'flex', width: '100%', padding: '68px 82px', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FBA92C', fontFamily: 'sans-serif', fontSize: 19, fontWeight: 600, letterSpacing: 7, textTransform: 'uppercase' }}>
            Everyday Luxury
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 830 }}>
            <div style={{ display: 'flex', fontSize: 70, letterSpacing: 5, lineHeight: 1, textTransform: 'uppercase' }}>House of Aristocrat</div>
            <div style={{ display: 'flex', marginTop: 24, color: '#FBA92C', fontSize: 62, fontStyle: 'italic', lineHeight: 1 }}>Modern Indo-Western Fashion</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', fontFamily: 'sans-serif', fontSize: 22, letterSpacing: 1.2 }}>
            Timeless Indian elegance, designed for the contemporary woman.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
