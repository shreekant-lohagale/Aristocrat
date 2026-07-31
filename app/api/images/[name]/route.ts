import { readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safeName = basename(decodeURIComponent(name));
  if (!safeName.endsWith('.webp')) return new Response('Not found', { status: 404 });
  try { return new Response(await readFile(join(process.cwd(), 'files', safeName)), { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable' } }); }
  catch { return new Response('Not found', { status: 404 }); }
}
