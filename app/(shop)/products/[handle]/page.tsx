import { notFound } from 'next/navigation';
import { BackButton } from '@/components/common/BackButton';
import { ProductDetails } from '@/components/product/ProductDetails';
import { getCatalog, getProduct } from '@/lib/catalog/products';
export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) { const { handle } = await params; const product = await getProduct(handle); if (!product) notFound(); const related = (await getCatalog()).filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4); return <main className="product-page shell"><BackButton /><ProductDetails product={product} related={related} /></main>; }