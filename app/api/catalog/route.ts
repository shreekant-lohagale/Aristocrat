import { getCatalog } from '@/lib/catalog/products';
export async function GET() { return Response.json(await getCatalog(), { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600' } }); }
