import { ProductDetailsSkeleton } from '@/components/ui/ProductDetailsSkeleton';
import { Navbar } from '@/components/layout/Navbar';

export default function ProductLoading() {
  return <><Navbar solid /><main className="product-page"><ProductDetailsSkeleton /></main></>;
}
