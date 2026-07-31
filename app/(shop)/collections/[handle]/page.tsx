import { ProductGrid } from '@/components/collection/ProductGrid';
export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) { const { handle } = await params; return <main><section className="page shell"><p className="eyebrow">The Mahera edit</p><h1>{handle.replaceAll('-', ' ')}</h1></section><ProductGrid /></main>; }
