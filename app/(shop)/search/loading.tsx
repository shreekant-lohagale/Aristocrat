import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';

export default function SearchLoading() {
  return <main className="page shell"><ProductGridSkeleton count={8} /></main>;
}
