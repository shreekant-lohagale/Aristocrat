import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton';

export default function CollectionsLoading() {
  return <main className="collection-page shell"><ProductGridSkeleton count={8} /></main>;
}
